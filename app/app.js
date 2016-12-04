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
//import 'services/version-service';

import mainRoutes from 'components/main/main.routes.config';

angular.module('app', ['ngResource', 'ui.router', 'services', 'directives', 'ngSanitize'/*, 'version'*/])

.config(mainRoutes);
