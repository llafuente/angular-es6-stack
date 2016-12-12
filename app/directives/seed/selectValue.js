export default function selectValueInjector(app) {
  /**
   * @ngdoc function
   * @name angular.selectValue
   * @module ng
   * @description
   *
   * The `angular.selectValue` is a global place for creating values for
   * selects-like
   * This remove boilerplate necessary for select and filters around your app.
   * It will create:
   * * angular.value with name an values passed
   * * angular.value with name + Filters with values passed plus a null option
   *   with filterLabel
   * * set rootScope[name] with the values passed
   * * set rootScope[name + 'Filters'] with values passed plus a null option
   *   with filterLabel
   * * create a filter with filterName to transform id into readble labels

   * @param {!string} name The name passed to `angular.value` and set on `$rootScope`
   * @param {!Array.<Object>=} list of object `{id: x, value: y}`
   * id null is forbidden
   * @param {Function=} configFn Optional configuration function for the module. Same as
   *        {@link angular.Module#config Module#config()}.
   * @returns {angular.Module} new module with the {@link angular.Module} api.
   */
  app.selectValue = function selectValue(name, values, filterName, filterLabel) {
    if (!Array.isArray(values)) {
      throw new Error('values must be an array');
    }

    for (let i = 0; i < values.length; ++i) {
      if (values[i].id == null) { // eslint-disable-line no-eq-null, eqeqeq
        throw new Error(`value with id null is forbidden on index ${i}`);
      }
      if (values[i].label == null) { // eslint-disable-line no-eq-null, eqeqeq
        throw new Error(`value with label null is forbidden on index ${i}`);
      }
    }
    if (!filterName) {
      throw new Error('filterName (3th parameter) is required');
    }
    if (!filterLabel) {
      throw new Error('filterLabel (4th parameter) is required');
    }

    const fvalues = [{id: null, label: filterLabel}].concat(values);

    this
      .value(name, values)
      .value(`${name}Filter`, fvalues)
      .run(['$rootScope', function($rootScope) {
        $rootScope[name] = values;
        $rootScope[`${name}Filter`] = fvalues;
      }])
      .filter(filterName, ['selectGetLabel', function(selectGetLabel) {
        return function(x) {
          // TODO empty string? Is that right? 5th param?
          if (x == null) { // eslint-disable-line no-eq-null, eqeqeq
            return '';
          }

          return selectGetLabel(values, x);
        };
      }]);

    return this;
  };

  app.factory('selectGetLabel', function() {
    return function sourceGetLabel(values, id) {
      if (Array.isArray(id)) {
        return id.map(function(v) {
          return sourceGetLabel(values, v);
        }).join(', ');
      }

      if (typeof id === 'object') {
        return sourceGetLabel(values, id.key || id.id);
      }

      for (let i = 0; i < values.length; ++i) {
        if (values[i].id === id) {
          return values[i].label;
        }
      }

      return '??';
    };
  });

  return app;
}
