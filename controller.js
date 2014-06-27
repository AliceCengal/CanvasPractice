'use strict';

var ballApp = angular.module('BallsApp', []);

ballApp.controller('SimCtrl', function($scope, $interval) {
  
  var svg = document.getElementById('MyCanvas');
  
  $scope.sim = new Simulation(svg.clientWidth, svg.clientHeight);
  
  console.log($scope.sim);
  
  $interval(function() { $scope.sim.update(); }, 1000/30);
  
});





