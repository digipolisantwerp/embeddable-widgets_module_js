# Digipolis Embeddable Widgets Framework

This framework allows embedding parts of apps into other apps at run-time.

The app which publishes the widget is called the publisher. The app which integrates the published widget is called the container.

## Using

TODO: instructions for how to use this framework

## Developing

* Run a server publishing the embeddable widgets framework

  ```sh
  npm install
  npm start
  ```

* Point your publisher and container apps to this locally hosted version.

## Design notes

This framework is a wrapper around Paypal's [Zoid framework](https://github.com/krakenjs/zoid), which implements the boilerplate for embedding apps into other apps using iframes and the postMessage API.

The wrapper is necessary to allow for a different developer experience which is more suited to the needs of Digipolis development projects.

* Zoid loads widget definitions synchronously from a script tag. This framework loads them asynchronously from JSON
  * no foreign code needs to execute inside the container app, low-risk
  * changes to the JSON's schema are easy to support with framework upgrades
  * no globals aside from the widgets framework itself
* Zoid requires the widget to know its own URL's, this doesn't
  * The widget does not need to known its own absolute URL, because the JSON can have a relative `url`
  * The widget framework uses the absolute URL of the JSON passed to `renderUrl` to determine the URL for the widget page itself
* Zoid supports popup windows, this doesn't
  * It adds a lot of code, and it still is very tricky in IE (see zoid documentation)
* All zoid API's are wrapped to allow replacing zoid later on and to support additional logic
* defaultLogLevel = warn, whereas zoid has defaultLogLevel = info (which is spammy)
  * Can still be overridden by the widget's JSON
* The framework itself is purely client-side, to allow hosting on a CDN.

## Todo

* [ ] Support max-width / max-height when autoResize is enabled
* [ ] Auth token relaying (security topics in general)
