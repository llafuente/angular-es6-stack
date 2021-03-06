// NOTE this is the main SCSS file
// do not include anymore CSS or SCSS here, use @import there
import './app.scss';

import 'jquery';
import 'angular';
import 'angular-smart-table';
import 'angular-resource';
import 'angular-ui-router';
import 'angular-sanitize';
import 'checklist-model';
import 'lodash';
import 'ng-file-upload';
// textAngular is a bit broken
// taTools is expected to be global!
// use this workaround
window.taTools = window.taTools || {};
import rangy from 'rangy';
window.rangy = rangy;
import selectionsaverestore from 'rangy/lib/rangy-selectionsaverestore.js';
window.rangy.saveSelection = selectionsaverestore;
import 'textangular/dist/textAngular-sanitize.js';
import 'textangular/dist/textAngularSetup.js';
import 'textangular/dist/textAngular.js';


import 'services/services';
import 'directives/directives';
import stateBusy from 'seed/stateBusy';
import httpBusy from 'seed/httpBusy';
import selectValue from 'seed/selectValue';
import uiRouterRedirect from 'seed/uiRouterRedirect';
import JWTAuth from 'seed/JWTAuth';
import httpErrorHandling from 'seed/httpErrorHandling';
import uiRouterAuthenticate from 'seed/uiRouterAuthenticate';
//import 'services/version-service';

import mainRoutes from 'components/main/main.routes.config';
import loginRoutes from 'components/login/routes.config';

// Seed
import BusyController from 'src/test/busy/busy.controller.js';
import BusyRoutes from 'src/test/busy/routes.config.js';
import RedirectController from 'src/test/redirect/redirect.controller.js';
import RedirectRoutes from 'src/test/redirect/routes.config.js';
import SelectValueController from 'src/test/selectValue/selectValue.controller.js';
import ErrorHandlingController from 'src/test/errorhandling/errorhandling.controller.js';
import SelectValueRoutes from 'src/test/selectValue/routes.config.js';
import ErrorHanlingRoutes from 'src/test/errorhandling/routes.config.js';

export const modules = [
  'ngResource',
  'ui.router',
  'services',
  'directives',
  'ngSanitize',
  'smart-table',
  'checklist-model',
  'textAngular',
  'ngFileUpload',
  stateBusy.name,
  httpBusy.name,
  uiRouterRedirect.name,
  JWTAuth.name,
  httpErrorHandling.name,
  uiRouterAuthenticate.name,
];

function register(app) {
  selectValue(app);

  app
  .filter('translate', function() {
    return function(t) { return t; };
  })
  .run(['$templateCache', function ($templateCache) {
    // override smart table template, because we are using bootstrap v4
    $templateCache.put('template/smart-table/pagination.html',
        '<nav ng-if="numPages && pages.length >= 2"><ul class="pagination">' +
        '<li ng-repeat="page in pages" class="page-item" ng-class="{active: page==currentPage}">' +
        '<a href="javascript: void(0);" ng-click="selectPage(page)" class="page-link">{{page}}</a>' +
        '</li>' +
        '</ul></nav>');
  }])
  .config(mainRoutes)
  .config(loginRoutes)

  // Seed test project for e2e & teaching
  .config(BusyRoutes)
  .config(RedirectRoutes)
  .config(SelectValueRoutes)
  .config(ErrorHanlingRoutes)
  .controller(BusyController.name, BusyController)
  .controller(RedirectController.name, RedirectController)
  .controller(SelectValueController.name, SelectValueController)
  .controller(ErrorHandlingController.name, ErrorHandlingController)
  .selectValue('seedTestValue', [
    {id: 0, label: 'option 0'},
    {id: 1, label: 'option 1'},
    {id: 2, label: 'option 2'},
  ], 'getSeedTestValue', 'Cualquiera')
  ;
}

export {register};
