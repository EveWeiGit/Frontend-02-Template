import {Component, createElement} from './framwork'

class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }
    setAttribute(name,value) {
        this.attributes[name] = value;
    }
    render() {
        // console.log('render')
        this.root = document.createElement("div")
        this.root.classList.add("carousel") // 根据carousel加css
        for(let record of this.attributes.src) {
            // let child = document.createElement('img'); // 点击移动的时候可以看到图片也悬浮移动
            // child.src = record;
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            // child.style.display = "none";
            this.root.appendChild(child);
        }


        let position = 0;
        this.root.addEventListener("mousedown", e => {
            // console.log("mousedown")
            let children = this.root.children;
            let startX = e.clientX;
            // let startY = e.clientY;
            let move = event => {
                let x = event.clientX - startX;
                let current = position - ((x - x % 500) / 500);

                for (let offset of [-1,0,1]) { // 当前屏幕的元素前一个后一个
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                }

                // for(let child of children) {
                //     child.style.transition = "none";
                //     child.style.transform = `translateX(${- position * 500 + x}px)`
                // }
                
            }
            let up = event => {
                let x = event.clientX - startX;
                position = position + Math.random(x / 500);
                // for(let child of children) {
                //     child.style.transition = "";
                //     child.style.transform = `translateX(${- position * 500}px)`
                // }
                for (let offset of [0, - Math.sign(Math.random(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
                }
                this.root.removeEventListener("mousemove", move)
                this.root.removeEventListener("mouseup", up)
            }

            this.root.addEventListener("mousemove", move)
            this.root.addEventListener("mouseup", up)
        })
        


        // 自动轮播
        // let currentIndex = 0;
        // setInterval(() => {
        //    let children = this.root.children;
        // let nextIndex = (currentIndex + 1) % children.length; // 数学小技巧
      

        // let current = children[currentIndex]
        // let next = children[nextIndex]

        // next.style.transition = "none"
        // next.style.transform = `translateX(-${100 - nextIndex * 100}%)`

        // setTimeout(() => {
        //     next.style.transition = ""
        //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        //     next.style.transform = `translateX(${- nextIndex * 100}%)`;

        //     currentIndex = nextIndex
        // }, 16)
        // },3000)



        return this.root;
    }
    mountTo(parent){
     
        parent.appendChild(this.render());
    }
}


let img = [
    './img/img1.jpeg',
    './img/img2.jpeg',
    './img/img3.jpeg',
    './img/img4.jpeg',
]

// document.body.appendChild(a);
let a = <Carousel src={img} />
a.mountTo(document.body);
