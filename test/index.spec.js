// @ts-nocheck
import chai from 'chai';
import sinon from 'sinon';
import * as widgets from '../lib/aui-embedded-widgets';

require('mocha-sinon');

const expect = chai.expect;

function randomTag(prefix) {
  return prefix + Math.random().toString(36).substring(7);
}

describe('aui-embedded-widgets', () => {
  it('defines and renders', () => {
    const tag = randomTag('my-test-widget1');
    const definition = widgets.define({
      tag,
      url: 'http://example.com',
      defaultLogLevel: 'error',
    });
    expect(definition).to.be.an('object');
    const elem = document.createElement('div');
    expect(elem.innerHTML).not.to.include('<iframe');
    const widget = widgets.render(tag, {}, elem);
    expect(elem.innerHTML).to.include('<iframe');
    expect(widget).to.be.an('object');
  });

  describe('load', () => {
    let requests = [];
    let xhrMock = null;

    beforeEach(() => {
      xhrMock = sinon.useFakeXMLHttpRequest();
      xhrMock.onCreate = (xhr) => {
        requests.push(xhr);
      };
      requests = [];
    });
    afterEach(() => {
      xhrMock.restore();
    });

    it('loads and renders', (done) => {
      const tag = randomTag('my-test-widget2');
      const fixture = {
        tag,
        url: 'http://example.com',
        defaultLogLevel: 'error',
      };
      widgets
        .load('http://example.com/widget.json', null, true) // force loading
        .then((definition) => {
          expect(definition).to.be.an('object');
          expect(definition.tag).to.equal(tag);
          expect(definition.url).to.equal(fixture.url);
          expect(definition.defaultLogLevel).to.equal(fixture.defaultLogLevel);
          const elem = document.createElement('div');
          expect(elem.innerHTML).not.to.include('<iframe');
          const widget = widgets.render(tag, {}, elem);
          expect(elem.innerHTML).to.include('<iframe');
          expect(widget).to.be.an('object');
          done();
        })
        .catch(err => done(err));
      // respond to xhr to kickstart .then handler
      expect(requests.length).to.equal(1);
      requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture));
    });

    it('only loads once', (done) => {
      const tag = randomTag('my-test-widget3');
      const fixture = {
        tag,
        url: 'http://example.com',
      };
      const uniqueUrl = randomTag('http://example.com/json/widget3');
      Promise.all([widgets.load(uniqueUrl), widgets.load(uniqueUrl)]).then((results) => {
        expect(results.length).to.equal(2);
        expect(results[0]).to.equal(results[1]);
        expect(results[0]).to.be.an('object');
        expect(results[0].tag).to.equal(tag);
        done();
      });
      // respond to xhr to kickstart .then handler
      expect(requests.length).to.equal(1);
      requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture));
    });
  });
});
