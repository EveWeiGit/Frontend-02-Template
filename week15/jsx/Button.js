import {Component, STATE, ATTRIBUTES, createElement} from './framwork'
import {enableGesture} from './gesture'
// import {Timeline, Animation} from './animation'
// import {ease} from './ease'

export {STATE, ATTRIBUTES} from './framwork'; // 相当于import 后再export

export class Button extends Component{
    constructor(){
      super();
    }
    render() {
        this.childContainer = <span />;
        this.root = (<div >{this.childContainer}</div>).render();
        return this.root;
    }
    // 重载appendChild
    appendChild(child) {
        if (!this.childContainer) this.render();
        this.childContainer.appendChild(child);
    }
}