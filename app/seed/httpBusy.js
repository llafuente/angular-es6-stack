import angular from 'angular';
import './qUtils.js';
import 'angular-ui-router';
import 'angular-busy/dist/angular-busy.js';

/**
 * @ngdoc module
 * @name httpBusy
 * @module httpBusy
 * @description
 * # httpBusy
 *
 * Create an interceptor and attached to $http, this interceptor count
 * the number of request in-progress and enable angular-busy based on that.
 *
 * To ignore this interceptor send `noBusy: true` in $http params
 * @example
   $http({
     method: 'GET',
     url: '/api/xxx',
     noBusy: true
   });
 */
/**
 * @ngdoc event
 * @event
 * @name $httpBusy
 * @memberOf module:httpBusy
 * @eventType broadcast on root scope
 * @description
 * # $httpBusy
 *
 * Broadcasted on the first request in-progess
 */
/**
 * @ngdoc event
 * @event
 * @name $httpIdle
 * @memberOf module:httpBusy
 * @eventType broadcast on root scope
 * @description
 * # $httpIdle
 *
 * Broadcasted when there is no request pending
 */

export default angular
.module('httpBusy', ['cgBusy', 'qUtils', 'ui.router'])
.factory('httpBusyInterceptor', function($q, $rootScope, $log, chainLoadingQ) {
  let requests = 0;
  let defer = null;

  return {
    request: function(config) {
      if (config.noBusy) {
        return config;
      }

      requests++;

      if (requests === 1) {
        defer = chainLoadingQ();
        $rootScope.$broadcast('$httpBusy');
      }

      //$log.log('(httpLoadingInterceptor) request', requests, config.url);

      return config;
    },
    response: function(response) {
      if (response.config && response.config.noBusy) {
        return response;
      }

      //$log.log('(httpLoadingInterceptor) response', requests, response.config ? response.config.url : '?');

      if ((--requests) === 0) {
        // Hide loader
        $rootScope.$broadcast('$httpIdle');
        defer.resolve();
      }

      return response;
    },
    responseError: function(response) {
      if (response.config && response.config.noBusy) {
        return $q.reject(response);
      }

      //$log.log('(httpLoadingInterceptor) responseError', requests, response.config ? response.config.url : '?');

      if ((--requests) === 0) {
        // Hide loader
        $rootScope.$broadcast('$httpIdle');
        defer.resolve();
      }

      return $q.reject(response);
    }
  };
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpBusyInterceptor');
});
