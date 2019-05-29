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
