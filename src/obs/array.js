"use strict";

const triggerChange = function() {
	if( this._cb ) {
		let result = [];
		this.forEach( v => result.push( v ) );
		this._cb( result );
	}
};

const ObservableArray = function( array, cb ) {
	Array.prototype.push.apply( this, array );
	this._cb = cb;
	return this;
};

ObservableArray.prototype = Object.create( Array.prototype );

['push',
	'pop',
	'shift',
	'unshift',
	'splice',
	'splice',
	'sort',
	'reverse'].forEach( ( method ) => {

	ObservableArray.prototype[ method ] = function() {

		Array.prototype[ method ].apply( this, arguments );
		triggerChange.call(this);
	};
} );

export default ObservableArray;