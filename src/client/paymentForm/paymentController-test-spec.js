'use strict';

describe('Main Controller Tests', function() {
  // load the controller's module
  beforeEach(module('myApp'));

  var MainCtrl, scope, $location, $state, $rootScope, $httpBackend, MortgageCalc;

  // Initialize the controller and a mock scope
  beforeEach(
    inject(function($controller, _$rootScope_, _$location_, _$state_, _$httpBackend_, _MortgageCalc_) {
      $location = _$location_;
      $state = _$state_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      MortgageCalc = _MortgageCalc_;

      $httpBackend.expectGET('defaultPage.html').respond(200);
      //$httpBackend.expectPOST('http://laptop.com/crmIntellectual/app/php/googleLoginGetAuthURL').respond(200);
      scope = $rootScope.$new();
      MainCtrl = $controller('MainCtrl', {
        $scope: scope
      });
    })
  );

  afterEach(function() {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('MortgageCalc tests', function() {
    it('Should be able to calculate a mortgage payment', function() {
      // $100 (amount) * 110% (percent) = 110/30 (term in years)
      expect(MortgageCalc.calcPayment(100, 30, 10)).toBe(110 / 3);
    });
  });

  // it('should go to the debit credit page', function(){
  //   $httpBackend.expectGET('paymentForm/debitCredit.html').respond(200);
  //   $state.go("payform.debitCredit");
  //   $rootScope.$digest();
  //   expect($location.path()).toBe('/debitCredit');
  //   // $httpBackend.flush();
  // });

  // describe('Tests for form validation CSS', function(){

  //   it('should return "is-invalid" string', function(){
  //     var outcome = MainCtrl.checkValidity({$touched:true, $invalid:true});
  //     expect(outcome).toBe('is-invalid');
  //   });

  //   it('should return "is-valid" string', function(){
  //     var outcome = MainCtrl.checkValidity({$touched:true, $valid:true});
  //     expect(outcome).toBe('is-valid');
  //   });
  // });
});
