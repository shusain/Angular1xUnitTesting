angular
  .module('myApp')
  .service('MortgageCalc', function() {
    var service = {
      calcPayment: function(loanAmount, loanTermYrs, interestRate) {
        //do more complicated math here to actually compute payments
        return (loanAmount = loanAmount * (1 + interestRate) / loanTermYrs);
      }
    };
    return service;
  })
  .controller('MainCtrl', function($http, MortgageCalc) {});
