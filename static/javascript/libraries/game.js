var container = document.createElement('div');
document.body.appendChild(container);
var fruits = new entityManager(container);

var updateMouse = function(event){
	pMouseX = mouseX;
	pMouseY = mouseY;
	mouseX = event.clientX / rMultiplier;
	mouseY = event.clientY / rMultiplier;
	mappedFrame = fruits.frameNumber;
}
mainEventManager = fruits;
document.addEventListener("mousemove", updateMouse);
var allTheButtons = new buttons();
allTheButtons.elements[0].addEventListener("click", allTheButtons.displayPause);
allTheButtons.elements[1].addEventListener("click", allTheButtons.exitFunction);
fruits.spawn(allTheButtons);
fruits.spawn(new fruitSpawner(stuff));
fruits.start();
