/* @jsx node */
// eslint-disable-next-line no-unused-vars
import { node, dom } from 'jsx-pragmatic';

// what to show while loading (injected into iframe)
const defaultPrerenderTemplate = ({ doc }) => (<html>
  <head>
      <style>{`body,html{align-items:center;display:flex;justify-content:center;height:100vh;padding:0;margin:0}.a-spinner{align-items:center;display:inline-flex;justify-content:center}.a-spinner__circle{animation:1.6s linear infinite spin;border-radius:100%;border:.1875rem solid #949494;border-top-color:transparent;height:2rem;position:relative;transform:rotate(-25deg);width:2rem}.a-spinner__circle:before{border-radius:100%;border:.1875rem solid #949494;border-top-color:transparent;content:"";height:2rem;left:-.1875rem;position:absolute;top:-.1875rem;transform:rotate(50deg);width:2rem}.u-screen-reader-only{clip:rect(1px,1px,1px,1px);height:1px;overflow:hidden;position:absolute!important;width:1px}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}
      </style>
  </head>
  <body>
    <div class="a-spinner" role="alert"><span class="a-spinner__circle"><span class="u-screen-reader-only">Aan het laden …</span></span>
  </div>
  </body>
</html>).render(dom({ doc }));

export default defaultPrerenderTemplate;
