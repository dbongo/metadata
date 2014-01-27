'use strict';

/* Services */

angular.module('mainApp.services', [])
    .factory('Entity', function($resource){
        return $resource(
            //url
            '../api/rest/entities/:name:oid',
            //paramDefaults
            {name:'@_name', oid:'@_oid'},
            //actions
            {
                getByName:{ method:'GET' },
                update:{ method:'PUT' }
                //others (get, save, query, remove, delete) actions are by default
            });
    })