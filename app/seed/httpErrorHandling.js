export default 'httpErrorHandling';

import angular from 'angular';
import defaultErrorHTML from './templates/default.error.tpl.html';
import htmlErrorHTML from './templates/html.error.tpl.html';
import 'angular-modal-service';

// $rootScope.modal_error, contains if there is a model active
angular
.module('httpErrorHandling', [
  'angularModalService'
])
.provider('errorConfig', function() {
  // url that return user data
  this.defaultTemplate = defaultErrorHTML;
  this.templates = {
    html: htmlErrorHTML
  };

  this.$get = function() {
    return this;
  };
})
// This http interceptor listens for authentication failures
.factory('errorHandler', function($injector, $log, errorConfig, $q) {
  const errorList = [];
  let instance;

  function popError(reject) {
    $log.debug('(errorHandler) popError - errorList', errorList);
    const err = errorList[0];
    errorList.splice(0, 1);

    //deferred
    for (let i = 0; i < err.deferred.length; ++i) {
      if (err.deferred[i] && reject) {
        err.deferred[i].reject(err.response[i]);
      }
    }
  }

  function unique(value, index, self) {
    return self.indexOf(value) === index;
  }

  // check if the error can be squashed
  function squashErrors() {
    if (errorList[0].type) {
      return;
    }

    // squask all un-type related errors
    let i;
    const err = errorList[0];
    for (i = 1; i < errorList.length; ++i) {
      if (!errorList[i].error.type) {
        err.error.list = err.error.list
          .concat(errorList[i].error.list)
          .filter(unique);
        err.response.push(errorList[i].response[0]);
        err.deferred.push(errorList[i].deferred[0]);
        errorList.splice(i, 1);
        --i;
      }
    }
  }

  function showModal() {
    if (!errorList.length) {
      return null;
    }

    if (instance) {
      squashErrors();

      return instance.result.then(function() {
        showModal();
      });
    }

    const ModalService = $injector.get('ModalService');
    const $http = $injector.get('$http');
    // TODO review why I did this ?
    // let $rootScope = $injector.get('$rootScope');


    const errData = errorList[0];
    const err = errData.error;
    let templateUrl = errorConfig.defaultTemplate;
    if (err.type) {
      templateUrl = errorConfig.templates[err.type];
    }


    instance = ModalService.showModal({
      size: err.type ? 'lg' : undefined, // TODO
      templateUrl: templateUrl,
      //scope: $rootScope,
      backdrop: 'static', // TODO
      keyboard: false, // TODO
      controller: ['$scope', 'close', function($scope, close) {
        $scope.templateUrl = templateUrl;
        $scope.error = err;

        // retry the request adding param to query and merge body
        $scope.retry = function(param, body) {
          // why not clone?
          // we may need to add more than one param because there are
          // two confirmations
          //let config = angular.copy(err.response[0].config);
          const config = err.response[0].config;

          $log.debug('(errorHandler) retry', config, param);
          // TODO this could append multiple times...
          if (config.url.indexOf('?') !== -1) {
            config.url += '&' + param + '=true';
          } else {
            config.url += '?' + param + '=true';
          }

          if (body) {
            config.data = config.data || {};
            angular.extend(config.data, body);
          }

          popError(false);
          instance = null;
          close(null);

          $http(config)
          .then(function(response) {
            $log.debug('(errorHandler) success', response);
            err.deferred[0].resolve(response);
          }, function(response) {
            $log.debug('(errorHandler) error', response);
            err.deferred[0].reject(response);
          });
        };

        $scope.close = function() {
          $log.debug('(errorHandler) close');
          popError(true);

          instance = null;
          close(null);
        };

        $scope.ok = function() {
          $log.debug('(errorHandler) ok');
          popError(true);

          instance = null;
          close(null);
        };
      }]
    }).then(function(modal) {
      angular.element(modal.element).css('display', 'block');
      setTimeout(function() {
        angular.element(modal.element).addClass('in');
      });
    });

    return null;
  }

  return {
    push: function(error, response) {
      const serr = {
        error: error,
        deferred: [null],
        response: [response],
        modal: null
      };

      // defer if has a type
      // because can be retried
      if (error.type) {
        serr.deferred[0] = $q.defer();
      }

      errorList.push(serr);

      showModal();

      return serr.deferred[0] ? serr.deferred[0].promise : $q.reject(response);
    }
  };
})
.factory('errorFormat', function() {
  const textHtmlRE = new RegExp('text\/html', 'i');
  return function(response) {
    // html-error ?
    if (
      typeof response.data === 'string' &&
      textHtmlRE.test(response.headers('Content-Type'))
    ) {
      return {
        html: response.data,
        type: 'html'
      };
    }

    let error = {
      list: [],
      type: null,
      title: null
    };

    if (typeof response.data.title === 'string') {
      error.title = response.data.title;
    }

    if (typeof response.data === 'string') {
      error.list = [response.data];
    } else if (Array.isArray(response.data)) {
      error.list = response.data.slice(0);
    } else {
      if (Array.isArray(response.data.error)) {
        error.list = response.data.error.slice(0);
      } else if (response.data.error) {
        error.list = [response.data.error];
      }
      if (response.data.type) {
        error = response.data;
      }
    }

    return error;
  };
})
.factory('errorInterceptor', ['$q', '$injector', '$interpolate', '$log', 'errorHandler', 'errorFormat', function($q, $injector, $interpolate, $log, errorHandler, errorFormat) {
  return {
    responseError: function(response) {
      $log.debug('(errorInterceptor) responseError::', response);

      // manage 4XX & 5XX
      if (response.status >= 400 && (response.config && !response.config.noModalError)) {
        const errors = errorFormat(response);

        // TODO handle retry
        // TODO modal should be promisable?
        return errorHandler.push(errors, response);
      }

      return $q.reject(response);
    }
  };
}])
// $http({recoverErrorStatus: 200})
// usage: do not fail to resolve a state, just ignore possible errors
// maybe need: noModalError, to not display the error.
.factory('recoverErrorStatusInterceptor', ['$q', '$injector', '$interpolate', '$log', 'errorHandler', 'errorFormat', function($q, $injector, $interpolate, $log) {
  return {
    responseError: function(response) {
      if (response.config && response.config.recoverErrorStatus) {
        $log.debug('(recoverErrorStatusInterceptor) recover', response);
        response.recoverFromStatus = response.status;
        response.status = response.config.recoverErrorStatus;
        return response;
      }

      return $q.reject(response);
    }
  };
}])
.config(function($httpProvider) {
  $httpProvider.interceptors.push('recoverErrorStatusInterceptor');
  $httpProvider.interceptors.push('errorInterceptor');
});
