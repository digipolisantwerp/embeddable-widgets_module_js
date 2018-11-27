import { Promise } from 'es6-promise';
import zoid from 'zoid/dist/zoid.frame';

// registered widgets
const widgets = {};
// maps url to promise or widget
const fetchedUrls = {};

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

function isDefined(tag) {
  return !!widgets[tag];
}

function define(definition) {
  if (!definition.tag) {
    throw new Error('unable to define a widget without a tag');
  }
  const tag = definition.tag;
  if (widgets[tag]) {
    // zoid does not support defining a component with the same tag multiple times
    throw new Error(`"${tag}" was defined previously`);
  } else {
    // TODO: apply sane defaults (defaultLogLevel, tag, prerenderTemplate, ...)
    widgets[tag] = zoid.create(definition);
    return widgets[tag];
  }
}

/**
 * Load a widget definition from a url
 * @param {string} url The URL hosting the widget's JSON
 * @param {object} overrides Overrides to apply to the JSON prior to defining the widget
 * @param {boolean} force Force loading even if already loaded.
 *                        Use only if you know what you're doing.
 */
function load(url, overrides, force) {
  const loaded = fetchedUrls[url];
  // don't load if already loading or loaded, unless forced
  if (!loaded || force) {
    // start loading and cache the promise
    fetchedUrls[url] = xhrGet(url).then((response) => {
      // TODO: normalize URL
      const options = Object.assign(JSON.parse(response), overrides, { originalUrl: url });
      const definition = define(options);
      fetchedUrls[url] = definition;
      return definition;
    });
  }
  return fetchedUrls[url];
}

function render(identifier, options, elem) {
  return widgets[identifier].render(options, elem);
}

export {
  define,
  isDefined,
  load,
  render,
};
