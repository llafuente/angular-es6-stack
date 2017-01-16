import angular from 'angular';
import 'angular-ui-router';

// NOT TESTED JUST WRITTED
// TODO need to ve tested!
/**
 * @ngdoc module
 * @name uiRouterAuthenticate
 * @module uiRouterAuthenticate
 * @description
 * # uiRouterAuthenticate
 *
 * Mark the state and need authentication.
 *
 * @example
   $stateProvider
   .state("xx", {
     url: "/xx",
     authenticate: true
   });
 */
export default angular
.module('uiRouterAuthenticate', ['Auth', 'ui.router'])
.run(/*@ngInject*/ function($transitions) {
  $transitions.onBefore(criteria, function($transition$) {
    const name = $transition$.to().name;
    const path = toState.name.split('.');
    let authRequired = false;

    for (; i < path.length; ++i) {
      state = path.slice(0, i + 1).join('.');
      s = $state.get(state);

      if (s.authenticate) {
        authRequired = true;
      }
    }

    if (authRequired) {
      $log.debug('(uiRouterAuthenticate) auth required for ', name);

      $transition$.addResolves({
        authenticate: /*@ngInject*/ function(Auth, $q) {
          const defer = $q.defer();

          Auth.isLoggedInAsync(function(loggedIn) {
            $log.debug('(AuthenticateRouteResolve) user is logged in?', !!loggedIn);
            if (!loggedIn) {
              defer.reject();
              $timeout(function() {
                redirectToLogin();
              });
            } else {
              defer.resolve();
            }
          });

          return defer.promise;
        }
      });
    }
  });
});
