/* 
 * Custom i18n library
 */
var I18n = function(locale, default_locale){
	this.locale = locale;
	this.default_locale = default_locale;
	
	var i18n = this;
	this.strings = {};
	
	var loadStrings = function(){
		// load default
		loadLocale( default_locale, function( strings ){
			i18n.strings = strings;
			// now override with localized messages
			if ( locale != default_locale ) {
				loadLocale( locale, function( strings ){
					for ( key in strings ) {
						i18n.strings[key] = strings[key];
					};
				} )
			};
		} );
	};
	
	var loadLocale = function( locale, callback ){
		var req = new XMLHttpRequest();
		req.open( 'GET', 'locales/'+locale+'.json', false );
		req.addEventListener( 'readystatechange', function( e ){
			if ( 4 == e.target.readyState ) {
				callback( JSON.parse(e.target.responseText) );
			};
		});
		req.send();
	}
	
	loadStrings();
	
	this.t = function( string, stringIfMissing ){
		var replace;
		if( replace = i18n.strings[string] ){
			return replace.message;
		} else {
			return stringIfMissing ? stringIfMissing : "i18n: " + string;
		}
	}
	
};

