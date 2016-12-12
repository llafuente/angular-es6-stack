import indexHTML from './index.html';

export default /*@ngInject*/ function($stateProvider) {
  $stateProvider
  .state('errorHanling', {
    url: '/errorHanling',
    templateUrl: indexHTML,
    controller: 'ErrorHandlingController',
    controllerAs: 'ctrl'
  });
}
