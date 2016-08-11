/**
 * React list bridge
 */
window.safeLauncher.factory('logListComponent', ['eventRegistrationFactory',
	function(eventRegistry) {
    var self = this;
    var reactComponent;

    self.register = function(component) {
      reactComponent = component;      
      reactComponent.state.list = eventRegistry.logList;
    };
    
    self.unregister = function() {
      reactComponent = null;
    };

    self.update = function(list) {
	  if (!reactComponent) {
        return;
	  }
	  reactComponent.setState({ list:list });
    };

    return self;
  }
]);
