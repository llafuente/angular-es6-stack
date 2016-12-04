import angular from 'angular';
import './qUtils.js';
import 'angular-ui-router';
import 'angular-busy/dist/angular-busy.js';

// export the name to be imported
export default 'httpBusy';

/**
 * @ngdoc module
 * @name httpBusy
 * @description
 * hook ui-router supporting loading screens, no extra code is required
 * just include!
 */
angular.module('httpBusy', ['cgBusy', 'qUtils', 'ui.router'])
.factory('httpBusyInterceptor', function($q, $rootScope, $log, chainLoadingQ) {
  var requests = 0;
  var defer = null;

  return {
    request: function(config) {
      if (config.noLoading) {
        return config;
      }

      requests++;

      if (requests === 1) {
        defer = chainLoadingQ();
      }

      //$log.log('(httpLoadingInterceptor) request', requests, config.url);

      // Show loader
      $rootScope.$broadcast('$loading');
      return config;
    },
    response: function(response) {
      if (response.config && response.config.noLoading) {
        return response;
      }

      //$log.log('(httpLoadingInterceptor) response', requests, response.config ? response.config.url : '?');

      if ((--requests) === 0) {
        // Hide loader
        $rootScope.$broadcast('$loaded');
        defer.resolve();
      }

      return response;
    },
    responseError: function(response) {
      if (response.config && response.config.noLoading) {
        return $q.reject(response);
      }

      //$log.log('(httpLoadingInterceptor) responseError', requests, response.config ? response.config.url : '?');

      if ((--requests) === 0) {
        // Hide loader
        $rootScope.$broadcast('$loaded');
        defer.resolve();
      }

      return $q.reject(response);
    }
  };
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpBusyInterceptor');
});
