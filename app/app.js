// NOTE this is the main SCSS file
// do not include anymore CSS or SCSS here, use @import there
import './app.scss';

import 'jquery';
import angular from 'angular';
import 'angular-resource';
import 'angular-ui-router';
import 'angular-sanitize';
//import _ from 'lodash';

import 'services/services';
import 'directives/directives';
import stateBusy from 'directives/seed/stateBusy';
import httpBusy from 'directives/seed/httpBusy';
import selectValue from 'directives/seed/selectValue';
import uiRouterRedirect from 'directives/seed/uiRouterRedirect';
import JWTAuth from 'directives/seed/JWTAuth';
//import 'services/version-service';

import mainRoutes from 'components/main/main.routes.config';

// Seed
import BusyController from 'src/test/busy/busy.controller.js';
import BusyRoutes from 'src/test/busy/busy.routes.config';
import RedirectController from 'src/test/redirect/redirect.controller.js';
import RedirectRoutes from 'src/test/redirect/redirect.routes.config';
import SelectValueController from 'src/test/selectValue/selectValue.controller.js';
import SelectValueRoutes from 'src/test/selectValue/routes.config';

angular.module('app', [
  'ngResource',
  'ui.router',
  'services',
  'directives',
  'ngSanitize',
  stateBusy,
  httpBusy,
  uiRouterRedirect,
  JWTAuth,

  /*, 'version'*/]);

selectValue(angular.module('app'));

angular.module('app')
.config(mainRoutes)

// Seed
.config(BusyRoutes)
.config(RedirectRoutes)
.config(SelectValueRoutes)
.controller(BusyController.name, BusyController)
.controller(RedirectController.name, RedirectController)
.controller(SelectValueController.name, SelectValueController)
.selectValue('seedTestValue', [
  {id: 0, label: 'option 0'},
  {id: 1, label: 'option 1'},
  {id: 2, label: 'option 2'},
], 'getSeedTestValue', 'Cualquiera')
;