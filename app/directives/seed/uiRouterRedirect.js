import angular from 'angular';
import 'angular-ui-router';


export default 'uiRouterRedirect';

//
// 
// example:

// 
//
/**
 * @ngdoc module
 * @name uiRouterRedirect
 * @module uiRouterRedirect
 * @description
 * # uiRouterRedirect
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
.module('uiRouterRedirect', [])
.run(function($rootScope, $state, $injector, $log, $timeout) {
  $rootScope.$on('$stateChangeSuccess', function(evt, to, params) {
    $log.debug('(redirectTo?)', to.redirectTo);

    if ('string' === typeof to.redirectTo) {
        // redirection cannot be done without a bit $timeout or
        // we'll mess with ui-router state
      $timeout(function() {
        $state.go(to.redirectTo, params);
      });
    }

    if ('function' === typeof to.redirectTo || Array.isArray(to.redirectTo)) {
      var state = $injector.invoke(to.redirectTo);
      if (state) {
        $timeout(function() {
          $state.go(state, params);
        });
      }
    }
  });
});
