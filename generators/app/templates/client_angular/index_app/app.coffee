angular.module 'IndexApp'


.run (gettextCatalog, $langPickerConf)->
    $langPickerConf.setLanguageList( {
        ru: 'Русский',
        en: 'English'
    } )
    $langPickerConf.setLanguageRemoteUrl("/client/languages/")
    $langPickerConf.detectLanguage()




.controller 'BodyCtrl', ($scope) ->
    return




.config ($locationProvider, $stateProvider, $urlRouterProvider, cfpLoadingBarProvider)->
    cfpLoadingBarProvider.includeSpinner = false
    $locationProvider.html5Mode(true)
    #$locationProvider.hashPrefix('!')

    # see http://stackoverflow.com/questions/16793724/otherwise-on-stateprovider
    $urlRouterProvider.otherwise  ($injector)->
        $state = $injector.get('$state')
        $state.go('app.index')

    $stateProvider.state('app', {
        abstract: true,
        url: '/{lang:(?:ru|ua|en|fr|de|cz)}',
        template: '<ui-view class="ui-view-animation"/>'
    })


angular.element(document).ready \
    ()-> angular.bootstrap(document, ['IndexApp'])
