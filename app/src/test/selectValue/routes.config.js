import HTML from './index.html';

export default /*@ngInject*/ function($stateProvider) {
  $stateProvider
  .state('selectValue', {
    url: '/selectValue',
    templateUrl: HTML,
    controller: 'SelectValueController',
    controllerAs: 'ctrl'
  });
}
