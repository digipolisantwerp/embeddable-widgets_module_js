/* eslint-disable no-param-reassign */
// zoid uses ZalgoPromise, we need to polyfill Promise anyway so just reuse it
// @ts-ignore
import { ZalgoPromise as Promise } from 'zalgo-promise';
import zoid from 'zoid/dist/zoid.frame';
// polyfill URL because @babel/polyfill did not contain it yet
import 'url-polyfill';
import reactComponent from './reactComponent';

// registered widgets, indexed by tag
const widgets = {};
// maps url to promise of widget definition
const fetchedUrls = {};

// defaults applied to widget definitions
const widgetDefaults = {
  defaultLogLevel: 'warn',
  props: {
    // pass ?_aui_api_version=1 in the widget's URL to allow breaking API changes
    _aui_api_version: {
      type: 'string',
      required: false,
      defaultValue: '1',
      queryParam: true,
    },
  },
};

function xhrGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(xhr.statusText));
        }
      }
    };
    xhr.send();
  });
}

function isAbsoluteUrl(url) {
  return /^(http(s)?:)?\/\//i.test(url);
}

/**
 * Returns whether a widget for the given tag is defined.
 * @param {string} tag The widget's tag
 */
function isDefined(tag) {
  return !!widgets[tag];
}

/**
 * Defines a widget from the given definition (typically loaded from JSON).
 * Use this only if you know what you're doing.
 * @param {object} definition The widget's definition
 */
function define(definition) {
  if (!definition.tag) {
    throw new Error('unable to define a widget without a tag');
  }
  const tag = definition.tag;
  if (widgets[tag]) {
    // zoid does not support defining a component with the same tag multiple times
    throw new Error(`"${tag}" was defined previously`);
  } else {
    const options = Object.assign({}, widgetDefaults, definition);
    Object.assign(options.props, widgetDefaults.props, definition.props);
    // convert from JSON to zoid syntax
    if (options.props) {
      // @ts-ignore
      Object.values(options.props).forEach((prop) => {
        if (prop.defaultValue) {
          if (typeof prop.defaultValue === 'function') {
            prop.def = prop.defaultValue;
          } else {
            prop.def = () => prop.defaultValue;
          }
        }
      });
    }
    widgets[tag] = zoid.create(options);
    return widgets[tag];
  }
}

/**
 * Load a widget definition from a url
 * @param {string} url The URL hosting the widget's JSON
 * @param {object=} overrides Overrides to apply to the JSON prior to defining the widget
 * @param {boolean=} force Force loading even if already loaded.
 *                        Use only if you know what you're doing.
 * @return Promise<object> Will return the widget definition object when loaded
 */
function load(url, overrides, force) {
  if (!url) return Promise.reject(new Error('must specify a url to load'));
  const loaded = fetchedUrls[url];
  // don't load if already loading or loaded, unless forced
  if (!loaded || force) {
    // start loading and cache the promise
    fetchedUrls[url] = xhrGet(url).then((response) => {
      const options = Object.assign(JSON.parse(response), overrides, { originalUrl: url });
      if (!options.url) throw new Error('required url property not set in widget JSON');
      // convert relative URL's to absolute
      if (!isAbsoluteUrl(options.url)) {
        options.url = new URL(options.url, isAbsoluteUrl(url) ? url : window.location.href).href;
      }
      const definition = define(options);
      fetchedUrls[url] = definition;
      return definition;
    });
  }
  return fetchedUrls[url];
}

/**
 * Render a widget that was previously loaded
 * @param {string|object} tag A handle to the widget component, or the widget's tag.
 * @param {object} props The props to render the widget with
 * @param {HTMLElement} elem The element to render the widget to
 */
function render(tag, props, elem) {
  if (!tag || (!tag.render && !widgets[tag])) {
    throw new Error(`unable to render, widget "${tag}" is not loaded yet`);
  }
  const component = tag.render ? tag : widgets[tag];
  if (props && props.dimensions) {
    Object.assign(component.dimensions, props.dimensions);
  }
  return component.render(props, elem);
}

/**
 * Render the widget hosted at a specific URL, loading it if needed
 * @param {string} url The URL hosting the widget's JSON
 * @param {object} props The props to render the widget with
 * @param {HTMLElement} elem The element to render the widget to
 * @param {object=} overrides The overrides to apply to the loaded JSON.
 *                      Loading occurs only once, so these are applied once per page.
 * @param {boolean=} force Force loading even if already loaded.
 *                      Use only if you know what you're doing.
 */
function renderUrl(url, props, elem, overrides, force) {
  return load(url, overrides, force).then(widget => render(widget, props, elem));
}

export {
  define,
  isDefined,
  load,
  render,
  renderUrl,
  reactComponent,
};
