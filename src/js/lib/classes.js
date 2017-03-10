class GridElement {

	set id(val) {}
	get id() {return this._id}

	set position(val) {
		this._position = val;
		let positionString = val.join(",");
		$("#"+this.id)
			.attr("data-position", positionString)
			.css({left:val[0] * 10, top:val[1] * 10});
	}
	get position() {return this._position}

	set className(val) {
		this._className = val;
		$("#"+this.id).attr("class", val);
	}
	get className() {return this._className}

	constructor(position, className) {
		$("<div></div>", { id: idCounter }).appendTo("#map");

		this._id = idCounter++;
		this.position = position;
		this.className = className;
	}

}

class MapObject extends GridElement {
	relocate() {
		let position = {x:-10, y:-10};
		while($("[data-position = '" + position.x + "," + position.y + "']").length) {
			position.x = Math.floor( Math.random() * 60 );
			position.y = Math.floor( Math.random() * 60 );
		}
		this.position = [position.x, position.y];
	}

	constructor(className) {
		super([-10,-10], className);
		this.relocate();
	}
}

class Apple   extends MapObject { constructor() { super("apple")   } }
class Grape   extends MapObject { constructor() { super("grape")   } }
class Cherry  extends MapObject { constructor() { super("cherry")  } }
class Barrier extends MapObject { constructor() { super("barrier") } }

class SnakePart extends GridElement {
	constructor(position, name) {
		super(position, "head");
		$("#"+this.id).attr('data-name',name);
	}
	removeElement() { $("#"+this.id).remove(); }
}

class Snake {

	set name(val) {this._name = val}
	get name() { return this._name }

	set queue(val) {this._queue = val}
	get queue() { return this._queue }

	set direction(val) {this._direction = val}
	get direction() { return this._direction }

	set grow(val) { this._grow = val = val }
	get grow() { return this._grow }

	turn() {
		if(
			(this.direction.present === "up"	&& this.direction.new !== "down" ) ||
			(this.direction.present === "down"	&& this.direction.new !== "up"	 ) ||
			(this.direction.present === "left"	&& this.direction.new !== "right") ||
			(this.direction.present === "right"	&& this.direction.new !== "left" ) ||
			(this.direction.present === undefined)
		)
			this.direction.present = this.direction.new;
	}

	getNewPosition() {
		let newPosition = this.queue[0].position;
		switch(this.direction.present) {
			case "up"   : newPosition[1]--; break;
			case "down" : newPosition[1]++; break;
			case "left" : newPosition[0]--; break;
			case "right": newPosition[0]++; break;
		}
		return newPosition;
	}

	getClassOfPosition(pos) {
		let ret,
			obj = $("[data-position = '" + pos.join(",") + "']");

		obj.length ? ret = obj.attr("class") : ret = false;
		return ret;
	}

	addPart(newPosition) {
		$(".head").attr("class", "body");
		this.queue.enqueue( new SnakePart(newPosition, this.name) );
	}

	removePart() {
		var grow = this.grow;
		this.grow === 0 ?
			this.queue.dequeue().removeElement() :
			this.decreaseGrowth();
	}

	decreaseGrowth() {this.grow--}

	constructor(name, position = [20,30]) {
		this.name = name;
		this.grow = 1;
		this.queue = new Queue();
		this.direction = {present: undefined, new: 'right'};

		this.addPart(position);
	}

}

class Queue extends Array {
	get isEmpty(){return (this.length==0)}
	dequeue() {return this.pop()}
	enqueue(item) {this.unshift(item)}
}

class Game {
	set pause(val){ this._pause = val }
	get pause(){return this._pause}

	set snakes(val){ this._snakes = val }
	get snakes(){return this._snakes}

	set mapObjects(val){ this._mapObjects = val }
	get mapObjects(){return this._mapObjects}

	play(file) { $("audio#"+file)[0].play(); }

	loadAudio() {
		$.each(["eat","move"],function(i, val) {
			let file = 'audio/' + val + '.mp3';
			$('<audio/>', {id: val, src: file}).appendTo('#game');
		});
	}

	update() {

		var ret = {};

		for (let curSnake in this.snakes) {

			this.snakes[curSnake].turn();

			let newPosition = this.snakes[curSnake].getNewPosition(),
				classOfNewPosition = this.snakes[curSnake].getClassOfPosition(newPosition);

			ret[curSnake] = "nothing";

			if(
				newPosition[0] <  0 ||
				newPosition[1] <  0 ||
				newPosition[0] > 59 ||
				newPosition[1] > 59
			) {
				ret = "over";
			}

			switch(classOfNewPosition) {

					case "cherry":
						this.snakes[curSnake].grow++;
					case "grape":
						this.snakes[curSnake].grow++;
					case "apple":
						this.snakes[curSnake].grow++;
						ret = classOfNewPosition;
						for(var cnt=0; cnt < this.mapObjects.length; cnt++) {
							let pos1 = this.mapObjects[cnt].position,
								pos2 = newPosition;
							if (JSON.stringify(pos1) === JSON.stringify(pos2)) {
								this.mapObjects[cnt].relocate();
								break;
							}
						}
					case false:
						this.snakes[curSnake].addPart(newPosition);
						this.snakes[curSnake].removePart();
						break;
					case "barrier":
					case "head":
					case "body":
						ret = "over";
						break;
			}
		}

		console.log(ret);
		return ret;
	}

	generateMap() {
		$('<div></div>',{id:'game'}).appendTo('body');
		$('<div></div>',{id:'map'}).appendTo('#game');
		this.mapObjects = [];
		this.snakes = [];
		this.snakes.push(new Snake('snake-1',[20,30]));
		// this.snakes.push(new Snake('snake-2',[40,30]));
		this.generateMapObjects();
	}

	generateMapObjects() {
		let cnt = {
			apple: Math.round(Math.random() * 3) + 1,
			grape: Math.round(Math.random() * 2) + 1,
			cherry: Math.round(Math.random() * 1) + 1,
			barrier: Math.round(Math.random() * 5) + 8
		}

		for(var iapple = 0;   iapple   < cnt.apple;   iapple++)   this.mapObjects.push(new Apple());
		for(var igrape = 0;   igrape   < cnt.grape;   igrape++)   this.mapObjects.push(new Grape());
		for(var icherry = 0;  icherry  < cnt.cherry;  icherry++)  this.mapObjects.push(new Cherry());
		for(var ibarrier = 0; ibarrier < cnt.barrier; ibarrier++) this.mapObjects.push(new Barrier());
	}

	gameOver() { $("#map").addClass("failed").children().remove() }

	constructor() {
		this.pause = true;
		this.generateMap();
		this.generateMapObjects();
		this.loadAudio();

		document.addEventListener("keyup", (event) => {
			const keyName = event.key;

			this.direction = function(a,b) {this.snakes[a].direction.new = b};

			switch (keyName) {
				case "ArrowLeft":  this.direction(0, "left");  break;
				case "ArrowUp":    this.direction(0, "up");    break;
				case "ArrowRight": this.direction(0, "right"); break;
				case "ArrowDown":  this.direction(0, "down");  break;
			}

			switch (keyName) {
				case "w": this.direction(1, "up");    break;
				case "a": this.direction(1, "left");  break;
				case "s": this.direction(1, "down");  break;
				case "d": this.direction(1, "right"); break;
			}

			switch (keyName) {
				case " ":
				case "p":
					game.pause ? game.pause = false : game.pause = true;
			}
		}, false);

	}

}
