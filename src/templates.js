/* @jsx jsxDom */

// what to show while loading (injected into iframe)
function defaultPrerenderTemplate(options) {
  // eslint-disable-next-line no-unused-vars
  const { jsxDom } = options;
  // duplicating core branding styles from https://cdn.antwerpen.be/core_branding_scss/3.0.3/main.css
  // for performance reasons
  return (
      <html>
          <head>
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>
              <style>
                  {`
                      html, body {
                          width: 100%;
                          height: 100%;
                          overflow: hidden;
                          top: 0;
                          left: 0;
                          margin: 0;
                          text-align: center;
                      }

                      .spinner {
                        position: absolute;
                        max-height: 60vmin;
                        max-width: 60vmin;
                        height: 28px;
                        width: 28px;
                        top: 50%;
                        left: 50%;
                        transform: translateX(-50%) translateY(-50%);
                        z-index: 10;
                      }
                      
                      .a-spinner {
                        color: #b0b0b0;
                      }
                      
                      .a-spinner:before {
                        -moz-osx-font-smoothing: grayscale;
                        -webkit-font-smoothing: antialiased;
                        font-size: inherit;
                        font-family: FontAwesome;
                        text-rendering: auto;
                        animation: fa-spin 1200ms infinite linear;
                        color: inherit;
                        content: '\\f1ce';
                        display: inline-block;
                        font-size: 1.75rem;
                      }
                  `}
              </style>
          </head>
          <body>
              <div class="spinner a-spinner"></div>
          </body>
      </html>
  );
}

module.exports = {
  defaultPrerenderTemplate,
};
