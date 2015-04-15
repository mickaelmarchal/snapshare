describe('albums/list page', function() {

  var ListController;

  beforeEach(module('app.albums'));
  beforeEach(inject(function($controller) {
    ListController = $controller('ListController');
  }));

  it('should have a dummy test', inject(function() {
    expect(true).toBeTruthy();
  }));

  it('should have at least one album', inject(function() {
    expect(ListController.albums.length).toBeGreaterThan(0);
  }));

});
