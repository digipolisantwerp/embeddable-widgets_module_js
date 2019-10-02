# ACPaaS UI Embeddable Widgets

This library enables cross-framework embedding of a part of one application into a page of another application at run-time using iframes.

An application part that can be embedded is called a widget. The app which publishes the widget is called the publisher. The app which embeds the published widget into a page is called the container.

Widgets can declare API's that are available in the container's page, even if container and publisher are implemented in different front-end frameworks.

## Using

> If you are migrating from v1.x of this framework to v2.x be aware that there are breaking changes, see the [migration notes](#migrating) as well as the [changelog](CHANGELOG.md).

### Including

A first step for both publishing and embedding is including the widgets library into the page.

```html
<script src="https://cdn.antwerpen.be/aui_embeddable_widgets/1.0.7/aui-embeddable-widgets.min.js"></script>
```

If you don't want to load from CDN, you can also `npm install @acpaas-ui/embeddable-widgets` and you will find the library in the `node_modules/@acpaas-ui/embeddable-widgets/lib` folder.

### Publishing

You can publish any webpage as an embeddable widget.

#### Declaring

First you need to publish the definition of the widget on a web-accessible URL as JSON.

```json
{
  "tag": "my-foo-widget",
  "url": "/foo-widget",
  "dimensions": {
    "width": "100%",
    "height": "500px"
  },
  "props": {
    "fooData": {
      "type": "array",
      "required": true
    },
    "onFoo": {
      "type": "function",
      "required": false
    }
  }
}
```

What is going on here:

- The `tag` is a unique identifier for the widget in the page (it is not automatically mapped to a HTML tag).
- The `url` points to where the widget's page is hosted. It can be relative (to the JSON's URL) or absolute.

  > It is not required that the definition is hosted on the same server as the widget.

- The `dimensions` specify the initial rendering dimensions, applies as style attributes to the iframe.
- The `props` specify the properties that the widget can be initialized with
  - `fooData` is an array which will be passed from container to widget
  - `onFoo` is an event handler which will be defined in the container and called by the widget

If you want to render the same component multiple times on the same page but with different definition values.
You will have to `define()` the component with different tags.

