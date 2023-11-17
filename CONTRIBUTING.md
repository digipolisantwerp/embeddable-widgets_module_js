# Contribution Guidelines

First off, thanks for taking the time to contribute! :+1:

## I just have a question

You can launch a quick question on the [#antwerp-ui slack channel](https://digantcafe.slack.com/messages/CDDLYJU65). If you're not yet a member of our DigAnt Café slack community, you can easily [join here](https://digantcafe-slack.digipolis.be/).

For something that requires longer discussion it may be better to book an issue.

## How do I report bugs / ask features?

Please book a GitHub issue.

## What should I know to get started?

This component is part of the [AUI platform](https://antwerp-ui.digipolis.be).

## How can I contribute code?

### Code layout

- `./src` contains the library source
- `./lib` contains the build output

### Building and Testing

`> npm install`

Commands:

- Start an app hosting the library

  `> npm start`

- Run the tests (continously)

  `> npm run test:watch`

  Code coverage reports are output to the `./coverage` folder.

- Lint and test (once)

  `> npm test`

### Submitting Changes

Please send us your changes as a GitHub pull request.

In order for us to be able to accept your pull request without remarks, please do these things:

- Please stick to the existing style.
- Update the readme documentation along with the code.
- Make sure all the tests pass and there is good coverage.
- Provide a clear description on the pull request of what was changed
- Link to a relevant issue. Feel free to create one if none exists.

If possible, do provide meaningful and clean commit messages. A [good commit message](https://chris.beams.io/posts/git-commit/) completes the sentence "When committed this will …"

### Publishing

> Only the AUI team publishes new releases. [Contact us](https://antwerp-ui.digipolis.be/contact) if you need a new release published.

### Breaking API changes

Both container and widget must have compatible releases of the embeddable widgets library. This means that **breaking changes should be avoided**.
In case of unavoidable breaking API changes we have a chicken and egg problem since we would need to update widget and container at the same time.
To prepare for this, a special property `_aui_api_version` is passed in the URL of the widget.

To deploy a breaking change:

1. Develop a new release of this library with _aui_api_version=N+1 (see `src/widgets.js`)
2. In all widgets, loads the new release of this library only if `?_aui_api_version=N+1` and keep loading the old release otherwise.
3. Upgrade all containers to the new release.
4. Remove the old release from the widgets.
