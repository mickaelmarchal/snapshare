describe('home page', function() {

  var HomeController;

  beforeEach(module('app.home'));
  beforeEach(inject(function($controller) {
    HomeController = $controller('HomeController');
  }));

  it('should have a dummy test', inject(function() {
    expect(true).toBeTruthy();
  }));

  it('should have a toto var with aaaaa value', inject(function() {
    expect(HomeController.toto).toEqual('aaaaa');
  }));

});
