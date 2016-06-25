angular.module 'IndexApp'




.controller 'IndexView', ($scope,  $stateParams) ->
    return





.config ($stateProvider)->
    $stateProvider
         .state('app.index', {
             url: '/',
             controller: 'IndexView',
             templateUrl: '/@@__SOURCE_PATH__/indexView.html',
             resolve:{
                $title: ()-> 'Index'
             }
         })
