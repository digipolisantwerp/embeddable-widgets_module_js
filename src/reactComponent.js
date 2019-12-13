import { load } from './widgets';

const reactComponent = (widgetUrl, deps, overrides) => class extends deps.React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null,
    };
  }

  componentDidMount() {
    load(widgetUrl, overrides)
      .then((widget) => {
        // copy dimensions so it will be picked up by zoid's render
        if (this.props.dimensions) {
          Object.assign(widget.dimensions, this.props.dimensions);
        }
        // convert widget into react component
        const component = widget.component.driver('react', deps);
        // monkey-patch zoid's react component to make it respect className
        component.prototype.render = () => deps.React.createElement('div', {
          className: this.props.className,
        });
        this.setState({ component });
      })
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
  }

  render() {
    const C = this.state.component;
    return C ? deps.React.createElement(C, this.props) : null;
  }
};

export default reactComponent;
