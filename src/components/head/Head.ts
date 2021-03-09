import { components } from "knockout";

export const registerControl = (name: string): void => {
  if (components.isRegistered(name)) { throw Error(`Component ${name} already registered`); }

  components.register(name, {
    template: require('./Head.html')
  });
  require('./Head.css');
}