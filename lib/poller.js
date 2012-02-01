/*
 * Class for polling and endpoint and parsing the response as JSON
 */ 
var Poller = ( function( ){
	
	var wpcom_request = new WPComRequest();
	
	var public = function( url, options ){
		this.options = {
			onSuccess: options.onSuccess,
			onFailure: options.onFailure
		};
		this.url = url;
		this.interval = 1000 * 60 * 5; // default interval of 5 minutes
	};
	
		
	public.prototype.start = function( interval, wait ){
		var poller  = this;
		if ( interval != null ) {
			this.interval = interval;
		};
		this.timerId = setInterval( function(){
			poller.pollEndpoint();
		}, this.interval );
		if ( wait !== true ) {
			poller.pollEndpoint();
		};
	}
	
	public.prototype.stop = function(){
		clearInterval( this.timerId );
		if( this.currentRequest) this.currentRequest.abort();
	}
	
	public.prototype.pollEndpoint = function(){
		
		var poller = this;
		
		var xhr = this.currentRequest = wpcom_request.request(
			this.url, // endpoint
			null, // no body
			function( data ){ // success
				poller.data = data;
				
				if ( data.ttl ) {
					var seconds = parseInt( data.ttl, 10 );
					poller.restart( seconds * 1000 );
				};
				
				if( typeof poller.options.onSuccess == 'function')
					poller.options.onSuccess( data, poller );
			},
			function ( data ){ // failure
				poller.data = data;
				if ( typeof poller.options.onFailure == 'function' )
					poller.options.onFailure( data, poller );
			}
		);
		
		return xhr;
		
	}
	
	public.prototype.restart = function( interval ){
		this.stop();
		this.start( interval, interval != null );
	}
	
	return public;
} )();
