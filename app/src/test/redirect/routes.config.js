import redirectHTML from 'src/test/redirect/redirect.html';

export default /*@ngInject*/ function($stateProvider) {
  $stateProvider
  .state('redirect', {
    url: '/redirect',
    templateUrl: redirectHTML,
    controller: 'RedirectController',
    controllerAs: 'ctrl'
  })
  .state('redirect.redirect1', {
    url: '/1',
    redirectTo: 'redirect.redirect2'
  })
  .state('redirect.redirect2', {
    url: '/2',
  });
}
