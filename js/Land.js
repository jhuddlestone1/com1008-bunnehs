/*	Land.js
*
*	requires Environment.js
*	requires Entity.js
*
*	Part of 'Bunnehs!' app
*	2018 Jamie Huddlestone
*/

function Land(environment, options) {
	
	// Prevent existential crises!
	options = options || {};
	
	// Inheritance
	var self = new Entity(environment, options);
	
	self.rotation = 0;
	self.fixed = true;
	
	return self;
}