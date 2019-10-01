// @ts-nocheck
import chai from 'chai';
import sinon from 'sinon';
import * as widgets from '../src/index';

require('mocha-sinon');

const expect = chai.expect;

function randomTag(prefix) {
  return (
    prefix
    + Math.random()
      .toString(36)
      .substring(7)
  );
}

describe('aui-embeddable-widgets', () => {
  it('defines and renders', () => {
    // Test fails: https://github.com/krakenjs/zoid/issues/271
    const tag = randomTag('my-test-widget1');
    const definition = widgets.define({
      tag,
      url: 'http://example.com/',
      defaultLogLevel: 'error',
      dimensions: {
        width: '500px',
        height: '500px',
      },
    });
    expect(definition.component).to.be.an('function');
    expect(widgets.isDefined(tag)).to.equal(true);
    const elem = document.createElement('div');
    expect(elem.innerHTML).not.to.include('<iframe');
    const widget = widgets.render(tag, { }, elem);
    expect(elem.innerHTML).to.include('<iframe');
    expect(widget).to.be.an('object');
  });

  it('needs a tag to define', () => {
    expect(() => widgets.define({
      url: 'http://example.com/',
    })).to.throw();
  });

  it('only renders defined widgets', () => {
    expect(() => widgets.render('no-such-widget')).to.throw();
  });

  it('transforms props defaultValue', () => {
    const tag = randomTag('my-test-widget4');
    const inputDefinition = {
      tag,
      url: 'http://example.com/',
      props: {
        test: {
          type: 'string',
          defaultValue: 'foo',
        },
      },
    };
    const definition = widgets.define(inputDefinition);
    expect(definition.componentDefinition.props.test.default).to.be.a('function');
    expect(definition.componentDefinition.props.test.default()).to.equal('foo');
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

    it('needs a URL', (done) => {
      widgets.load().catch((err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('needs a URL in the definition', (done) => {
      const tag = randomTag('my-broken-widget');
      const fixture = {
        tag,
      };
      widgets
        .load('http://example.com/widget.json', null, true) // force loading
        .catch((err) => {
          expect(err).to.be.an('error');
          done();
        });
      // respond to xhr to kickstart .then handler
      expect(requests.length).to.equal(1);
      requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture));
    });

    it('loads and renders', (done) => {
      const tag = randomTag('my-test-widget2');
      const fixture = {
        tag,
        url: 'http://example.com/',
        defaultLogLevel: 'error',
      };
      widgets
        .load('http://example.com/widget.json', null, true) // force loading
        .then((definition) => {
          expect(definition).to.be.an('object');
          expect(definition.componentDefinition.tag).to.equal(tag);
          expect(definition.componentDefinition.url).to.equal(fixture.url);
          expect(definition.componentDefinition.defaultLogLevel).to.equal(fixture.defaultLogLevel);
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
        expect(results[0].componentDefinition.tag).to.equal(tag);
        done();
      });
      // respond to xhr to kickstart .then handler
      expect(requests.length).to.equal(1);
      requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture));
    });

    it('transforms a relative URL', (done) => {
      const tag = randomTag('my-test-widget3');
      const fixture = {
        tag,
        url: '../widget/',
        defaultLogLevel: 'error',
      };
      widgets
        .load('http://example.com/definition/my-test-widget3.json', null, true) // force loading
        .then((definition) => {
          expect(definition).to.be.an('object');
          expect(definition.componentDefinition.tag).to.equal(tag);
          expect(definition.componentDefinition.url).to.equal('http://example.com/widget/');
          done();
        })
        .catch(err => done(err));
      // respond to xhr to kickstart .then handler
      expect(requests.length).to.equal(1);
      requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture));
    });
  });
});
