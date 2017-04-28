angular
    .module('ISSOWDash')    
    .directive('errSrc', ['$http', errSrc]);

function errSrc($http) {
    var directive = {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };

    return directive;
}
