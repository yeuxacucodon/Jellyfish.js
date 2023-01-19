function canvas() {
	var App = {};
	jQuery(document).ready(function () {
		App.setup();
		App.frame = function () {
			App.update();
			window.requestAnimationFrame(App.frame);
		};
		App.frame();
	});

	App.setup = function () {
		var canvas = document.createElement("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.id = "canvas";
		document.body.appendChild(canvas);
		this.context = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
		this.stepCount = 0;
		this.xC = canvas.width / 2;
		this.yC = canvas.height / 2;
		this.target = {
			x: this.xC,
			y: this.yC,
			radius: 20,
		};
		this.armsPop = 20;
		this.arms = [];
		for (var i = 0; i < this.armsPop; i++) {
			this.arms.push([]);
		}
		this.initialBirth();
		this.springStiffness = 0.5;
		this.isElastic = false;
		this.viscosity = 0.1;
	};

	App.initialBirth = function () {
		for (var armIndex = 0; armIndex < this.arms.length; armIndex++) {
			var arm = this.arms[armIndex];
			var particlesNb = 20 + Math.ceil(20 * Math.random());

			for (var i = 0; i < particlesNb; i++) {
				var x = this.width * Math.random();
				var y = this.height * Math.random();
				var particle = {
					x: x,
					y: y,
					xLast: 0,
					yLast: 0,
					xSpeed: 0,
					ySpeed: 0,
					stickLength: 10,
					name: "seed${this.stepCount}",
				};
				arm.push(particle);
			}
		}
	};

	App.update = function () {
		this.evolve();
		this.move();
		this.draw();
	};

	// Check
	App.evolve = function () {
		this.stepCount++;
		this.target.radius = 10 + 20 * Math.sin(this.stepCount / 10);
	};

    App.move
}
