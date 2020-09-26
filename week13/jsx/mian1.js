// for(let i = 0; i < 10; i++) {
//     console.log(i);
// }

function createElement(type,attributes, ...children) {
    let element;
    if (typeof type === 'string')
        element = new ElementWrapper(type);
    else
        element = new type;
    
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    for (child of children) {
        if (typeof child === 'string') {
            child = new TextWrapper(child);
        } 
        element.appendChild(child);
    }
    return element;
}

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(child) {
        // this.root.appendChild(child);
        child.mountTo(this.root)
    }
    mountTo(parent) {
        
        parent.appendChild(this.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(child) {
        // this.root.appendChild(child);
        child.mountTo(this.root)
    }
    mountTo(parent) {
        
        parent.appendChild(this.root)
    }
}

// let a = <div id="a" >
//     <span>11</span>
//     <span></span>
//     <span></span>
// </div>

class Div {
    constructor() {
        this.root = document.createElement("div");
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(child) {
        child.mountTo(this.root)
    }
    mountTo(parent) {
        
        parent.appendChild(this.root)
    }
}

let a = <Div id="a" >
    <span>11</span>
    <span>222</span>
    <span></span>
</Div>

// document.body.appendChild(a);

a.mountTo(document.body);// 反向操作
