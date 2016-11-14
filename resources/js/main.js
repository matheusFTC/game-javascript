var canvas, context, height, width, 
	maxJump, speedObstacles, minTime, currentStatus;

var obstacleImg = new Image(), 
	personageImg = new Image(), 
	floorImg = new Image(),
	statusStoppedImg = new Image(),
	statusLoserImg = new Image();

var gameStatus = {
	running: 1,
	stopped: 2,
	loser: 3
};

var floor = {
	x: 0,
	y: 430,
	width: 900,
	height: 50,
	update: function() {
		this.x -= speedObstacles;

		if (this.x <= -900) {
			this.x = 0;
		}
	},
	draw: function() {
		floorSprite.draw(context, floorImg, this.x, this.y, this.width, this.height);
		floorSprite.draw(context, floorImg, this.x + floorSprite.width, this.y, this.width, this.height);
	}
};

var personage = {
	x: 50,
	y: 0,
	width: 120,
	height: 124,
	gravity: 1.5,
	speed: 0,
	jumpForce: 20,
	countJump: 0,
	score: 0,
	draw: function() {
		personageSprite.draw(context, personageImg, this.x, this.y, this.width, this.height);
	},
	update: function() {
		this.speed += this.gravity;
		this.y += this.speed;

		if (this.y > floor.y - this.height && currentStatus != gameStatus.loser) {
			this.y = floor.y - this.height;
			this.countJump = 0;
			this.speed = 0;
		}
	},
	jump: function() {
		if (this.countJump < maxJump) {
			this.speed = -this.jumpForce;
			this.countJump++;
		}
	},
	reset: function() {
		this.y = 0;
		this.speed = 0;
		this.score = 0;
	}
};

var obstacles = {
	_collection: [],
	time: 0,
	insert: function() {
		this._collection.push({
			x: width,
			width: 50,
			height: 50
		})
	
		this.time = minTime + Math.floor(flexTime * Math.random());
	},
	update: function() {
		if (this.time == 0) {
			this.insert();
		} else {
			this.time--;
		}
		for (var i = 0, l = this._collection.length; i < l; i++) {
			var obstacle = this._collection[i];
			obstacle.x -= speedObstacles;

			if (personage.x < obstacle.x + obstacle.width
					&& personage.x + personage.width >= obstacle.x
					&& personage.y + personage.height >= floor.y - obstacle.height) {
				currentStatus = gameStatus.loser;
			} else if (obstacle.x == 0) {
				personage.score++;
			} else if (obstacle.x <= -obstacle.width) {
				this._collection.splice(i, 1);
				l--;
				i--;
			}
		}
	},
	draw: function() {
		for (var i = 0, l = this._collection.length; i < l; i++) {
			var obstacle = this._collection[i];
			obstacleSprite.draw(context, obstacleImg, obstacle.x, floor.y - obstacle.height, obstacle.width, obstacle.height);
		}
	},
	clear: function() {
		this._collection = [];
	}
};

var obstacleSprite = new Sprite(0, 0, 50, 50), 
	personageSprite = new Sprite(0, 0, 120, 124),
	floorSprite = new Sprite(0, 0, 900, 50),
	statusStoppedSprite = new Sprite(0, 0, 260, 130);
	statusLoserSprite = new Sprite(0, 0, 500, 100);

function begin() {
	frames = 0;
	height = 480;
	width = 900;
	maxJump = 3;
	speedObstacles = 6;
	minTime = 20;
	flexTime = 120;

	canvas = document.createElement("canvas");
			
	canvas.id = "container";
	canvas.height = height;
	canvas.width = width;
	canvas.className = "container";

	context = canvas.getContext("2d");

	document.body.appendChild(canvas);
	document.addEventListener("mousedown", onAction);
	document.addEventListener("keyup", onAction);

	currentStatus = gameStatus.stopped;

	obstacleImg.src = "resources/images/obstacle.png";
	personageImg.src = "resources/images/personage.png";
	floorImg.src = "resources/images/floor.png";
	statusStoppedImg.src = "resources/images/status_stopped.png";
	statusLoserImg.src = "resources/images/status_loser.png";

	run();
}

function run() {
	update();
	draw();

	window.requestAnimationFrame(run);
}

function onAction(event) {
	if (currentStatus == gameStatus.running) {
		personage.jump();
	} else if (currentStatus == gameStatus.stopped) {
		currentStatus = gameStatus.running;
	} else if (currentStatus == gameStatus.loser) {
		currentStatus = gameStatus.stopped;
		obstacles.clear();
		personage.reset();
	}
}

function update() {
	floor.update();
	personage.update();
	
	if (currentStatus == gameStatus.running) {
		obstacles.update();
	}
}

function draw() {
	context.fillStyle = "#CFD8DC";
	context.fillRect(0, 0, width, height);

	context.fillStyle = "#FFFFFF";
	context.font = "38px sans-serif";
	context.fillText(personage.score, 20, 48);

	switch (currentStatus) {
		case gameStatus.running:
			obstacles.draw();
			break;
		case gameStatus.stopped:
			statusStoppedSprite.draw(context, statusStoppedImg, width / 2 - 120, height / 2 - 70, 260, 130);
			break;
		case gameStatus.loser:
			statusLoserSprite.draw(context, statusLoserImg, width / 2 - 120, height / 2 - 70, 500, 100);
			break;
		default:
			break;
	}

	floor.draw();
	personage.draw();
}

begin();