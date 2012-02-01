(function(){
		
	// only check if logged in in the top frame
	if (window.top === window) {
		document.addEventListener('DOMContentLoaded', function(){
			safari.self.tab.dispatchMessage( 'loaded', this.location );
				// if we're on a wordpress.com site let's determine if we're logged in or not and
				// let the global page know
			if ( isWordPressDotCom() ) {
				safari.self.tab.dispatchMessage( 'setAuthStatus', isLoggedIn() );
			};
		} );
		
		safari.self.addEventListener( 'message', function(e){
			if ( 'getFeedURL' == e.name ) {
				var href = false;
				if( feed = document.querySelector( "link[rel=alternate][type*=rss], link[rel=alternate][type*=atom], link[rel-alternate][type*=rdf]" ) ){
					href = feed.href;
				}
				safari.self.tab.dispatchMessage( 'setFeedURL', href );
			};
		});
	}

	safari.self.addEventListener( 'message', function( e ){
		if ( 'getSelectedText' == e.name ) {
			// get the document's currently selected text
			safari.self.tab.dispatchMessage( 'setSelectedText', document.getSelection().toString() );
		};
	});

	
	function isLoggedIn(){
		var postto = /\/\/postto\.wordpress\.com\/\?abpost/i
		return isWordPress() && document.querySelector( '#wpadminbar' ) != null || postto.test( document.location.href );
	}

	function isWordPress( ){
		return document.querySelector( 'link[rel=stylesheet][href*="wp-content/"]' ) != null;
	}

	function isWordPressDotCom( ){
		if ( (/wordpress\.com$/).test( document.location.host ) ){
			return true;
		}
		return document.querySelector( 'link[rel=stylesheet][href*="wp.com/"]' ) != null;
	}
	
})();
