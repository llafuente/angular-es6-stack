export default /*@ngInject*/ class MainController {
  constructor() {
  	this.applicationName = 'app';
  	
  }

  error() {
  	throw new Error("what line!");
  }
}
