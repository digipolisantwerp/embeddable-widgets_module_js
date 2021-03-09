import smoothscroll from 'smoothscroll-polyfill';
import reactComponent from './reactComponent';

if (typeof document !== 'undefined') {
  smoothscroll.polyfill();
}

export * from './widgets';
export { reactComponent };
