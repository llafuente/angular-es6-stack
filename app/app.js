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
import uiRouterRedirect from 'directives/seed/uiRouterRedirect';
//import 'services/version-service';

import mainRoutes from 'components/main/main.routes.config';

// Seed
import BusyController from 'src/test/busy/busy.controller.js';
import testBusyRoutes from 'src/test/busy/busy.routes.config';
import RedirectController from 'src/test/redirect/redirect.controller.js';
import testRedirectRoutes from 'src/test/redirect/redirect.routes.config';

angular.module('app', [
  'ngResource',
  'ui.router',
  'services',
  'directives',
  'ngSanitize',
  stateBusy,
  httpBusy,
  uiRouterRedirect,

  /*, 'version'*/])

.config(mainRoutes)

// Seed
.config(testBusyRoutes)
.config(testRedirectRoutes)
.controller('BusyController', BusyController)
.controller('RedirectController', RedirectController)
;