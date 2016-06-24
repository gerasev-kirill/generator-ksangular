angular.module 'IndexApp', ['gettext', 'ui.bootstrap','ui.gettext.langPicker', 'ui.router', 'ngAnimate']

.run (gettextCatalog, $langPickerConf)->
    $langPickerConf.setLanguageList( {
        ru: 'Русский',
        en: 'English'
    } )
    $langPickerConf.setLanguageRemoteUrl("/client/languages/")


.controller 'BodyCtrl',
    ($scope, $langPickerConf) ->
         $scope.count = 1
         $scope.$langPickerConf = $langPickerConf
         $scope.LANG = ''
         $scope.$watch '$langPickerConf.currentLang',
            (lang)->
                $scope.LANG = lang



.directive 'hello',
    () ->
        restrict: 'E'
        controller: ($scope) ->
        templateUrl: "/@@__SOURCE_PATH__/hello.html"

.directive 'hello2',
    () ->
        restrict: 'E'
        controller: ($scope) ->
        templateUrl:"/@@__SOURCE_PATH__/hello2.html"



.config ($locationProvider, $stateProvider, $urlRouterProvider)->
    $locationProvider.html5Mode(true)
    #$locationProvider.hashPrefix('!')

    $urlRouterProvider.otherwise("/en/hello2");
    $stateProvider.state('app', {
        abstract: true,
        url: '/{lang:(?:ru|en)}',
        template: '<ui-view/>'
    })
    .state('app.home', {
        url: '/hello',
        template: '<hello></hello>'
        })

    .state('app.home2', {
        url: '/hello2',
        template: '<hello2></hello2>'
        })




angular.element(document).ready \
    ()-> angular.bootstrap(document, ['IndexApp'])
