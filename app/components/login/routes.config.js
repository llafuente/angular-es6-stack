import loginHTML from './login.tpl.html';
import loginController from './login.controller.js';

export default /*@ngInject*/ function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: loginHTML,
    controller: loginController,
    controllerAs: 'loginCtrl'
  });
}
