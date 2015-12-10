// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
});




// App controller
app.controller('calc', ['$scope','dataService',function($scope, dataService){

  init();

  var listItem = {};

  $scope.form = { length: "1", diameter: null, amount: null, result : 0};
  $scope.list = { total : 0, items : []};

  $scope.loadKof = function(length_id){
    dataService.loadKof(length_id).then(function(data){
        $scope.kof = data
      });
  };

  $scope.calculate = function(diameter, amount, form){

    if(( diameter >= 3 && diameter <= 70 ) && ( amount >= 1 && amount <= 999)){
      
      var diameterIndex = $scope.kof.diameter.indexOf(diameter);
      var kof = $scope.kof.kof[diameterIndex];

      $scope.form.result = kof * amount;
      $scope.form.title = $scope.kof.title;

      listItem = $scope.form;
    }
    else{
      $scope.resetForm(form);
    }
  };

  $scope.resetForm = function(form){
    form.$submitted = false;
    listItem = {};
    $scope.form = { length: $scope.form.length, diameter: null, amount: null, result : 0}; 
  }

  $scope.addToList = function(){
    $scope.list.total = $scope.list.total + listItem.result;
    $scope.list.items.unshift(listItem);
  }

  $scope.resetList = function(){
    $scope.list = { total : 0, items : []};
  }

  $scope.removeListItem = function(item){
    $scope.list.total = $scope.list.total - $scope.list.items[item].result;
    $scope.list.items.splice(item, 1);
    if($scope.list.items == 0){
      $scope.list.total = 0;
    }
  }


  function init(){
    dataService.loadLength().then(function(data){
        $scope.lengths = data;
      });

      dataService.loadKof(1).then(function(data){
        $scope.kof = data
      });
  }
}]);




//Services
app.factory('dataService', ['$http', function($http){
  
  return {
    loadLength : function(){
      return $http.get('data/lengths.json').then(function(response){
       return response.data;
      });
    },
    loadKof : function(length_id){
      return $http.get("data/"+length_id+".json").then(function(response){
        return response.data;
      })
    }

  }; 
}]);



//Filters
app.filter('rounding', function(){
  return function(input){

    if(input == 0){
      return input.toFixed(2);
    }

    return input < 0.01 ? input.toFixed(3) : input.toFixed(2);
  }
})