describe('albums/view page', function() {

  var ViewController;

  beforeEach(module('app.albums'));

  beforeEach(inject(function($controller) {
    ViewController = $controller('ViewController', {$stateParams: {id: 1}});
  }));

  it('should have a dummy test', inject(function() {
    expect(true).toBeTruthy();
  }));

  it('should load an album', inject(function() {
    expect(ViewController.album.title).toEqual('Album 1');
  }));

  it('should no load an album with wrong id', inject(function($controller) {
    var ViewController = $controller('ViewController', {$stateParams: {id: 42}});
    expect(ViewController.album).toBeUndefined();
  }));

});
