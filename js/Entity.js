/*	Entity.js
*
*	requires Environment.js
*
*	Part of 'Bunnehs!' app
*	2018 Jamie Huddlestone
*/

function Entity(environment, options) {
	
	// Prevent existential crises!
	options = options || {};
	
	// Store reference to Environment object
	this.env = environment;
	
	// Size
	this.w = options.w || options.width || options.size || 0;
	this.h = options.h || options.height || options.size || 0;
	this.rx = this.w / 2;
	this.ry = this.h / 2;
	this.r = Math.min(this.rx, this.ry) || options.r || options.radius;
	
	// Position
	this.x = options.cx - this.rx || options.x || environment.left;
	this.y = options.cy - this.ry || options.y || environment.top;
	this.cx = this.x + this.rx || options.cx;
	this.cy = this.y + this.ry || options.cy;
	
	// Initial velocity (pixels per frame)
	this.i = options.i || 0;
	this.j = options.j || 0;
	
	// Final velocity
	this.vi = this.i;
	this.vj = this.j;
	
	// Elasticity
	this.e = options.e || options.elasticity || 1;
	
	// Mass ( > 0 )
	this.m = options.m || options.mass || 1;
	
	// Gravity effect
	this.fixed = options.fixed || false;
	
	// Apply change in size
	this.resize = function (w, h, fromCenter) {
		this.w = (w != null) ? w : this.w;
		this.h = (h != null) ? h : this.h;
		this.rx = this.w / 2;
		this.ry = this.h / 2;
		this.r = Math.min(this.rx, this.ry);
		if (fromCenter) {
			this.x = this.cx - this.rx;
			this.y = this.cy - this.ry;
		} else {
			this.cx = this.x + this.rx;
			this.cy = this.y + this.ry;
		}
		return this;
	}
	
	// Apply change in position
	this.move = function (x, y, absolute) {
		this.i = this.vi;
		this.j = this.vj;		
		this.x = absolute ? x : this.x + x || this.x + this.i;
		this.y = absolute ? y : this.y + y || this.y + this.j;
		this.cx = this.x + this.rx;
		this.cy = this.y + this.ry;
		return this;
	}
	
	// Calculate change in velocity; accepts multiple arrays of two numbers [x, y]
	this.accelerate = function () {
		if (!this.fixed) {
			for (var f = 0; f < arguments.length; f++) {
				this.vi += (arguments[f][0] || 0);
				this.vj += (arguments[f][1] || 0);
			}
		}
		else {
			this.vi = 0;
			this.vj = 0;
		}
		return this;
	}
	
	// Calculate gravitational force (vertical component)
	this.fall = function () {
		return [0, this.env.gravity];
	}
	
	// Detect collision with another Entity; return either collision angle or null
	this.collision = function (ent) {
		var diffX = ent.cx - this.cx;
		var diffY = ent.cy - this.cy;
		if (Math.abs(diffX) < this.rx + ent.rx && Math.abs(diffY) < this.ry + ent.ry) {
			return Math.atan2(diffY, diffX);
		} else return null;
	}
	
	// Calculate reaction force from collision
	this.reaction = function (ent, angle) {		
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		var reaction = this.i * cos + this.j * sin;
		var bounce = this.e * reaction;
		return [
			-cos * (reaction + bounce),
			-sin * (reaction + bounce)
		];
	}
	
}