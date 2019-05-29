class linkedListNode{
    constructor(data){
        this.data = data;
        this.next = null;
    }
};

class linkedList{
    constructor(){
        this.start = new linkedListNode(null);
        this.length = 0;
		this.current = this.start;
		this.currentBack = null;
    }
    get(index){//this function is not really needed but is included just in case
        var i;
        var node = this.start;
        for(i = -1; i < index; i++){
            node = node.next;
        }
		return node.data;
    }
    add(data){
        var n = this.start.next;
        this.start.next = new linkedListNode(data);
        this.start.next.next = n;
        this.length++;
    }
	//built in iterator
    startIterator(){//sets current to start, used at the beginning of every frame
        this.current = this.start;
        this.currentBack = null;
    }
    hasNext(){
        return !(this.current.next == null);
    }
    next(){
        this.currentBack = this.current;
        this.current = this.current.next;
        return this.current.data;
    }
    remove(){//removes current
        this.currentBack.next = this.current.next;
		this.current = this.currentBack;
        this.length--;
    }
	toString(){//DO NOT USE THIS WHEN USING THE ITERATOR, IT WILL MESS IT UP
		var str = "";
		this.startIterator();
		while(this.hasNext()){
			str += this.next() + " ";
		}
		this.startIterator();
		return str;
	}
};
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
//requires core.js

class rect extends entity{
	constructor(xcor,ycor,height,width,color){
		super();
		this.elements.push(document.createElement('div'));
		var e = this.elements[0];
		var grav = 4;
		this.xcor = Math.floor(Math.random() * (boxWidth-100))+50;
		this.ycor = boxHeight;
		this.xvel = Math.floor(Math.random() * 5);
		this.yvel = -40;
		e.style.left = xcor + 'px';
		e.style.top = ycor + 'px';
		e.style.height = height + 'px';
		e.style.width = width + 'px';
		e.style.background = color;
		e.style.position = 'absolute';
		this.lifespan = 600;
	}
	update(){
		x = velx * time;
		y = vely*time + 0.5*grav*time*time;
		return this.lifespan-- <= 0;
	}
	display(){
		this.elements[0].style.left = this.xcor + 'px';
		this.elements[0].style.top = this.ycor + 'px';
	}
}

var container = document.createElement('div');
container.style.position = "relative";
container.style.width = "100%";
container.style.backgroundimage = "../images/background.jpg";
document.body.appendChild(container);

var em = new entityManager(container);
em.spawn(new rect(0,0,100,100,'red'));
em.start();
