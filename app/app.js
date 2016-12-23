// NOTE this is the main SCSS file
// do not include anymore CSS or SCSS here, use @import there

import angular from 'angular';
import {modules, register} from './seed.js';

angular.module('app', modules);

register(angular.module('app'));
