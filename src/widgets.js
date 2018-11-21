// eslint-disable-next-line no-unused-vars
import zoid from 'zoid';

// registered widgets
const widgets = {};

function define(identifier, options) {
  if (widgets[identifier]) {
    throw new Error(`"${identifier}" was defined previously`);
  } else {
    // TODO: apply sane defaults (defaultLogLevel, tag, prerenderTemplate, ...)
    widgets[identifier] = zoid.create(options);
    return widgets[identifier];
  }
}

function render(identifier, options, elem) {
  return widgets[identifier].render(options, elem);
}

export { define, render };
