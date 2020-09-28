/*	Environment.js
*
*	requires HTML5 <canvas> DOM element as argument
*
*	Part of 'Bunnehs!' app
*	2018 Jamie Huddlestone
*/

function Environment(canvas, options) {
	
	// Prevent existential crises!
	options = options || {};
	
	// Store reference to canvas object
	this.context = canvas.getContext("2d");
	
	// Size
	this.width = options.width || options.w || canvas.width;
	this.height = options.height || options.h || canvas.height;
	
	// Position
	this.left = options.left || options.x || 0;
	this.top = options.top || options.y || 0;
	
	// Physical properties
	this.gravity = options.gravity || options.g || 1;	// pixels per frame
	this.windX = options.windX || options.wind || 0;
	this.windY = options.windY || 0;
	
}