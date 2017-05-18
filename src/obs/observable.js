"use strict";

import ObservableArray from "./array";

const Observable = function( o, cb ) {

	const copy = {};

	const processNewValue = function( v, prop ) {
		if( v.constructor === Array ) {
			return observeArray( v, prop );
		}
		return v;
	};

	const observeArray = function( a, prop ) {
		return new ObservableArray( a, ( result ) => {
			copy[prop] = result;
			cb(copy);
		} );
	};

	for( let prop in o ) {
		copy[prop] = o[prop];
		o[prop] = processNewValue( o[prop], prop );
	}

	const handler = {
		set( original, k, v ) {
			original[k] = processNewValue(v, k);
			copy[k] = v;
			cb(copy);
			return true;
		},
		deleteProperty( original, k ) {
			delete original[k];
			delete copy[k]
			cb(copy);
			return true;
		}
	};

	return new Proxy( o, handler );
};

export default Observable;