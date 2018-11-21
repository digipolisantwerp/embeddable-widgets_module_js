// @ts-nocheck
import chai from 'chai';
import * as widgets from '../lib/aui-embedded-widgets';

const expect = chai.expect;

describe('aui-embedded-widgets', () => {
  it('defines and renders', () => {
    const definition = widgets.define('MyTestWidget', {
      tag: 'my-test-widget',
      url: 'http://example.com',
      defaultLogLevel: 'error',
    });
    expect(definition).to.be.an('object');
    const elem = document.createElement('div');
    expect(elem.innerHTML).not.to.include('<iframe');
    const widget = widgets.render('MyTestWidget', {}, elem);
    expect(elem.innerHTML).to.include('<iframe');
    expect(widget).to.be.an('object');
  });
});
