angular.module 'IndexApp'




.controller 'SecondPageView', ($scope,  $stateParams) ->
    $scope.boats = 1





.config ($stateProvider)->
    $stateProvider
         .state('app.secondPage', {
             url: '/secondPage',
             controller: 'SecondPageView',
             templateUrl: '/@@__SOURCE_PATH__/secondPageView.html',
             resolve:{
                $title: ()-> 'SecondPage'
             }
         })
