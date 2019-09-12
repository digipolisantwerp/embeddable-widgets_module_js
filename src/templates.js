/* @jsx node */
// eslint-disable-next-line no-unused-vars
import { node, dom } from 'jsx-pragmatic';

// what to show while loading (injected into iframe)
const defaultPrerenderTemplate = ({ doc }) => (<html>
  <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <style>
          {`
              html, body {
                align-items: center;
                display: flex;
                justify-content: center;
                height: 100vh;
                padding: 0; 
                margin: 0;
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
                -webkit-animation: fa-spin 1200ms infinite linear;
                color: inherit;
                content: '\\f1ce';
                display: inline-block;
                font-size: 1.75rem;
              }
          `}
      </style>
  </head>
  <body>
      <div class="a-spinner"></div>
  </body>
</html>).render(dom({ doc }));

export default defaultPrerenderTemplate;
