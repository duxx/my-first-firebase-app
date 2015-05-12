/*global Firebase*/

'use strict';

/**
* @ngdoc function
* @name firebaseApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the firebaseApp
*/
angular.module('firebaseApp')
	.controller('MainCtrl', function ($scope, $timeout, MessageService) {
		var rootRef = new Firebase('https://sweltering-heat-6970.firebaseio.com/');
		var messagesRef = rootRef.child('messages');
		var titleRef = rootRef.child('title');

	$scope.title = null;
	$scope.currentUser = null;
	$scope.currentText = null;
	$scope.messages = [];

	titleRef.once('value', function(snapshot) {
		$scope.title = snapshot.val();
	});

	MessageService.childAdded(10, function(data) {
		$timeout(function() {
			$scope.messages.push(data);
		});
	});

	messagesRef.on('child_changed', function(snapshot) {
		$timeout(function() {
			var snapshotVal = snapshot.val();
			var message = findMessageByKey(snapshot.key());
			console.log(message);
		});
	});

	messagesRef.on('child_removed', function(snapshot) {
		$timeout(function() {
			deleteMessageByKey(snapshot.key());
		});
	});

	function deleteMessageByKey(key) {
		for(var i = 0; i < $scope.messages.length; i++)
		{
			var currentMessage = $scope.messages[i];
			if(currentMessage.name === key)
			{
				$scope.messages.splice(i, 1);
				break;
			}
		}
	}

	function findMessageByKey(key) {
		var messageFound = null;
		for(var i = 0; i < $scope.messages.length; i++)
		{
			var currentMessage = $scope.messages[i];
			if(currentMessage.name === key) 
			{
				messageFound = currentMessage;
				break;
			}
		}

		return messageFound;
	}

	$scope.sendMessage = function() {
		var d = new Date();
		var newMessage = {
			user: $scope.currentUser,
			text: $scope.currentText,
			date: d.getTime()
		};

		$scope.currentText = null;

		var promise = MessageService.add(newMessage);
		promise.then(function(name) {
			console.log(name);
		});
	};

	$scope.pageNext = function() {
		var lastItem = $scope.messages[$scope.messages.length -1];
		MessageService.pageNext(lastItem.name, 10).then(function(messages) {
			$scope.messages = messages;
		});
	};

	$scope.pageBack = function() {
		var firstItem = $scope.messages[0];
		MessageService.pageBack(firstItem.name, 10).then(function(messages) {
			$scope.messages = messages;
		});
	};
});
