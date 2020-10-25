import {Component, createElement} from './framwork'
import {Carousel} from './carousel'
import {Timeline, Animation} from './animation'




let img = [
    './img/img1.jpeg',
    './img/img2.jpeg',
    './img/img3.jpeg',
    './img/img4.jpeg',
]

// document.body.appendChild(a);
let a = <Carousel src={img} />
a.mountTo(document.body);

let tl = new Timeline();
window.tl = tl;
window.animation = new Animation({set a(v) {console.log(v);
}}, "a", 0, 100, 1000, null);


tl.start();

