# ACPaaS UI Embeddable Widgets

This library enables cross-framework embedding of a part of one application into a page of another application at run-time using iframes.

An application part that can be embedded is called a widget. The app which publishes the widget is called the publisher. The app which embeds the published widget into a page is called the container.

Widgets can declare API's that are available in the container's page, even if container and publisher are implemented in different front-end frameworks.

## Using

### Including

A first step for both publishing and embedding is including the widgets library into the page.

```html
<script src="//cdn.antwerpen.be/aui_embeddable_widgets/1.0.0/aui-embeddable-widgets.min.js"></script>
```

If you don't want to load from CDN, you can also `npm install @acpaas-ui/embeddable-widgets` and you will find the library in the `node_modules/@acpaas-ui/embeddable-widgets/lib` folder.

### Publishing

You can publish any webpage as an embeddable widget.

#### Declaring

First you need to publish the definition of the widget on a web-accessible URL as JSON.

TODO

> It is not required that the definition is hosted on the same server as the widget.

#### Angular

To publish an Angular 6+ app, use the Angular wrapper [ngx-embeddable-widgets].

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

const MyWidget = window.auiEmbeddedWidgets.reactComponent(
  // url to the definition
  "//example.com/path/to/defintion.json",
  // overrides for the definition
  null,
  { React, ReactDOM }
)

class App extends Component {

  onFoo(result) { ... }

  render() {
    return (
      <MyWidget
        fooData={ ['one', 'two'] }
        onFoo={ result => this.onFoo(result) }
        />
    );
  }
}
```

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

## API

TODO

## Developing

- Run a server publishing the embeddable widgets framework

  ```sh
  npm install
  npm start
  ```

- Point your publisher and container apps to this locally hosted version.

See the [contribution guide](CONTRIBUTING.md) for additional details.

## Design notes

This framework makes use of the [Zoid framework][zoid]], which implements the boilerplate for embedding apps into other apps using iframes and the postMessage API.

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
- [ ] Relay version from parent to child

<!-- external links -->

[ngx-embeddable-widgets]: https://github.com/digipolisantwerp/embeddable-widgets_component_angular
[zoid]: https://github.com/krakenjs/zoid
