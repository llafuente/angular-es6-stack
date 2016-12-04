import busy1HTML from 'src/test/busy/busy1.html';
import busy2HTML from 'src/test/busy/busy2.html';


function add_delay ($q) {
  var defer = $q.defer();
  setTimeout(function() {
    defer.resolve();
  }, 1500);
  return defer.promise;
}

export default /*@ngInject*/ function($stateProvider) {
  $stateProvider
  .state('busy', {
    url: '/busy',
    template: '<div id="sub" ui-view></div>',
  })
  .state('busy.busy1', {
    url: '/1',
    templateUrl: busy1HTML,
    controller: 'BusyController',
    controllerAs: 'ctrl',
    resolve: {
      delay: add_delay
    }
  })
  .state('busy.busy2', {
    url: '/2',
    templateUrl: busy2HTML,
    controller: 'BusyController',
    controllerAs: 'ctrl',
    resolve: {
      delay: add_delay
    }
  });
}
