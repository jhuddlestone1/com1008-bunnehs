/*	main.js
*
*	requires Environment.js
*	requires Entity.js
*	requires Bunny.js
*
*	Part of 'Bunnehs!' app
*	2018 Jamie Huddlestone
*/

// Global array to store references to Bunny objects, augmented with own methods
var bunnies = [];

bunnies.removeAll = function () {
	this.splice(0);
}

bunnies.remove = function (bunny) {
	if (bunny) {
		this.splice(this.indexOf(bunny), 1);
	}
	else this.shift();	// First in, first out!
}

bunnies.add = function (num) {
	for (var i = 0; i < (num || 1); i++) {
		this.push(
			// Create bunnies!
			//Random position and fixed size, both proportional to viewport
			new Bunny(env, {
				x: env.width * (Math.random() * 0.8 + 0.05),
				y: env.height * (Math.random() * 0.5),
				size: env.height / 5,
				isFacingRight: Math.round(Math.random()),
				// A little initial velocity...
				i: Math.random() * 4 - 2
			})
		);
	}
}

// Store reference to selected bunny
var selectedBunny = null;

// Set canvas size relative to viewport
var canvas = document.getElementById("bunnehs");
canvas.width = innerWidth;
canvas.height = innerHeight * 0.8;

// Create Environment object relative to canvas
var env = new Environment(canvas);

// Create Land object relative to Environment object
var land = new Land(env, {
	x: 0,
	y: env.height * 0.8,
	w: env.width,
	h: env.height * 0.2
});

// Click handling / drag and drop
// Not using addEventListener here, as only one action should be happening at a time!
canvas.onmousedown = function (event) {
	
	// Iterate backwards in order to select the topmost bunny!
	for (var b = bunnies.length - 1; b >= 0; b--) {
		
		// Setup flag to detect if a bunny has been found
		var isBunny = false;
		
		// This redefinition prevents the mouse events from eventually referring to bunnies[-1]...
		var bunny = bunnies[b];
		
		for (var part in bunny.body) {
		
			if (env.context.isPointInPath(bunny.body[part], event.clientX, event.clientY)) {
				
				switch (part) {
					
					case "far_ear":
					case "near_ear":
					
						bunny.changeColor();
						break;
						
					default:
		
						isBunny = true;
						selectedBunny = null;
						
						var origX = event.clientX;
						var origY = event.clientY
						var handleX	= event.clientX - bunny.x;
						var handleY = event.clientY - bunny.y;
						bunny.fixed = true;
						
						canvas.onmousemove = function (event) {
							bunny.move(event.clientX - handleX, event.clientY - handleY, true);
						}
						
						canvas.onmouseup = function (event) {
							canvas.onmouseup = canvas.onmousemove = null;
							bunny.fixed = false;
							bunny.vi = mouse.i; 
							bunny.vj = mouse.j;
							
							// Test to see if the mouse has moved; select bunny if not
							if (event.clientX == origX && event.clientY == origY) {
								selectedBunny = bunny;
							}
						}
				}	
			}
		}
		
		// Don't bother checking the rest of the bunnies...	
		if (isBunny) break;
	}
	
	// If a bunny is selected and the next click is on land, make the bunny jump towards click
	if (!isBunny && selectedBunny) {
		if (event.clientY > land.y) {
			selectedBunny.isFacingRight = event.clientX > selectedBunny.cx;
			selectedBunny.jumpTo(event.clientX);
		}
		selectedBunny = null;
	}
}

// Event handlers for buttons
document.getElementById("none").addEventListener("click", function () { bunnies.removeAll(); });
document.getElementById("less").addEventListener("click", function () { bunnies.remove(); });
document.getElementById("more").addEventListener("click", function () { bunnies.add(); });
document.getElementById("all").addEventListener("click", function () { bunnies.add(10); });

// Initialisation
document.onclick = function () {
	
	document.onclick = null;
	document.getElementById("title").style.display = "none";
	document.getElementById("credits").style.display = "none";
	document.getElementById("controls").style.display = "initial";
	document.getElementById("instructions").style.display = "initial";
	bunnies.add();
};

// Mouse movement data
var mouse = {
	// Position in previous frame
	px: 0,
	py: 0,
	// Position in current frame
	x: 0,
	y: 0,
	// Acceleration over last frame
	i: 0,
	j: 0
}
document.onmousemove = function (event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

// Main loop
setInterval(function () {
	
	// Update stored mouse data every frame
	mouse.i = mouse.x - mouse.px;
	mouse.j = mouse.y - mouse.py;
	mouse.px = mouse.x;
	mouse.py = mouse.y;
	
	env.context.clearRect(0, 0, env.width, env.height);
	
	// Apply gravity and calculate collisions 
	for (var b = 0; b < bunnies.length; b++) {
		
		bunnies[b].accelerate(
			bunnies[b].fall()
		);
		
		var angle = bunnies[b].collision(land);
		if (angle != null) {
			var reaction = bunnies[b].reaction(land, Math.PI/2);
			bunnies[b].accelerate([
				-bunnies[b].i * bunnies[b].e,
				reaction[1] - env.gravity
			]);
		}
	}
	
	// Draw bunnies
	for (var b = 0; b < bunnies.length; b++) {
		
		// Modify bunny if selected
		bunnies[b].isSelected = bunnies[b] == selectedBunny;
		
		bunnies[b].move().draw();
	}
	
}, 1000/60);