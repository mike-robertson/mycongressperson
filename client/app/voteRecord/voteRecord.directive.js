'use strict';

angular.module('myCongresspersonApp')
  .directive('onFinishRender', function ($timeout) {
      return {
          restrict: 'A',
          link: function (scope, element, attr) {
            if (scope.$last === true) {
              $timeout(function () {
                  scope.$emit('ngRepeatFinished');
              });
            }
          }
      }
  })
  .directive('voteRecord', function () {

    var controller = ['$scope', 'sunlightAPI', function ($scope, sunlightAPI) {
      var voteCtrl = $scope;
      voteCtrl.voteInfo = [];
      voteCtrl.votesFromServer = [];
      voteCtrl.test = 'Test';
      voteCtrl.pageNumber = 1;
      voteCtrl.caretDown = false;
      voteCtrl.loadingPages = [];
      voteCtrl.perPageNumber = 3;
      voteCtrl.target;

      //todo: need to  load more into the data structure
      //then we have to get pagination working on maybe 10 items at a time
      voteCtrl.getVotingRecord = function(repId, pageNumber) {
        if(!voteCtrl.caretDown || pageNumber !== 1) {
          voteCtrl.repId = repId;
          var promiseUpdate = sunlightAPI.getVotes(repId, pageNumber, voteCtrl.perPageNumber);
          voteCtrl.loadingPages.push(pageNumber);
              promiseUpdate.then(function(votes) {
                // console.log(votes);
                console.log('fulfilled promise');
                  angular.forEach(votes.results, function(value, index) {
                      voteCtrl.votesFromServer[pageNumber * voteCtrl.perPageNumber - voteCtrl.perPageNumber + index] = value
                      voteCtrl.votesFromServer[pageNumber * voteCtrl.perPageNumber - voteCtrl.perPageNumber + index].voters = 
                        voteCtrl.votesFromServer[pageNumber * voteCtrl.perPageNumber - voteCtrl.perPageNumber + index].voters[repId];
                      // console.log(voteCtrl.votesFromServer[pageNumber * voteCtrl.perPageNumber - voteCtrl.perPageNumber + index].voters);
                  }); 
                voteCtrl.loadingPages.splice(voteCtrl.loadingPages.indexOf(pageNumber), 1);
                voteCtrl.populateVoteInfo();
              }, function(reason) {
                console.log('Failed: ' + reason);
              }, function(update) {
                console.log('Update: ' + update);
              });
        }
      };

      voteCtrl.nextPage = function() {

        if(voteCtrl.votesFromServer.length < (voteCtrl.pageNumber + 5) * voteCtrl.perPageNumber - voteCtrl.perPageNumber + 1) {
          voteCtrl.getVotingRecord(voteCtrl.repId, voteCtrl.pageNumber + 5, true);
        }
        voteCtrl.pageNumber++;
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          voteCtrl.slidePanel(voteCtrl.target, true);
        });
        voteCtrl.populateVoteInfo();
      };

      voteCtrl.previousPage = function() {
        if(voteCtrl.pageNumber > 1) {
          voteCtrl.pageNumber--;
          $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            voteCtrl.slidePanel(voteCtrl.target, true);
          });
          voteCtrl.populateVoteInfo();

        }
      };

      voteCtrl.toggleVoteInfo = function($event) {
        voteCtrl.target = angular.element($event.target).parent()[0].querySelector('.slideable-content');
        voteCtrl.slidePanel(voteCtrl.target, false);
        voteCtrl.caretDown = !voteCtrl.caretDown;
      };

      voteCtrl.inPage = function(index) {
        if(index >= voteCtrl.pageNumber * voteCtrl.perPageNumber - voteCtrl.perPageNumber && index < voteCtrl.pageNumber * voteCtrl.perPageNumber) {
          return true;
        } else {
          return false;
        }
      };

      voteCtrl.populateVoteInfo = function() {
        voteCtrl.voteInfo = new Array();
        for(var i = voteCtrl.pageNumber * voteCtrl.perPageNumber - voteCtrl.perPageNumber; i < voteCtrl.pageNumber * voteCtrl.perPageNumber; i++) {
          voteCtrl.voteInfo.push(voteCtrl.votesFromServer[i]);
        }
      };

      voteCtrl.isPageLoading = function(page) {
        if(voteCtrl.loadingPages.indexOf(page) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      voteCtrl.slidePanel = function(target, paginated) {
        // console.log(angular.element(target).children()[1].clientHeight);
        if(!voteCtrl.caretDown || paginated) {
            var children = angular.element(target).children();
            var y = 0;
            angular.forEach(children, function(value, index) {
              console.log(value.offsetHeight);
              y += value.offsetHeight;
              if(index == 1) {
                console.log('inside conditional');
                angular.forEach(angular.element(children[1]).children(), function(value, index) {
                console.log('inside inner for');
                console.log(value.offsetHeight);
                  y += value.offsetHeight;
                }); 
              }
            });
            console.log('final value:\t' + y);
            target.style.border = '1px solid rgba(0,0,0,0)';
            // var y = target.scrollHeight;
            console.log('scroll height: ' + target.scrollHeight);
            target.style.border = 0;
            target.style.height = y + 70 + 'px';
        } else {
          console.log(target.style.height);
            target.style.height = '0px';
          console.log(target.style.height);
        }
      };

      for(var i = 1; i < 6; i++) {
        voteCtrl.getVotingRecord(voteCtrl.repId, i, true);
      }

    }];

    return {
      restrict: 'EA',
      scope: {
        repId: '=representative'
      },
      controller: controller,
   //    contollerAs: 'voteCtrl',
      // bindToController: true,
      templateUrl: 'app/voteRecord/voteRecord.html',
    };
  });