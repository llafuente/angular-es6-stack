import angular from 'angular';
import 'angular-ui-router';

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
export default angular
.module('uiRouterRedirect', ['JWTAuth', 'ui.router'])
.run(function($rootScope, $state, $injector, $log, $timeout) {
  $rootScope.$on('$stateChangeSuccess', function(evt, to, params) {
    $log.debug('(state.redirectTo?)', to.redirectTo);

    if (typeof to.redirectTo === 'string') {
        // redirectionState cannot be done without a bit $timeout or
        // we'll mess with ui-router state
      $timeout(function() {
        $state.go(to.redirectTo, params);
      });
    }

    if (typeof to.redirectTo === 'function' || Array.isArray(to.redirectTo)) {
      const state = $injector.invoke(to.redirectTo);
      if (state) {
        $timeout(function() {
          $state.go(state, params);
        });
      }
    }
  });
})
.provider('redirectionState', function() {
  // url that return user data
  this.state = {
    name: null,
    params: {}
  };
  this.error = {
  };

  this.$get = function() {
    return this;
  };
})
/**
 * @ngdoc factory
 * @class redirectTo
 * @memberOf module:uiRouterRedirect
 *
 * @description
 * # redirectTo
 *
 * redirect to login, saving current state/params
 * @example
 * redirectTo('new.state', {withParams: 1}, 'target.state')
 * @example
 * redirectTo('new.state', {withParams: 1}) // redirect to login
 * @example
 * redirectTo() // redirect to login keep current state
 */
.factory('redirectTo', function($state, redirectionState, $log) {
  return function(name, params, targetState) {
    const n = name || redirectionState.state.name;
    const p = params || redirectionState.state.params;
    const t = targetState || 'login';

    $log.debug('(redirectTo) ', n, p, t);

    $state.go(t, {
      redirectTo: n,
      redirectToParams: JSON.stringify(p || {}),
    });
  };
})
/**
 * @ngdoc factory
 * @class redirectBack
 * @memberOf module:uiRouterRedirect
 *
 * @description
 * # redirectBack
 *
 * Redirect back to previous saved state.
 * Saved state is in $stateParams.redirectTo & $stateParams.redirectToParams
 * @example
 *   redirectBack('home');
 *   // this will redirect to $stateParams.redirectTo if exists
 *   // or to 'home'
 * @example
 *   redirectBack(function() {...});
 *   // Also valid, will call that function with $injector support
 */
.factory('redirectBack', function($state, $stateParams, $injector, $log) {
  return function(name, params) {
    if ($stateParams.redirectTo) {
      let p;
      try {
        p = JSON.parse($stateParams.redirectToParams);
      } catch (e) { $log.error(e); p = null; }
      $log.debug('(redirectBack)', $stateParams.redirectTo, p);
      return $state.go($stateParams.redirectTo, p);
    }
    if (typeof name === 'string') {
      $log.debug('(redirectBack)', name, params);
      return $state.go(name, params);
    }
    // name is a function or array(fn) -> use injector to call it
    $log.debug('(redirectBack) $injector.invoke');
    return $injector.invoke(name);
  };
})
.run(function($rootScope, $state, $log, Auth, redirectionState, redirectTo) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams/*, fromState, fromParams*/) {
    if (toState.name !== 'login' && toState.name !== 'error') {
      redirectionState.state.name = toState.name;
      redirectionState.state.params = toParams;
    }
  });

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    $log.error('(event:$stateChangeError)', arguments);

    // go to error state to stop inifite loop
    // if has session is a error that won't redirect to login, so goto error
    if (Auth.isLoggedIn()) {
      // default error state is 'error'
      // overriden by redirectionState.error by status code (global)
      // overriden by redirectOnError (local)

      let targetState = 'error';
      if (error && error.status) {
        targetState = redirectionState.error[error.status] || 'error';
      }

      if (!$state.get(targetState)) {
        $log.error('(event:$stateChangeError) error state[', targetState, '] not defined');
        targetState = 'error';
      }

      if (error && error.redirectOnError) {
        targetState = error.redirectOnError;
      }
      $log.debug('(event:$stateChangeError) redirect to', targetState, toParams);

      $state.go(targetState, toParams);
    } else {
      redirectTo(toState.name, toParams);
    }
  });

  $rootScope.$on('$stateNotFound', function(/*event, unfoundState, fromState, fromParams*/) {
    $log.error('(event:$stateNotFound)', arguments);
    $state.go('error');
  });
});
