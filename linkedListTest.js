class linkedListNode{
    constructor(data){
        this.data = data;
        this.next = null;
    }
}

class linkedList{
    constructor(){
        this.start = new linkedListNode(null);
        this.end = this.start;
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
        this.end.next = new linkedListNode(data);
        this.end = this.end.next;
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
}
test = function(){
	var list = new linkedList();
	console.log("adding 1");
	list.add("1");
	console.log("list: " + list.toString());
	console.log("adding 2");
	list.add("2");
	console.log("list: " + list.toString());
	console.log("adding 3");
	list.add("3");
	console.log("list: " + list.toString());
	console.log("get(0),get(1),get(3)");
	console.log(list.get(0) + "," + list.get(1) + "," + list.get(2));
}
