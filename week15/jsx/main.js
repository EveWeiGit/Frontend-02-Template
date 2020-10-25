import {createElement} from './framwork'
// import {Carousel} from './Carousel'
import {List} from './List'
// import {Timeline, Animation} from './animation'




// let img = [
//     './img/img1.jpeg',
//     './img/img2.jpeg',
//     './img/img3.jpeg',
//     './img/img4.jpeg',
// ]
let list = [
    {
        img:'./img/img1.jpeg',
        url:'http://localhost:8080/',
        title:'标题1'
    },
    {
        img:'./img/img2.jpeg',
        url:'http://localhost:8080/',
        title:'标题2'
    },
    {
        img:'./img/img3.jpeg',
        url:'http://localhost:8080/',
        title:'标题3'
    },
    {
        img:'./img/img4.jpeg',
        url:'http://localhost:8080/',
        title:'标题4'
    },
]

// 模板型的children
let a = <List data={list}>
    {
        rr => 
            <div>
                <img src={rr.img} />
                <a href={rr.url}>{rr.title}</a>
            </div>
        
    }
</List>
a.mountTo(document.body);


