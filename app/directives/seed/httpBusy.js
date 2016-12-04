import angular from 'angular';
import './qUtils.js';
import 'angular-ui-router';
import 'angular-busy/dist/angular-busy.js';

// export the name to be imported
export default 'httpBusy';

/**
 * @ngdoc module
 * @name httpBusy
 * @module httpBusy
 * @description
 * # httpBusy
 * 
 * Create an interceptor and attached to $http, this interceptor count
 * the number of request in-progress and enable angular-busy based on that.
 * broadcast an event when busy start
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
 * @name httpBusy#$httpBusy
 * @eventType broadcast on root scope
 * @description
 * Broadcasted on the first request in-progess
 */
/**
 * @ngdoc event
 * @name httpBusy#$httpIdle
 * @eventType broadcast on root scope
 * @description
 * Broadcasted when there is no request pending
 */

angular.module('httpBusy', ['cgBusy', 'qUtils', 'ui.router'])
.factory('httpBusyInterceptor', function($q, $rootScope, $log, chainLoadingQ) {
  var requests = 0;
  var defer = null;

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
