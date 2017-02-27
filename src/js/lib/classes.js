class GridElement {

	set position(val) {}
	get position() {return this._position}

	set className(val) {}
	get className() {return this._className}

	constructor(position, className) {
		this._position = position,
		this._className = className,

		this.viewAssign();
	}

	viewAssign() {
		var left = this.position[0], top = this.position[1];

		$("<div></div>", {
			class: "grid " + this.className,
			"data-position": left + "," + top
		})
		.css({ left: left * 10, top: top * 10})
		.appendTo(".map");
	}

}

class SnakePart extends GridElement {

	set countdown(val) {}
	get countdown() {return this._countdown;}

	constructor(position, className, id, countdown) {
		super(position, className, id);
		this._countdown = countdown;
	}

	removeElement() {
		$("[data-position = '" + this.position.join(",") + "']").remove();
		this.position = null;
		this.className = null;

	}

	reduceCd() {if(--this.countdown === 0) this.viewDeassign();}

}

class Snake {

	set positionHead(val) {}
	get positionHead() { return this._positionHead }

	set parts(val) {}
	get parts() { return this._parts }

	set direction(val) {}
	get direction() { return this._direction }

	constructor(position = [40,30]) {
		var head = {
			position: position,
			className: "head",
			countdown: 1
		};

		this._parts = [new SnakePart(
			head["position"],
			head["className"],
			head["id"],
			head["countdown"]
		)];
		this._head = this.parts[this.parts.length - 1];
		this._direction = "right";
	}

	turn(direction) {
		if(
			(this.direction === "up"	&& direction !== "down"	) ||
			(this.direction === "down"	&& direction !== "up"	) ||
			(this.direction === "left"	&& direction !== "right") ||
			(this.direction === "right"	&& direction !== "left"	)
		) {
			this.direction = direction;
		}
	}

	getNewPosition() {
		let newPosition = this.head.position;
		switch(this.direction) {
			case "up"   : newPosition[1]--; break;
			case "down" : newPosition[1]++; break;
			case "left" : newPosition[0]--; break;
			case "right": newPosition[0]++; break;
		}
		return newPosition;
	}

	getClassOfPosition(pos) {
		var ret = false,
			jqueryObject = $.extend({},$("[data-position = '" + pos.join(",") + "']"));
		if (jqueryObject.length)
			ret = jqueryObject.attr("class").split(" ")[1];
		return ret;
	}

	move(direction) {
		var newPosition,
			classNewOfPosition,
			ret=true;

		this.turn(direction);

		newPosition = getNewPosition();
		classOfNewPosition = this.getClassOfPosition(newPosition);

		switch(classOfNewPosition) {
			case false:
				break;
			case "apple":
				addPart();
				// Increase size
				break;
			case "barrier":
			case "head":
			case "body":
				ret = false;
				break;
		}

	}

	addPart(newPosition, id, increase) {
		var head = {
			position: newPosition,
			className: "head"
		};

		if (inc) {

		} else {

		}
	}


}

class Apple extends GridElement {

	constructor(position, id) {
		super(position, "apple", id);
	}

}

class Barrier extends GridElement {

	constructor(position, id) {
		super(position, "barrier", id);
	}

}

// class Queue {
//
// 	set queue(val) {}
// 	get queue() { return this._parts }
//
// 	set offset(val) {}
// 	get offset() { return this._direction }
//
// 	constructor() {
// 		this._queue  = [];
// 		this._offset = 0;
// 	}
//
// 	getLength(){return (this.queue.length - this.offset);}
//
// 	isEmpty(){return (this.queue.length == 0);}
//
// 	peek(){return (queue.length > 0 ? this.queue[this.offset] : undefined);}
//
// 	enqueue(item){this.queue.push(item);}
//
// 	dequeue(){
// 		if (this.queue.length == 0) return undefined;
// 		var item = this.queue[this.offset];
// 		if (++ this.offset * 2 >= this.queue.length){
// 			this.queue  = this.queue.slice(this.offset);
// 			this.offset = 0;
// 		}
// 		return item;
// 	}
//
// }

class Queue extends Array {
	get isEmpty(){return (this.length==0)}
	dequeue() {return this.pop()}
	enqueue(item) {this.unshift(item)}
}

class Game {

	constructor() {
		this.queue = new Queue();
		this.queue.enqueue(new SnakePart([30,30],"head"));
		console.log();
		// this.snakes = [];
		//
		// this.audio = [];
		// this.audio["eat"] = document.createElement('audio');
		// this.audio["move"] = document.createElement('audio');
		//
		// this.audio["eat"].setAttribute('src', 'audio/eat.mp3');
		// this.audio["move"].setAttribute('src', 'audio/move.mp3');
		//
		// this.timer = setInterval(function() {});
	}

}
