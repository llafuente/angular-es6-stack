export default /*@ngInject*/ function ngClickIf($log) {
  return {
    restrict: 'A',
    link: function($scope, $elem, $attrs) {
      $log.debug('(ngClickIf) attach to', $elem);
      $elem.on('click', function($event) {
        const cond = $scope.$eval($attrs.ngClickIf);
        $log.debug('(ngClickIf) clicked: ', $attrs.ngClickIf, 'is', cond);
        if (!cond) {
          $log.debug('(ngClickIf) prevent!');
          $event.preventDefault();
          $event.stopPropagation();
        }
      });
    }
  };
}
