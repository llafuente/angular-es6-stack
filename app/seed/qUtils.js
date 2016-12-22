import angular from 'angular';

angular.module('qUtils', [])
.factory('chainLoading', function($rootScope) {
  return function chainLoading(promise) {
    if (!$rootScope.loading || $rootScope.loading.$$state.status === 1) {
      $rootScope.loading = promise;
    } else {
      $rootScope.loading = $rootScope.loading.then(function() { return promise; });
    }

    return $rootScope.loading;
  };
})
.factory('chainLoadingQ', function($rootScope, $q) {
  return function chainLoadingQ() {
    const defer = $q.defer();
    if (!$rootScope.loading || $rootScope.loading.$$state.status === 1) {
      $rootScope.loading = defer.promise;
    } else {
      $rootScope.loading = $rootScope.loading.then(function() { return defer.promise; });
    }
    return defer;
  };
});
