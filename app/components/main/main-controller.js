export default /*@ngInject*/ function() {
  this.applicationName = 'app';

  this.error = function() {
  	throw new Error("what line!");
  }
}
