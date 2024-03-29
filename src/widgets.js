/* eslint-disable no-param-reassign */
// zoid uses ZalgoPromise, we need to polyfill Promise anyway so just reuse it
// @ts-ignore
import { ZalgoPromise as Promise } from 'zalgo-promise';
// polyfill URL because @babel/polyfill did not contain it yet
import 'url-polyfill';
import * as zoid from 'zoid/dist/zoid.frameworks';
import { base64decode } from 'belter';
import deepMerge from 'deepmerge';
import defaultPrerenderTemplate from './templates';

const { create } = zoid;

// registered widgets, indexed by tag
const widgets = {};
// maps url to promise of widget definition
const fetchedUrls = {};

const scrollTo = (elementOffset, tag) => {
  const containerElement = document.querySelector(`[id^='zoid-${tag}-']`);
  const newTopOffset = containerElement.offsetParent.offsetTop + elementOffset;
  window.scrollTo({
    top: newTopOffset,
    behavior: 'smooth',
  });
};

// defaults applied to widget definitions
const widgetDefaults = {
  defaultLogLevel: 'warn',
  // show the AUI spinner
  prerenderTemplate: defaultPrerenderTemplate,
  props: {
    // pass ?_aui_api_version=2 in the widget's URL to allow breaking API changes
    // 1 = zoid 6 (embeddable-widgets v1.x)
    // 2 = zoid 9 (embeddable-widgets v2.x)
    _aui_api_version: {
      type: 'string',
      required: false,
      defaultValue: '2',
      queryParam: true,
    },
    scrollTo: {
      type: 'function',
      required: false,
      defaultValue: () => (yPos, tag) => scrollTo(yPos, tag),
    },
    tag: {
      type: 'string',
      required: false,
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

// extract the overrides sent from the parent through window.name
// see render() for where they are sent
function getParentOverrides() {
  let meta;
  if (window.name) {
    const [, zoidcomp, , encodedOptions] = window.name.split('__');
    if (zoidcomp === 'zoid') {
      try {
        meta = JSON.parse(base64decode(encodedOptions));
      } catch (e) {
        /* */
      }
    }
  }
  return meta && meta.props && meta.props.value ? meta.props.value._aui_overrides : undefined;
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
    const componentDefinition = deepMerge(widgetDefaults, definition);
    // convert from JSON to zoid syntax
    if (componentDefinition.props) {
      // @ts-ignore
      componentDefinition.props.tag.value = () => tag;
      Object.values(componentDefinition.props).forEach((prop) => {
        if (prop.defaultValue) {
          if (typeof prop.defaultValue === 'function') {
            prop.default = prop.defaultValue;
          } else {
            prop.default = () => prop.defaultValue;
          }
        }
      });
    }
    widgets[tag] = {
      component: create(componentDefinition),
      componentDefinition,
    };
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
    // inherit overrides from parent if they exist
    const allOverrides = Object.assign({}, getParentOverrides(), overrides);
    // start loading and cache the promise
    fetchedUrls[url] = xhrGet(url).then((response) => {
      const defaultDefinition = Object.assign(JSON.parse(response), allOverrides, {
        originalUrl: url,
      });
      if (!defaultDefinition.url) throw new Error('required url property not set in widget JSON');
      // convert relative URL's to absolute
      if (!isAbsoluteUrl(defaultDefinition.url)) {
        let baseUrl = isAbsoluteUrl(url) ? url : window.location.href;
        if (baseUrl.substr(0, 2) === '//') {
          baseUrl = (window.location.protocol || 'https:') + baseUrl;
        }
        defaultDefinition.url = new URL(defaultDefinition.url, baseUrl).href;
      }
      const definition = define(defaultDefinition);
      fetchedUrls[url] = definition;
      definition.overrides = overrides;
      return definition;
    });
  }
  return Promise.resolve(fetchedUrls[url]);
}

/**
 * Render a widget that was previously loaded
 * @param {string|object} tag A handle to the widget component, or the widget's tag.
 * @param {object} props The props to render the widget with
 * @param {HTMLElement} elem The element to render the widget to
 * @returns the zoid component instance
 */
function render(tag, props, elem) {
  if (!typeof tag === 'function' || (typeof tag === 'string' && !widgets[tag])) {
    throw new Error(`Unable to render, widget "${tag}" is not loaded yet`);
  }
  const widget = typeof tag === 'string' ? widgets[tag] : tag;
  const def = widget.componentDefinition;

  // pass overrides from parent to child
  props._aui_overrides = widget.overrides;
  const instance = widget.component(props);

  // There is an off-by-one bug in the height calculations because zoid uses offsetHeight
  // which sometimes is rounded down. Force the iframe to resize to 1 px taller to sidestep this.
  if (def.autoResize && def.autoResize.height) {
    let lastHeight = null;
    let newHeight = null;
    instance.event.on('zoid-resize', ({ height }) => {
      // if we're not just responding to our own height change
      if (height && (lastHeight !== height)) {
        newHeight = height + 1;
        // make sure we do this AFTER zoid updates the height
        // delay for 100ms in case multiple events arrive in quick succession
        setTimeout(() => {
          if (lastHeight !== newHeight) {
            lastHeight = newHeight;
            instance.resize({ height: newHeight });
          }
        }, 100);
      }
    });
  }

  instance.render(elem);
  return instance;
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
 * @returns a promise for the rendered component instance
 */
function renderUrl(url, props, elem, overrides, force) {
  return load(url, overrides, force).then(widget => render(widget, props, elem));
}

export {
  define, isDefined, load, render, renderUrl,
};
