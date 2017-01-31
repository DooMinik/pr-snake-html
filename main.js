/**
 * Variablen (Global)
 */
var myTimer;
var mySnake;
var myApple;

/**
 * Konstanten
 */
const xAchse = 0;
const yAchse = 1;

function getPositionOfElement(element) {
	position = element.getAttribute("data-position").split(",");
	return position;
}

function apple() {
	this.position = [0,0];

	this.setPosition = function() {
		this.position = [Math.floor(Math.random() * 80), Math.floor(Math.random() * 60)];
		if($("[data-position = '"+this.position.join()+"']").length)	this.setPosition();
	}

	this.createApple = function() {
		$(".map").append(
				"<div class='grid apple' data-position='" + this.position.join() + "'></div>"
		);

		$(".apple")
			.css("left"	, this.position[xAchse] * 10)
			.css("top"	, this.position[yAchse] * 10);
	}

	this.setPosition();
	this.createApple();
}

function snake(len, pos) {
    this.parts = len;
    this.position = pos;
		this.direction = "r";
		this.tempdirection = "r";

		this.createHead = function(initPosition) {
			$(".map").append(
					"<div class='grid head' data-position='" + initPosition
				+ "' data-cd=" + this.parts
				+ "></div>"
			);

			tempHeadPos = $(".head").attr("data-position").split(",");
			$(".head")
				.css("left"	, tempHeadPos[xAchse] * 10)
				.css("top"	, tempHeadPos[yAchse] * 10);
		}

		this.createHead(this.position);

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
				var map = document.getElementById("map");
				map.className += " failed";
				$(map).children().remove();
				clearInterval(myTimer);
			} else {
				if(newPos.join() == $('.apple').attr('data-position')) {
					this.parts++;
					// Body anstelle von alten Kopf
					$(".head").removeClass("head");
					// neuer Kopf anstelle von Apfel
					$(".apple").removeClass("apple").addClass("head").attr("data-cd", this.parts);
					// neuer Apfel
					myApple.setPosition();
					myApple.createApple();
				} else {
					// cd runter
					$("[data-cd]").each(
						function () {
							var tempCD = $(this).attr("data-cd");
							$(this).attr("data-cd", --tempCD);
						}
					);
					// alter Kopf zu Body
					$(".head").removeClass("head");
					// neuen Kopf erstellen
					this.createHead(newPos);
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

function setPositions() {
	$("[data-position]").each(function() {
		tempPos = $(this).attr("data-position").split(",");
		$(this)
			.css("left"	, tempPos[xAchse] * 10)
			.css("top"	, tempPos[yAchse] * 10);
	});
}

function main() {
	mySnake = new snake(10, [40,30]);
	myApple = new apple();

	setPositions();
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

main();
