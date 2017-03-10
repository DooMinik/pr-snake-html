var idCounter = 0;

var game = new Game();

var timer = setInterval(function() {
	if(!game.pause){
		status = game.update();
		switch(status) {
			case "nothing":
				//game.play("move");
				break;
			case "apple":
			case "grape":
			case "cherry":
				//game.play("eat");
				break;
			case "over":
				clearInterval(timer);
				game.gameOver();
				break;
		}
	}
}, 0.1 * 1000);
