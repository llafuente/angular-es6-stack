import mainHTML from 'components/main/main.html';
import 'components/main/main.scss';
import mainCtrl from 'components/main/main-controller';

export default /*@ngInject*/ function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('main', {
    url: '/',
    views: {
      '@': {
        templateUrl: mainHTML,
        controller: mainCtrl,
        controllerAs: 'mainCtrl'
      }
    }
  });
}
