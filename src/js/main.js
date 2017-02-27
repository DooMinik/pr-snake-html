/**
 * Variablen (Global)
 */
var myTimer;
var mySnake;
var myApple;
var idCounter = 0;

/**
 * Konstanten
 */
const xAchse = 0;
const yAchse = 1;

function getPositionOfElement(element) {
	position = element.getAttribute("data-position").split(",");
	return position;
}

function snake(len, pos) {
	this.parts = len;
	this.position = pos;
	this.direction = "r";
	this.tempdirection = "r";

	/*
	 * Neuer Kopf
	 * move - vorhanden
	 *
	 *
	 */

	var neuerKopf = new snakepart();
	neuerKopf.grid.setClassName("head");
	neuerKopf.grid.setPosition(pos);
	neuerKopf.setCd(len);

	this.move = function(dir) {
		var switchDirection = true;
		var failed = false;
		var newPos = this.position;

		switch(this.tempdirection) {
			case "u":
				if(this.direction == "d") {
					switchDirection = false;
					newPos[yAchse]++;
				} else {
					newPos[yAchse]--;
				}
				if(this.position[yAchse] == -1) failed = true;
				break;
			case "d":
				if(this.direction == "u") {
					switchDirection = false;
					newPos[yAchse]--;
				} else {
					newPos[yAchse]++;
				}
				if(this.position[yAchse] == 60) failed = true;
				break;
			case "l":
				if(this.direction == "r") {
					switchDirection = false;
					newPos[xAchse]++;
				} else {
					newPos[xAchse]--;
				}
				if(this.position[xAchse] == -1) failed = true;
				break;
			case "r":
				if(this.direction == "l") {
					switchDirection = false;
					newPos[xAchse]--;
				} else {
					newPos[xAchse]++;
				}
				if(this.position[xAchse] == 80) failed = true;
				break;
		}

		if(switchDirection)
			this.direction = dir
		else {
			this.tempdirection = this.direction;
			dir = this.direction;
		}

		// in sich selber laufen
		if(
			$("[data-position = '"+this.position.join()+"']").length &&
			!$("[data-position = '"+this.position.join()+"']").hasClass("apple")
		) {
			failed = true;
		}

		if(failed) {
			$(".map").addClass("failed").children().remove();
			clearInterval(myTimer);
		} else {
			if(newPos.join() == $('.apple').attr('data-position')) {
				this.parts++;
				// Body anstelle von alten Kopf
				$(".head").removeClass("head").addClass("body");
				// neuer Apfel
				myApple.grid.setPosition(getFreiePositionZufall());
				// neuer Kopf anstelle von Apfel
				var neuerKopf = new snakepart();
				neuerKopf.grid.setClassName("head");
				neuerKopf.grid.setPosition(newPos);
				neuerKopf.setCd(this.parts);
			} else {
				// cd runter
				$("[data-cd]").each(
					function () {
						var tempCD = $(this).attr("data-cd");
						$(this).attr("data-cd", --tempCD);
					}
				);
				// alter Kopf zu Body
				$(".head").removeClass("head").addClass("body");
				// neuen Kopf erstellen
				var neuerKopf = new snakepart(this.parts);
				neuerKopf.grid.setClassName("head");
				neuerKopf.grid.setPosition(newPos);
				neuerKopf.setCd(this.parts);
				// Body mit cd = 0 entfernen
				$("[data-cd = '0']").remove();
			}
		}
	};
}

function myTimeoutFunction() {
	myTimer = setInterval(myTimerFunction, 80);
}

function myTimerFunction() {
	mySnake.move(mySnake.tempdirection);
}

function getFreiePositionZufall() {
	var ret;
	do {
		ret = [Math.floor((Math.random() * 80)), Math.floor((Math.random() * 60))];
	} while($("[data-position = '" + ret.join() + "']").length)
	return ret;
}

function main() {
	mySnake = new snake(4, [40,30]);
	myApple = new apple();
	myApple.grid.setPosition([10,10])

	setTimeout(myTimeoutFunction, 2000);

	document.addEventListener("keyup", (event) => {
		const keyName = event.key;

		if(keyName === "ArrowUp") {
			mySnake.tempdirection = "u";
		} else if(keyName === "ArrowDown") {
			mySnake.tempdirection = "d";
		} else if(keyName === "ArrowLeft") {
			mySnake.tempdirection = "l";
		} else if(keyName === "ArrowRight") {
			mySnake.tempdirection = "r";
		}
	}, false);
}

var game = new Game();
// game.audio["move"].play();

// var snake = new Snake(4, idCounter);
// console.log(idCounter);
// console.log(snake.getClassOfPosition([40,30]));
