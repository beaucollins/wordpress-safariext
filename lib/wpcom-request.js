var WPComRequest = function( onAuthFailure ){
	
	var wpcom_request = this;
	
	this.request = function( url, post_body, success, error ){
		var xhr = new XMLHttpRequest(),
			method = 'GET',
			body = false;

		if ( post_body ) {
			if ( typeof post_body == 'object' ) {
				var params = [];
				for( param in post_body ){
					params.push( param + '=' + encodeURIComponent( post_body[param] ) );
				}
				body = params.join( '&' );
			} else {
				body = post_body;
			}
		};
		
		if ( body ) {
			method = 'POST';
		};
		
		
		xhr.open( method, url, true );
		xhr.setRequestHeader( 'X-User-Agent', navigator.userAgent.replace( 'Safari', 'WPComSafariExtension' ));
		if ( method == 'POST' ) {
			xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		};
		
		xhr.addEventListener( 'readystatechange', function( e ){
			if ( 4 == xhr.readyState ) {

				try {
					var data = JSON.parse( xhr.responseText );
				} catch(e) {
					var data = { error:e, code:'genericServerError', message:'Could not reach the WordPress.com server.' };
				}

				if ( data != null ) {
					if ( typeof data == 'object' && "error" in data ) {
						if ( 'auth' == data.error ) {
							if ( typeof WPComRequest.onAuthFailure == 'function' ) {
								WPComRequest.onAuthFailure.call( wpcom_request, data );
							};
						};
						error( data );
					} else {
						if ( typeof WPComRequest.onAuthSuccess == 'function' ) {
							WPComRequest.onAuthSuccess.call( wpcom_request, data );
						};
						success( data );
					}
				}
			};
		} );
		xhr.send( body );
		return xhr;
	}
	
}
