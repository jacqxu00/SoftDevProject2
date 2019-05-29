//requires linkedList.js

class entity{
	constructor(){
		this.owner = null;
		this.elements = []; //an array of html elements to be added to the DOM
	}
	update(){} //returns true if dead, false otherwise
	display(){}
	addToDOM(){
		var i;
		for(i = 0; i < this.elements.length; i++){
			this.owner.addElement(this.elements[i]);
		}
	} //adds the html elements to the DOM
	removeFromDOM(){
		var i;
		for(i = 0; i < this.elements.length; i++){
			this.owner.removeElement(this.elements[i]);
		}
	}
};
var boxHeight = 1200;
var boxWidth = 1920;
var rescaleMultiplier = function(){
	var width = document.body.clientWidth || window.innerWidth || window.innerWidth;
	return document.body.clientWidth / boxWidth;
}
var rMultiplier = rescaleMultiplier();
var mappedFrame = 0;
var mouseX = 0;
var mouseY = 0;
var pMouseX = 0;
var pMouseY = 0;
var velocity = 0;

var lives = 3;
var score = 0;
var comboMeter = 0;
var firstComboFrame = 0;

class placeHolder extends entity{
	update(){
		if(firstComboFrame-- <= 0){
			comboMeter = 0;
			firstComboFrame = 60 * 3;
		}
		rMultiplier = rescaleMultiplier();
		if(this.owner.frameNumber - mappedFrame >= 30){
			velocity = 0;
		}
		else{
			velocity = Math.sqrt(Math.pow(mouseX - pMouseX,2) + Math.pow(mouseY - pMouseY,2));
		}
		return false;
	}
};
class entityManager{//only one entityManager is supported with mouse
	constructor(div){
		this.entities = new linkedList();
		this.running = false;
		this.div = div;
	    this.entities.startIterator();
	    var p = new placeHolder();
	    p.owner = this;
	    this.entities.add(p);
		this.frameNumber = 0;
	}
	setDiv(d){
		this.div = d;
	}
	start(){
		this.running = true;
		this.interval  = setInterval(this.frame.bind(this),16);

	}
	frame(){
		if(this.running){
			while(this.entities.hasNext()){
				var x = this.entities.next();
				if(x.update()){
					x.removeFromDOM();
					this.entities.remove();
				}
				else{
					x.display();
				}
			}
			this.entities.startIterator();
			document.getElementById("lives").innerHTML = 'Lives: '+lives;
			document.getElementById("score").innerHTML = 'Score: '+score;
			this.frameNumber++;
		}
		else{
			clearInterval(this.interval);
		}
	}
	stop(){
		this.running = false;
	}
	spawn(x){ //requires an entity
		x.owner = this;
		x.addToDOM();
		this.entities.add(x);
	}
	addElement(x){ //requires an html element
		this.div.appendChild(x);
	}
	removeElement(x){
		this.div.removeChild(x);
	}
};
