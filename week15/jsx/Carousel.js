import {Component, STATE, ATTRIBUTES} from './framwork'
import {enableGesture} from './gesture'
import {Timeline, Animation} from './animation'
import {ease} from './ease'

export {STATE, ATTRIBUTES} from './framwork'; // 相当于import 后再export

export class Carousel extends Component{
    constructor(){
      super();
  
      // this.attributes = Object.create(null);
    }
  
    // setAttribute(name, value){
    //   this.attributes[name] = value;
    // }
  
    // mountTo(parent){
    //   parent.appendChild(this.render());
    // }
  
    render(){
      this.root = document.createElement('div');
      this.root.classList.add('carousel');
  
      for(let attr of this[ATTRIBUTES].src){
        let child = document.createElement('div');
        child.style.backgroundImage = `url(${attr.img})`; 
        
        this.root.appendChild(child)
      }
      enableGesture(this.root);

      let timeline = new Timeline;

      timeline.start();

      let handler = null;

      let children = this.root.children;

      // let position = 0; // 代表组件当前的一个状态
      this[STATE].position = 0;

      let t = 0;

      let ax = 0; // 动画的x的偏移

      this.root.addEventListener("start", event => {
       timeline.pause();// start的时候要暂停
       clearInterval(handler); // 清除interval
       if (Date.now() - t < 1500) {
         let progress = (Date.now() - t) / 500;
         ax = ease(progress) * 500 - 500;
       } else {
         ax = 0;
       }
      })

    
      this.root.addEventListener("tap", event => {
        this.triggerEvent('click', {
          position:this[STATE].position,
          data:this[ATTRIBUTES].src[this[STATE].position],
        })

      })

    

      this.root.addEventListener("pan", event => {
        let x = event.clientX - event.startX - ax; 
          let current = this[STATE].position - ((x - x % 500) / 500); 
          for(let offset of [-1, 0, 1]){
            let pos = current + offset;
            pos = (pos % children.length + children.length) % children.length; 
  
            children[pos].style.transition = 'none'; 
            children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`; 
          }
      })



      this.root.addEventListener("end", event => {

        timeline.reset(); // 先重置时间线
        timeline.start(); // 再重新start

      handler = setInterval(nextPicture, 3000); // 3s一帧的动画


        let x = event.clientX - event.startX - ax; 
          let current = this[STATE].position - ((x - x % 500) / 500); 

          let direction = Math.round((x % 500) / 500); // -1,0,1 方向


          if (event.isFlick) {
            if (event.velocity < 0) {
              direction = Math.ceil((x % 500) / 500);
            } else {
              direction = Math.floor((x % 500) / 500);

            }
            // console.log(event.velocity);
            
          }

          for(let offset of [-1, 0, 1]){
            let pos = current + offset;
            pos = (pos % children.length + children.length) % children.length; 
  
            children[pos].style.transition = 'none'; 
            // children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`; 
            timeline.add(new Animation(children[pos].style,'transform',
                - pos * 500 + offset * 500 + x % 500, 
                - pos * 500 + offset * 500 + direction * 500,
                500, 0, ease, v => `translateX(${v}px)`));

          }

          this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
          this[STATE].position = (this[STATE].position % children.length + children.length) % children.length; 

        this.triggerEvent('change', {position:this[STATE].position})

      })
      let nextPicture = () => {
        let children = this.root.children;
        let nextIndex = (this[STATE].position + 1) % children.length;
        
        let current = children[this[STATE].position];
        let next = children[nextIndex];

        // next.style.transition = 'none';
        // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;

        t = Date.now(); // 动画开始的时间

        timeline.add(new Animation(current.style,'transform', - this[STATE].position * 500, -500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`));
        timeline.add(new Animation(next.style,'transform', 500 - nextIndex * 500, - nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));

        
        this[STATE].position = nextIndex;
        this.triggerEvent('change', {position:this[STATE].position})
        // setTimeout(() => {
        //   next.style.transition = '';
        //   current.style.transform = `translateX(${-100 - this[STATE].position * 100}%)`;  
        //   next.style.transform = `translateX(${- nextIndex * 100}%)`;  
          // this[STATE].position = nextIndex;
        // }, 16);
      }
      handler = setInterval(nextPicture, 3000);

      /*
      this.root.addEventListener('mousedown', (event) =>{
        let children = this.root.children;
        let startX = event.clientX;
        let move = event => {
          let x = event.clientX - startX; 
          let current = this[STATE].position - ((x - x % 500) / 500); 
          for(let offset of [-1, 0, 1]){
            let pos = current + offset;
            pos = (pos + children.length) % children.length; 
  
            children[pos].style.transition = 'none'; 
            children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`; 
          }
        }
  
        let up = event => {
          let x = event.clientX - startX;
          this[STATE].position = this[STATE].position - Math.round(x / 500); 
          for(let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]){
            let pos = this[STATE].position + offset;
            pos = (pos + children.length) % children.length;
  
            // console.log({pos});
            children[pos].style.transition = 'none';
            children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`; // -2000
          }
          document.removeEventListener('mouseup', up)
          document.removeEventListener('mousemove', move)
        }
  
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
      })
      */

      // let currentIndex = 0;
      // setInterval(() => {
      //   let children = this.root.children;
      //   let nextIndex = (currentIndex + 1) % children.length;
        
      //   let current = children[currentIndex];
      //   let next = children[nextIndex];
  
      //   next.style.transition = 'none';
      //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
  
  
      //   setTimeout(() => {
      //     next.style.transition = '';
      //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;  
      //     next.style.transform = `translateX(${- nextIndex * 100}%)`;  
      //     currentIndex = nextIndex;
      //   }, 16);
      // }, 3000);
      return this.root;
    }
  }
