import 'jquery';
import angular from 'angular';
import 'angular-resource';
import 'angular-ui-router';
import 'angular-sanitize';
//import _ from 'lodash';

import 'services/services';
import 'directives/directives';
//import 'services/version-service';

import mainRoutes from './components/main/main.routes';

angular.module('app', ['ngResource', 'ui.router', 'services', 'directives', 'ngSanitize'/*, 'version'*/])

.config(mainRoutes);
