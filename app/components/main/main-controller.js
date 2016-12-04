export default /*@ngInject*/ class MainController {
  constructor() {
    this.applicationName = 'app';
    this.controller = 'MainController';
  }

  error() {
    throw new Error("what line!");
  }
}