See the [API](#API) section below for more details.

> CORS headers need to be set on this JSON (e.g. `Access-Control-Allow-Origin: *`).
> CORS headers do not need to be set on the widget page itself.

#### Angular

To publish an Angular 6+ app, use the Angular wrapper [ngx-embeddable-widgets]. It includes an example app.

#### Other Frameworks

Initialize the widget:

```js
window.auiEmbeddableWidgets.load('//example.com/path/to/definition.json');
```

Access the properties passed from the container in `window.xprops`.

```js
function doFoo() {
  if (window.xprops && window.xprops.fooData) {
    const result = window.xprops.fooData.map(...);
    if (window.xprops.onFoo) {
      window.xprops.onFoo(result);
    }
  }
}
```

> The widget's page does not need cross-origin headers. It communicates to the container via `window.postMessage`. However, it should allow framing by setting appropriate `X-Frame-Options` or `Content-Security-Policy` headers if necessary.

### Embedding

#### Angular

To embed into an Angular 6+ app, use the Angular wrapper [ngx-embeddable-widgets].

#### React

```js
import React from 'react';
import ReactDOM from 'react-dom';

const MyWidget = window.auiEmbeddableWidgets.reactComponent(
  // url to the definition
  "//example.com/path/to/defintion.json",
  { React, ReactDOM }
)

class App extends Component {

  onFoo(result) { ... }

  render() {
    return (
      <MyWidget
        fooData={ ['one', 'two'] }
        onFoo={ result => this.onFoo(result) }
        className="my-widget"
        />
    );
  }
}
```

> This renders a `<div>` with the (optional) `className` applied to it.

#### Other

Provide a div to render the widget in:

```html
<div id="my-container"></div>
```

Render the widget into the div, passing it the necessary properties:

```js
window.auiEmbeddableWidgets.renderUrl(
  '//example.com/path/to/definition.json',
  { fooData: ['one', 'two'],
    onFoo: function(result) { ... } },
  document.getElementById('my-container')
);
```

## Migrating

If you're currently using v1.x of this library in an app or in a widget, care must be taken to upgrade properly. Both app and widget must be running the same major version of the embeddable widgets library.

This library appends the _aui_api_version query parameter to the URL it loads into the iframe. Based on this the appropriate library version should be loaded inside of the widget's page. `v1.x` for `_aui_api_version=1`, and `v2.x` for `_aui_api_version=2`.

To load multiple versions of this library inside the widget's app, you can use the npm feature to have [multiple versions of the same library](https://stackoverflow.com/a/56495651).

A suggested upgrade strategy in case widget and app are separately hosted:
1. Upgrade the widget to interpret `_aui_api_version` and load the appropriate library version.
2. Upgrade the app to use the new major version of the library.

## API

### `window.auiEmbeddableWidgets`

- `define(definition: object, ?overrides: object): object`

  Defines a widget from the specified definition (same as the JSON described above) and returns a composed object with everything required to instantiate a component.
  Object has: 

  - options: the definition with processed default values
  - overrides: the overrides you passed down
  - component: a function to pass the properties to and instantiate

  > Each widget has a unique tag. Each tag can only be defined once in the page, but can be rendered multiple times. However if you want to change the dimension on the same widget, you will have to redefine one with a new tag.

- `isDefined(tag: string): boolean`

  Returns true if the widget is already defined in the page.

- `load(url: string, ?overrides: object): Promise<object>`

  Loads a widget definition from a URL, applies the optional overrides to it, then returns a handle to the widget for instantiating.

- `render(tag: string|object, props: object, elem: HTMLElement): object`

  Renders a previously defined widget with the specified props parameters into the specified element and returns a handle to the instance.
  `tag` can be the widget instance returned from the load operation, or its tag string.

- `renderUrl(url: string, props: object, elem: HTMLElement, ?overrides: object): Promise<object>`

  Loads a widget definition from URL (if not yet loaded), applies the optional overrides to it,
  then renders it to the specified element with the given props parameters.
  Returns a promise for the rendered instance.

- `reactComponent(url: string, deps: object, ?overrides: object): object`

  Creates a React component for the widget with definition hosted at `url`, with the optional overrides applied to that definition.
  The deps object must contain the `React` and `ReactDOM` objects provided by React.

### Definition attributes

The possible attributes for the widget definition:

#### tag `string` [required]

A tag-name for the component, used for:

- Loading the correct component in the child window or frame
- Generating framework drivers
- Logging

```javascript
tag: 'my-component-tag'
```

#### url `string` [required]

The URL that will be loaded when the widget is rendered. Can be relative to the JSON's URL or absolute.

```javascript
url: 'https://example.com/foo-widget'
```

```javascript
url: '/foo-widget'
```

#### dimensions `{ width : string, height : string }`

The initial dimensions for the widget, in css-style units, with support for `px` or `%`.

```javascript
dimensions: {
    width: '300px',
    height: '200px'
}
```

```javascript
dimensions: {
    width: '80%',
    height: '90%'
}
```

#### props `Object<string, Object>`

Props that can be passed to the widget when rendering (data or functions).

```javascript
props: {

    onLogin: {
        type: 'function'
    },

    prefilledEmail: {
        type: 'string',
        required: false
    }
}
```

##### Default props

###### scrollTo(yPos: Numer, tag: String)

Sometimes you need to scroll the page outside the iframe to match an element inside the iframe. In order to do this, from inside the widget the scrollTo prop can be called:

```javascript
this.props.scrollTo(elementOffset, this.props.tag);
```

There is a default handler for `scrollTo` that is provided by the library. You can override it by passing your own implementation as `props.scrollTo`, for example, to compensate for header elements. This is the default implementation:

```javascript
const scrollTo = (elementOffset, tag) => {
  const containerElement = document.querySelector(`[id^='zoid-${tag}-']`);
  const newTopOffset = containerElement.offsetParent.offsetTop + elementOffset;
  window.scrollTo({
    top: newTopOffset,
    behavior: 'smooth',
  });
};
```

> NOTE: `window.scrollTo` is polyfilled by this library.

##### Prop Options

- **type** `string`

  The data-type expected for the prop

  - `'string'`
  - `'number'`
  - `'boolean'`
  - `'object'`
  - `'function'`
  - `'array'`

- **required** `boolean`

  Whether or not the prop is mandatory. Defaults to `true`.

  ```javascript
  onLogin: {
      type: 'function',
      required: false
  }
  ```

- **defaultValue**

  The default value for the prop if not passed at render time. `required` must be false.

  ```javascript
  fooData: {
      type: "array",
      required: false,
      defaultValue: ["one", "two"]
  }
  ```

  This can be any type of value. However if you pass a function, it will be called with `props` as the first argument. So if you want to have a function as `defaultValue`, make sure you wrap it.

- **queryParam** `boolean | string`

  Should a prop be passed in the url (so it can influence the routing)?

  ```javascript
  email: {
      type: 'string',
      queryParam: true // ?email=foo@bar.com
  }
  ```

  If a string is set, this specifies the url param name which will be used.

  ```javascript
  email: {
      type: 'string',
      queryParam: 'user-email' // ?user-email=foo@bar.com
  }
  ```

- **serialization** `string`

  If `json`, the prop will be JSON stringified before being inserted into the url

  ```javascript
  user: {
      type: 'object',
      serialization: 'json' // ?user={"name":"Zippy","age":34}
  }
  ```

  If `dotify` the prop will be converted to dot-notation.

  ```javascript
  user: {
      type: 'object',
      serialization: 'dotify' // ?user.name=Zippy&user.age=34
  }
  ```

  If `base64`, the prop will be JSON stringified then base64 encoded before being inserted into the url

  ```javascript
  user: {
      type: 'object',
      serialization: 'base64' // ?user=eyJuYW1lIjoiWmlwcHkiLCJhZ2UiOjM0fQ==
  }
  ```

#### autoResize `{ height: boolean, width: boolean, element: string }`

Makes the container's iframe resize automatically when the child widget window size changes.

```javascript
autoResize: {
    width: false,
    height: true,
}
```

Note that by default it matches the `body` element of your content.
You can override this setting by specifying a custom selector as an `element` property.

```javascript
autoResize: {
    width: false,
    height: true,
    element: '.my-selector',
}
```

Recommended to only use autoResize for height. Width has some strange effects, especially when scroll bars are present.

#### defaultLogLevel `string`

The default logging level for the widget's internals, helpful for debugging. Options are:

- `'debug'`
- `'info'`
- `'warn'` (default)
- `'error'`

```javascript
defaultLogLevel: 'info'
```

> Note that this value can be overriden by passing `logLevel` as a prop when rendering the component.

#### Additional properties

Check the [Zoid API documentation][zoid-api] for additional properties. The function-based properties can only be specified as overrides, not in the JSON.

## Developing

- Run a server publishing the embeddable widgets framework

  ```sh
  npm install
  npm start
  ```

- Point your publisher and container apps to this locally hosted version.

See the [contribution guide](CONTRIBUTING.md) for additional details.

## Design notes

This framework makes use of the [Zoid framework][zoid], which implements the boilerplate for embedding apps into other apps using iframes and the postMessage API.

The wrapper is necessary to allow for a different developer experience which is more suited to the needs of Digipolis development projects.

- Zoid loads widget definitions synchronously from a script tag. This framework loads them asynchronously from JSON
  - no foreign code needs to execute inside the container app, low-risk
  - changes to the JSON's schema are easy to support with framework upgrades
  - no globals aside from the widgets framework itself
- Zoid requires the widget to know its own URL's, this doesn't
  - The widget does not need to known its own absolute URL, because the JSON can have a relative `url`
  - The widget framework uses the absolute URL of the JSON passed to `renderUrl` to determine the URL for the widget page itself
- Zoid supports popup windows, this doesn't
  - It adds a lot of code, and it still is very tricky in IE (see zoid documentation)
- All zoid API's are wrapped to allow replacing zoid later on and to support additional logic
- defaultLogLevel = warn, whereas zoid has defaultLogLevel = info (which is spammy)
  - Can still be overridden by the widget's JSON
- The framework itself is purely client-side, to allow hosting on a CDN.

## Todo

- [ ] Support max-width / max-height when autoResize is enabled
- [ ] Auth token relaying (security topics in general)

## License

[MIT](./LICENSE.md)

Copyright (c) 2019-present, Digipolis

<!-- external links -->

[ngx-embeddable-widgets]: https://github.com/digipolisantwerp/embeddable-widgets_component_angular
[zoid]: https://github.com/krakenjs/zoid
[zoid-api]: https://github.com/krakenjs/zoid/blob/zoid-v6/docs/api.md
