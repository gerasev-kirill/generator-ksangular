angular.module 'helpers'



.controller 'BaseDetailsView', ($scope, $injector, $stateParams) ->
    ###
       контроллер для наследования.
       ====================================================================
       $scope.Model - ngResource от серверной модели
          (
          CmsArticle и его потомки,
          CmsKeyword и его потомки
          ).
       $scope.forceLang - язык по которому потом можно принудительно отображать данные
       $scope.ModelName - ее название.
       ==========================
       если в url есть ключ modelName, то переменные $scope.Model, $scope.ModelName
       берутся из него
    ###
    $scope.error = 0
    $scope.active = 0 # переменная для табов(если используются)
    # не удалять объявление $scope.item. иначе потом ангулар
    # начинает терять эту переменную при вложенных директивах
    $scope.item = {}
    $scope.loading = false
    if !$scope.ModelName and !$scope.Model and !$stateParams.modelName
       console.error('BaseDetailsView:: Cant find ModelName or Model in $scope!')
       return


    if $stateParams.modelName
       $scope.ModelName = $stateParams.modelName
    if $scope.ModelName
       try
          $scope.Model = $injector.get($scope.ModelName)
       catch e
          console.error("BaseDetailsView:: Cant get model '#{$scope.ModelName}' with $injector!")
          return

    $scope.loadData = () ->
       if not $stateParams.id
          $scope.error = 404
          return
       $scope.loading = true
       $scope.error = 0
       $scope.Model.findById {id: $stateParams.id},
          (data)->
             $scope.item = data
             $scope.loading = false
          ,
          (data)->
             $scope.error = data.status
             $scope.item = {}
             $scope.loading = false

    ############
    $scope.loadData()




.controller 'BaseListView', ($scope, $injector, $stateParams)->
    ###
       контроллер для наследования.
       ==========================
       $scope.Model = (
                    CmsArticle и его потомки,
                    CmsKeyword и его потомки
                   ).
       $scope.forceLang - язык по которому потом можно принудительно отображать данные
       $scope.ModelName - название модели.
       $scope.fields = {title:true, ...} - список полей, которые будут вытягиваться
       с сервера
       ==========================
       если в url есть ключ modelName, то переменные $scope.Model, $scope.ModelName
       берутся из него
    ###

    $scope.sortType = 'publicationDate'
    $scope.searchTerm = ''
    $scope.error = 0
    $scope.active = 0  # переменная для табов(если используются)
    $scope.items = []
    if !$scope.ModelName and !$scope.Model
        console.error('BaseListView:: Cant find ModelName or Model in $scope!')
        return


    if $stateParams.modelName
        $scope.ModelName = $stateParams.modelName
    if $scope.ModelName
        try
            $scope.Model = $injector.get($scope.ModelName)
        catch e
            console.error("BaseDetailsView:: Cant get model '#{$scope.ModelName}' with $injector!")
            return

    if $scope.forceLang
        $scope.$watch 'forceLang', (forceLang)->
           if $scope.sortType.indexOf('title') > -1
              $scope.sortType = "title.#{forceLang}"


    $scope.loadData = () ->
        $scope.loading = true
        $scope.Model.query {
                filter: {
                    fields: $scope.fields,
                    where: $scope.where  or  {}
                }
            },
            (data)->
                $scope.items = data
                $scope.loading = false
            ,
            (data)->
                $scope.loading = false
                $scope.items = []
                $scope.error = data.status

    ############
    $scope.loadData()
