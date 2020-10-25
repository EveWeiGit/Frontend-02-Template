import {Component, STATE, ATTRIBUTES, createElement} from './framwork'
import {enableGesture} from './gesture'
// import {Timeline, Animation} from './animation'
// import {ease} from './ease'

export {STATE, ATTRIBUTES} from './framwork'; // 相当于import 后再export

export class List extends Component{
    constructor(){
      super();
    }
    render() {
        
        this.childern = this[ATTRIBUTES].data.map(this.template);
        this.root = (<div >{this.childern}</div>).render();
        return this.root;
    }
    // 重载appendChild
    appendChild(child) {
        this.template = (child);
        // this.render();
    }
}