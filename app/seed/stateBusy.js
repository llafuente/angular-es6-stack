import angular from 'angular';
import './qUtils.js';
import 'angular-ui-router';
import 'angular-busy/dist/angular-busy.js';

/**
 * @ngdoc module
 * @name stateBusy
 * @module stateBusy
 * @description
 * # stateBusy
 *
 * hook ui-router supporting loading screens, no extra code is required
 * just include!
 */
export default angular
.module('stateBusy', ['cgBusy', 'qUtils', 'ui.router'])
// state change -> loading!
.run(function($rootScope, chainLoadingQ, $log) {
  let defer = null;

  $rootScope.$on('$stateChangeStart', function(event, toState/*, toParams, fromState, fromParams*/) {
    $log.debug('(Loading) $stateChangeStart', toState.name);
    if (!defer) {
      defer = chainLoadingQ();
    }
  });

  $rootScope.$on('$stateChangePrevented', function(event, toState/*, toParams, fromState, fromParams*/) {
    $log.debug('(Loading) $stateChangePrevented', toState.name);
    if (defer) {
      defer.resolve();
      defer = null;
    }
  });
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams/*, fromState, fromParams*/) {
    $log.debug('(Loading) $stateChangeSuccess', toState.name, toParams);
    if (defer) {
      defer.resolve();
      defer = null;
    }
  });

  $rootScope.$on('$stateChangeError', function(/*event, tostate, toparams*/) {
    $log.error('(Loading) $stateChangeError', arguments);
    if (defer) {
      defer.resolve();
      defer = null;
    }
  });

  $rootScope.$on('$stateNotFound', function(/*event, unfoundState, fromState, fromParams*/) {
    $log.error('(Loading) $stateNotFound', arguments);
    if (defer) {
      defer.resolve();
      defer = null;
    }
  });
});
