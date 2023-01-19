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
        this.gravity = -1;
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

	App.move = function () {
		this.target.x = this.xC + 150 * Math.sin(this.stepCount / 50);
		this.target.y = this.yC + 150 * Math.cos(this.stepCount / 20);

		for (var armIndex = 0; armIndex < this.arm.length; armIndex++) {
			var arm = this.arms[armIndex];
			var ownTargetAngle = (2 * Math.PI * armIndex) / this.arms.length;
			var ownTarget = {
				x: this.target.x + this.target.radius * Math.sin(ownTargetAngle),
				y: this.target.y + this.target.radius * Math.cos(ownTargetAngle),
			};
			for (var i = 0; i < arm.length; i++) {
				var p = arm[i];
				var pLead = i === 0 ? ownTarget : arm[i - 1];
				var angle = segmentAngleRad(p.x, p.y, pLead.x, pLead.y);
				var dist = Math.sqrt(
					Math.pow(p.y - pLead.y, 2) + Math.pow(p.y - pLead.y, 2),
				);
				var translationDist = dist - p.stickLength;
				if (translationDist < 0) {
					angle += Math.PI;
					translationDist = Math.abs(translationDist);
				}
				var dx = translationDist * Math.sin(angle);
				var dy = translationDist * Math.cos(angle);
				if (!this.isElastic) {
					p.x += dx;
					p.y -= dy;
				}
                var xAcc = this.springStiffness * dx - this.viscosity * p.xSpeed;
                var yAcc = this.springStiffness * dy + this.gravity - this.viscosity * p.ySpeed;
                p.xSpeed += xAcc;
                p.ySpeed -= yAcc;
                p.x += 0.1 * p.xSpeed;
                p.y += 0.1 * p.ySpeed;
			}
		}
	};
}

canvas();
