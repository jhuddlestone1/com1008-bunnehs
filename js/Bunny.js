/*	Bunny.js
*
*	requires Environment.js
*	requires Entity.js
*
*	Part of 'Bunnehs!' app
*	2018 Jamie Huddlestone
*/

function Bunny(environment, options) {
	
	// Prevent existential crises!
	options = options || {};
	
	// Inheritance
	var self = new Entity(environment, options);
	
	// Fix aspect ratio
	self.resize(null, self.w * 0.8);
	
	self.rotation = 0;
	self.isFacingRight = options.isFacingRight || false;
	self.isSelected = false;
	
	// Sets collision elasticity
	self.e = 0.5;
	
	// Define body part shapes 
	// Coordinates relative to centre of object [cx, cy] - this is to enable rotation at a later date!
	var body = {
		
		far_ear: {
			cx: -self.w * 0.15,
			cy: -self.h * 0.65,
			rx: self.w * 0.1,
			ry: self.h * 0.3,
			a: Math.PI/8
		},
		far_foreleg: {
			cx: -self.w * 0.3,
			cy: self.h * 0.3,
			rx: self.w * 0.125,
			ry: self.h * 0.25,
			a: Math.PI/8
		},
		far_hindleg: {
			cx: self.w * 0.25,
			cy: self.h * 0.3,
			rx: self.w * 0.15,
			ry: self.h * 0.3,
			a: Math.PI/4	
		},
		tail: {
			cx: self.w * 0.45,
			cy: self.h * 0.05,
			rx: self.w * 0.125,
			ry: self.h * 0.15,
			a: 0
		},
		torso: {
			cx: self.w * 0,
			cy: self.h * 0.1,
			rx: self.w * 0.5,
			ry: self.h * 0.33,
			a: 0
		},
		head: {
			cx: -self.w * 0.25,
			cy: -self.h * 0.25,
			rx: self.w * 0.25,
			ry: self.h * 0.25,
			a: 0
		},
		near_ear: {
			cx: -self.w * 0.05,
			cy: -self.h * 0.65,
			rx: self.w * 0.1,
			ry: self.h * 0.3,
			a: Math.PI/8
		},
		near_foreleg: {
			cx: -self.w * 0.25,
			cy: self.h * 0.35,
			rx: self.w * 0.125,
			ry: self.h * 0.25,
			a: Math.PI/8
		},
		near_hindleg: {
			cx: self.w * 0.3,
			cy: self.h * 0.35,
			rx: self.w * 0.15,
			ry: self.h * 0.3,
			a: Math.PI/4
		}
	}

	self.draw = function (rotation) {
				
		// Bounding box; used for selections
		if (self.isSelected) {
			self.boundingBox = new Path2D();
			self.boundingBox.rect(self.x, self.y, self.w, self.h);
			self.env.context.strokeStyle = "red";
			self.env.context.stroke(self.boundingBox);
		}
		
		self.body = {
			far_ear:		new Path2D,
			far_foreleg:	new Path2D,
			far_hindleg:	new Path2D,
			tail:			new Path2D,
			torso:			new Path2D,
			head:			new Path2D,
			near_ear:		new Path2D,
			near_foreleg:	new Path2D,
			near_hindleg:	new Path2D
		};
		
		for (var part in self.body)	{
			var cx = self.cx + body[part].cx * (self.isFacingRight ? -1 : 1);
			var cy = self.cy + body[part].cy;
			var rx = body[part].rx;
			var ry = body[part].ry;
			var a = body[part].a * (self.isFacingRight ? -1 : 1);
			var gradient = self.env.context.createLinearGradient(cx, cy, cx, cy + Math.max(rx, ry));
			gradient.addColorStop(0, "hsl(30, 50%, "+ self.color +"%)");
			gradient.addColorStop(1, "hsl(30, 50%, "+ (self.color - 10) +"%)");
			self.body[part].ellipse(cx, cy, rx, ry, a, 0, Math.PI*2);
			self.env.context.fillStyle = gradient;
			self.env.context.fill(self.body[part]);
		}
		
		return self;
	}
	
	// Make the bunny jump towards a given x-coordinate with a little SUVAT magic...
	self.jumpTo = function (x) {
		var direction = (x - self.cx) > 0 ? 1 : -1;
		var distance = Math.sqrt(Math.abs(x - self.cx) / 2)
		self.accelerate([direction * distance, -distance]);
	}
	
	// Set random shade of brown
	self.changeColor = function () {
		self.color = Math.ceil(Math.random() * 90 + 10);
	}
	self.changeColor();
	
	return self;
}