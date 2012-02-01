var SubscriptionList = function( subscriptions ){
	this.subscriptions = JSON.parse( localStorage.subscriptions || "[]" );
	this.urls = JSON.parse( localStorage.subscription_urls || "{}" );
	var wpcom_request = new WPComRequest;
	var list = this,
		a = document.createElement( 'a' ),
		buildURLList = function(){
			var urls = {};
			list.subscriptions.forEach( function( sub ){
				var url = normalizeURL( sub.blog_url || sub.feed_url || sub.toString() );
				a.href  = url;
				var host = "//" + a.host;
				
				urls[url] = true;
				urls[host] = true;
			} );
			
			list.urls = urls;
			localStorage.subscription_urls = JSON.stringify( urls );
		},
		normalizeURL = function( u ){
			// remove the trailingslash and protocol
			return u.replace( /\/$/, '').replace( /^[^\/]+\/\//, '//' );
		};
	
	this.isSubscribedTo = function( url ){
		url = normalizeURL( url );
		a.href = url;
		var host = '//' + a.host;
		return this.urls[url] || this.urls[host];
	};
	
	this.setSubscriptions = function( subscriptions ){
		this.subscriptions = subscriptions || [];
		localStorage.subscriptions = JSON.stringify( this.subscriptions );
		buildURLList()
	};
	
	var getNonce = function( type, success, error ){
		wpcom_request.request( 'https://public-api.wordpress.com/cookie-auth/follow?action=' + type, null, success, error );
	};
	
	var performAction = function( action, url, success, error ){
		getNonce( action + "_nonce",
			function( data ){ // success, we have a nonce
				wpcom_request.request( 'https://public-api.wordpress.com/cookie-auth/follow?action=' + action,
					{ _wpnonce: data.nonce, blog_url: url, source:'safari_extension' },
					function( d ){
						if ( d.status ) {
							var u = normalizeURL( url ),
								subscribed = action == 'subscribe';
							a.href = u;
							var host_url = '//' + a.host;
							list.urls[u] = subscribed;
							list.urls[host_url] = subscribed;
							localStorage.subscription_urls = JSON.stringify( list.urls );
							success( d );
						} else {
							error( d );
						}
					},
					error
				);
			},
			error
		);
	};
	
	this.addSubscription = function( url, success, error ){
		performAction( 'subscribe', url, success, error );
	};
	
	this.removeSubscription = function( url, success, error ){
		performAction( 'unsubscribe', url, success, error );
	};
		
};