import angular from 'angular';
import 'angular-ui-router';


export default 'uiRouterAuthenticate';

/**
 * @ngdoc module
 * @name uiRouterAuthenticate
 * @module uiRouterAuthenticate
 * @description
 * # uiRouterAuthenticate
 * 
 * Redirect to a new state
 * The state that redirect must be final, don't work for intermediary states
 * just for the last one, we listen $stateChangeSuccess
 *
 * @example
   $stateProvider
   .state("xx", {
     url: "/xx",
     redirectTo: "xx.yy"
   });
 * @example
   $stateProvider
   .state("xx", {
     url: "/xx",
     redirectTo: function(Auth) { // can also use injector-array
       if(Auth.hasPermission('enter-secret-zone')) {
        return 'secret_zone';
       }
       return 'public_zone';
     }
   });
 */
angular
.module('uiRouterAuthenticate', ['Auth', 'ui.router'])
.run(function($transitions, Auth) {

$transitions.onBefore(criteria, function($transition$) {
  var name = $transition$.to().name;
  var path = toState.name.split('.');
  var authRequired = false;

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
      authenticate: function(Auth, $q) {
        var defer = $q.defer();

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
