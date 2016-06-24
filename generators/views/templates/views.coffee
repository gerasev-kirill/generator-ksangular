angular.module '<%= moduleName %>'



<%  if (!viewsType) { %>
.controller '<%= viewName %>View', ($scope, <% if (inheritController) { %>$controller,<% } %> $stateParams) -> <% if (inheritController) { %>
    # подробно см ../baseControllers.coffee
    $controller('<%= inheritController %>', { $scope })
    <% } %><% if (!inheritController) { %>
    return
    <% } %>




.config ($stateProvider)->
    $stateProvider
         .state('<%= uiRouterPrefix %>.<%= viewNameLowerCase %>', {
             url: '/<%= viewNameLowerCase %>',
             controller: '<%= viewName %>View',
             templateUrl: '/@@__SOURCE_PATH__/<%= viewNameLowerCase %>View.html',
             resolve:{
                $title: ()-> '<%= viewName %>'
             }
         })

<% } %>


<% if (viewsType.indexOf('l')>-1) { %>
.controller '<%= viewName %>ListView', ($scope, <% if (inheritController) { %>$controller,<% } %> $stateParams) ->
    <% if (inheritController) { %>
    $scope.ModelName = '<%= viewName %>'
    # подробно см ../baseControllers.coffee
    $controller('<%= inheritController %>', { $scope })
    <% } %><% if (!inheritController) { %>
    return
    <% } %>
<% } %>


<% if (viewsType.indexOf('d')>-1) { %>
.controller '<%= viewName %>DetailsView', ($scope, <% if (inheritController) { %>$controller,<% } %> $stateParams) ->
    $scope.id = $stateParams.id
    <% if (inheritController) { %>
    $scope.ModelName = '<%= viewName %>'
    # подробно см ../baseControllers.coffee
    $controller('<%= inheritController %>', { $scope })
    <% } %>
<% } %>


<% if (viewsType.indexOf('e')>-1 || viewsType.indexOf('a')>-1) { %>
.controller '<%= viewName %>EditView', ($scope, <% if (inheritController) { %>$controller,<% } %> $stateParams) ->
    $scope.id = $stateParams.id
    <% if (inheritController) { %>
    $scope.ModelName = '<%= viewName %>'
    # подробно см ../baseControllers.coffee
    $controller('<%= inheritController %>', { $scope })
    <% } %>
<% } %>





<% if (viewsType) { %>
.config ($stateProvider)->
    $stateProvider
        .state('<%= uiRouterPrefix %>.<%= viewNameLowerCase %>', {
            url: '/<%= viewNameLowerCase %>',
            abstract: true,
            template: '<ui-view class="ui-view-animation"/>',
        })<% if (viewsType.indexOf('l')>-1) { %>
        .state('<%= uiRouterPrefix %>.<%= viewNameLowerCase %>.list', {
            url: '/list',
            controller: '<%= viewName %>ListView',
            templateUrl: '/@@__SOURCE_PATH__/<%= viewNameLowerCase %>ListView.html',
            resolve:{
               $title: ()-> '<%= viewName %> List'
            }
        })<% } %><% if (viewsType.indexOf('d')>-1) { %>
        .state('<%= uiRouterPrefix %>.<%= viewNameLowerCase %>.details', {
            url: '/id/:id',
            controller: '<%= viewName %>DetailsView',
            templateUrl: '/@@__SOURCE_PATH__/<%= viewNameLowerCase %>DetailsView.html',
            resolve:{
               $title: ()-> '<%= viewName %>'
            }
        })<% } %><% if (viewsType.indexOf('e')>-1) { %>
        .state('<%= uiRouterPrefix %>.<%= viewNameLowerCase %>.edit', {
            url: '/edit/id/:id',
            controller: '<%= viewName %>EditView',
            templateUrl: '/@@__SOURCE_PATH__/<%= viewNameLowerCase %>EditView.html',
            resolve:{
               $title: ()-> '<%= viewName %> Edit'
            }
        })<% } %><% if (viewsType.indexOf('a')>-1) { %>
        .state('<%= uiRouterPrefix %>.<%= viewNameLowerCase %>.add', {
            url: '/add',
            controller: '<%= viewName %>EditView',
            templateUrl: '/@@__SOURCE_PATH__/<%= viewNameLowerCase %>EditView.html',
            resolve:{
               $title: ()-> '<%= viewName %> Add'
            }
        })
        <% } %>

<% } %>
