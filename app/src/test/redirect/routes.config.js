import redirectHTML from 'src/test/redirect/redirect.html';
import errorHTML from 'src/test/redirect/error.html';

export default /*@ngInject*/ function($stateProvider) {
  $stateProvider
  .state('error', {
    url: '/error',
    templateUrl: errorHTML,
    //controller: 'RedirectController',
    //controllerAs: 'ctrl'
  })
  .state('redirect', {
    url: '/redirect',
    template: '<ui-view></ui-view>'
  })
  .state('redirect.redirect1', {
    url: '/1',
    redirectTo: 'redirect.redirect2',
    templateUrl: redirectHTML,
    controller: 'RedirectController',
    controllerAs: 'ctrl'
  })
  .state('redirect.redirect2', {
    url: '/2?saveThisVar',
    templateUrl: redirectHTML,
    controller: 'RedirectController',
    controllerAs: 'ctrl'
  })
  .state('redirect.redirect3', {
    url: '/3?redirectTo&redirectToParams',
    templateUrl: redirectHTML,
    controller: 'RedirectController',
    controllerAs: 'ctrl'
  });
}
