(function() {
  angular.module('IndexApp', ['gettext', 'ui.bootstrap', 'ui.gettext.langPicker', 'ui.router', 'ngAnimate']).run(function(gettextCatalog, $langPickerConf) {
    $langPickerConf.setLanguageList({
      ru: 'Русский',
      en: 'English'
    });
    return $langPickerConf.setLanguageRemoteUrl("/client/languages/");
  }).controller('Ctrl', function($scope, $langPickerConf) {
    $scope.count = 1;
    $scope.$langPickerConf = $langPickerConf;
    $scope.LANG = '';
    return $scope.$watch('$langPickerConf.currentLang', function(lang) {
      return $scope.LANG = lang;
    });
  }).directive('hello', function() {
    return {
      restrict: 'E',
      controller: function($scope) {},
      templateUrl: "/client/index_app/hello.html"
    };
  }).directive('hello2', function() {
    return {
      restrict: 'E',
      controller: function($scope) {},
      templateUrl: "/client/index_app/hello2.html"
    };
  }).config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/en/hello2");
    return $stateProvider.state('app', {
      abstract: true,
      url: '/{lang:(?:ru|en)}',
      template: '<ui-view/>'
    }).state('app.home', {
      url: '/hello',
      template: '<hello></hello>'
    }).state('app.home2', {
      url: '/hello2',
      template: '<hello2></hello2>'
    });
  });

  angular.element(document).ready(function() {
    return angular.bootstrap(document, ['IndexApp']);
  });

}).call(this);
