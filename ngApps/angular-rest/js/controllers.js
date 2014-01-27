'use strict';

/* Controllers */

angular.module('mainApp.controllers', [])

    /* $http */
    .controller('httpCtrl', function($scope, $http, $rootScope){

        /*
         * Function definitions
         */
        $scope.getEntities = function (){
            return $http({method:'GET',url: '/api/rest/entities'})
                .success(function(data){
                    console.log('!!! SUCCESS getEntities');
                    $scope.entities = data;
                })
                .error(function(){
                    console.log('??? Failed getEntities...')
                });
        };

        //save to DB
        $scope.postEntity = function (entity){
            return $http({method:'POST',url: '/api/rest/entities', data: entity})
                .success(function(data){
                    console.log('!!! SUCCESS postEntity');
                    $rootScope.$broadcast('getEntities'); // to update projects with new data
                })
                .error(function(){
                    console.log('??? Failed postEntity...')
                });
        };

        //save or update in DB by document id
        $scope.putEntity = function (entity){
            return $http({
                method:'PUT',
                url: '/api/rest/entities/'+entity._id.$oid,
                data:{
                    name: entity.name,
                    site: entity.site,
                    description: entity.description
                }
            })
                .success(function(data){
                    console.log('!!! SUCCESS putEntity');
                    $rootScope.$broadcast('getEntities'); // to update projects with new data
                })
                .error(function(){
                    console.log('??? Failed putEntity...')
                });
        };

        // remove from DB by document id - project._id.$oid
        $scope.deleteEntity = function (oid){
            return $http.delete('/api/rest/entities/'+oid)
                .success(function(data){
                    console.log('!!! SUCCESS deleteEntity');
                    $rootScope.$broadcast('getEntities'); // to update projects with new data
                })
                .error(function(){
                    console.log('??? Failed deleteEntity...')
                });
        };

        /*
         * Retrieve data from DB and store it to $scope.projects variable.
         * Initialize and refresh data after data is changed in DB
         */
        $scope.getEntities();

        // Catch the broadcast call
        $scope.$on('getEntities', function(){
            $scope.getEntities();
        });

        // initialize template for modal dialogs (add and edit project element)
        $scope.modalEntity = {
            add:{},
            edit:{}
        };

        // return copy of any object
        $scope.getCopy = function(object){
            return angular.copy(object);
        }
    })

    /* $resource */
    .controller('resourceCtrl', function($scope,$http,$rootScope,Project){
        /*
         * Function definitions
         */

        $scope.entities = Project.query(function(){
            console.log('!!! SUCCESS getEntities Resource !!!');
        });

        //save to DB
        $scope.postEntity = function (entity){
            return new Entity(entity).$save(
                function(){
                    console.log('!!! SUCCESS postEntity');
                    $rootScope.$broadcast('getEntities'); // to update projects with new data
                },
                function(){
                    console.log('??? Failed postEntity...')
                }
            );
        };

        //save or update in DB by document id
        $scope.putEntity = function (entity){
            var data = {
                name: entity.name,
                site: entity.site,
                description: entity.description
            };
            return new Entity(data).$update(
                {oid: entity._id.$oid},
                function(){
                    console.log('!!! SUCCESS putEntity');
                    $rootScope.$broadcast('getEntities'); // to update projects with new data
                },function(){
                    console.log('??? Failed putEntity...')
                });
        };

        // remove from DB by document id - project._id.$oid
        $scope.deleteEntity = function (oid){
            return new Entity().$delete(
                {oid: oid},
                function(){
                    console.log('!!! SUCCESS deleteEntity');
                    $rootScope.$broadcast('getEntities'); // to update projects with new data
                },
                function(){
                    console.log('??? Failed deleteEntity...')
                });
        };

        /*
         * Retrieve data from DB and store it to $scope.projects variable.
         * Initialize and refresh data after data is changed in DB
         */

        // Catch the broadcast call
        $scope.$on('getEntities', function(){
            $scope.entities = Entity.query();
        });

        // initialize template for modal dialogs (add and edit project element)
        $scope.modalEntity = {
            add:{},
            edit:{}
        };

        // return copy of any object
        $scope.getCopy = function(object){
            return angular.copy(object);
        }

    });

