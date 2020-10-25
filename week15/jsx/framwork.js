// for(let i = 0; i < 10; i++) {
//     console.log(i);
// }


export function createElement(type,attributes, ...children) {
    console.log({type, children})
    let element;
    if (typeof type === 'string')
        element = new ElementWrapper(type);
    else
        element = new type;
    
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }

    let processChildren = childrens => {

        for (let child of childrens) {
            if ((typeof child === 'object') && (child instanceof Array)) {
                processChildren(child); // 如果是数组就递归的调用一下
                continue;
            }
            if (typeof child === 'string') {
                child = new TextWrapper(child);
            } 
           console.log({child});
           
            element.appendChild(child);
        }

    }
    processChildren(children);

    return element;
}

export const STATE  = Symbol('state');
export const ATTRIBUTES  = Symbol('attributes');

export class Component {
    constructor(type) {
        // this.root = this.render();
        this[ATTRIBUTES] = Object.create(null);
       this[STATE] = Object.create(null);
    }
    render() {
        return this.root;
    }
    setAttribute(name, value) {
        this[ATTRIBUTES][name] = value;
    }
    appendChild(child) {
        // this.root.appendChild(child);
        
        child.mountTo(this.root)
    }
    mountTo(parent) {
        if (!this.root) {
            this.render();
        }
        parent.appendChild(this.root)
    }
    triggerEvent(type, args) {
        // CustomEvent是浏览器的方法
        this[ATTRIBUTES][`on${type.replace(/^[\s\S]/, s => s.toUpperCase())}`](new CustomEvent(type,{detail:args}));
    }
   
}


class ElementWrapper extends Component {
    constructor(type) {
        super();
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name,value);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        super();
        this.root = document.createTextNode(content);
    }

}

