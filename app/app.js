// NOTE this is the main SCSS file
// do not include anymore CSS or SCSS here, use @import there
import './app.scss';

import 'jquery';
import angular from 'angular';
import 'angular-smart-table';
import 'angular-resource';
import 'angular-ui-router';
import 'angular-sanitize';
import 'checklist-model';
import 'lodash';
// textAngular is a bit broken
// taTools is expected to be global!
// use this workaround
window.taTools = window.taTools || {};
import 'rangy/lib/rangy-selectionsaverestore';
import 'textangular/dist/textAngular-sanitize.js';
import 'textangular/dist/textAngularSetup.js';
import 'textangular/dist/textAngular.js';


import 'services/services';
import 'directives/directives';
import stateBusy from 'directives/seed/stateBusy';
import httpBusy from 'directives/seed/httpBusy';
import selectValue from 'directives/seed/selectValue';
import uiRouterRedirect from 'directives/seed/uiRouterRedirect';
import JWTAuth from 'directives/seed/JWTAuth';
import httpErrorHandling from 'directives/seed/httpErrorHandling';
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

angular.module('app', [
  'ngResource',
  'ui.router',
  'services',
  'directives',
  'ngSanitize',
  'smart-table',
  'checklist-model',
  'textAngular',
  stateBusy,
  httpBusy,
  uiRouterRedirect,
  JWTAuth,
  httpErrorHandling,
  /*, 'version'*/
]);

selectValue(angular.module('app'));

angular.module('app')
.config(mainRoutes)
.config(loginRoutes)

// Seed
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
