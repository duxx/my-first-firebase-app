/*global Firebase*/
(function(angular) {
	'use strict';

	angular.module('firebaseApp').service('MessageService', function(FBURL, $q, $firebase) {
		var messagesRef = new Firebase(FBURL).child('messages');
		//var fireMessage = $firebase('https://sweltering-heat-6970.firebaseio.com/').child('messages');

		return {
			childAdded: function childAdded(limitNumber, cb) {
				messagesRef.startAt().limitToLast(limitNumber).on('child_added', function(snapshot){
					var val = snapshot.val();
					cb.call(this, {
						user: val.user,
						text: val.text,
						name: snapshot.key(),
						date: val.date
					});
				});
			},
			add: function addMessage (message) {
				return messagesRef.push(message);
			},
			pageNext: function pageNext (name, numberOfItems) {
				var deferred = $q.defer();
				var messages = [];
				messagesRef.startAt(null, name).limit(numberOfItems).once('value', function(snapshot) {
					snapshot.forEach(function(snapItem) {
						var itemVal = snapItem.val();
						itemVal.name = snapItem.key();
						messages.push(itemVal);
					});
					deferred.resolve(messages);
				});

				return deferred.promise;
			},
			pageBack: function pageBack(name, numberOfItems) {
				var deferred = $q.defer();
				var messages = [];
				messagesRef.endAt(null, name).limit(numberOfItems).once('value', function(snapshot) {
					snapshot.forEach(function(snapItem) {
						var itemVal = snapItem.val();
						itemVal.name = snapItem.key();
						messages.push(itemVal);
					});
					deferred.resolve(messages);
				});

				return deferred.promise;
			}
		};
	});
})(window.angular);