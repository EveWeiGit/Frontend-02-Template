
// let element = document.documentElement;




// 抽象出几个事件，不需要特地对鼠标事件和手势事件进行操作
// let handler;
// let startX,startY;
// let isPan = false; // 是否移动
// let isTap = true; // 是否点击
// let isPress = false; // 是否按压


export class Dispatcher{
    constructor(element){
        this.element = element
    }
    dispatch (type, properties) {
        let event = new Event(type);
        console.log(event);
        for(let name in properties) {
            event[name] =  properties[name];
        }
        this.element.dispatchEvent(event)
    }
}



export class Listener {
    constructor(element, recognizer) {
        let isListeninMouse = false;
        let contexts = new Map();
        element.addEventListener("mousedown", event => { // mousedown的event.button有12345的值，表示按下哪个键
            // console.log('event.button', event.button);
            let context = Object.create(null)
            contexts.set(`mouse${1 << event.button}`, context)
            // console.log('start',1 << event.button);
            
            recognizer.start(event, context)
            let mousemove = event => { // event.buttons表示哪个键被按下
                // console.log(event.clientX, event.clientY);
                let button = 1;
                while(button <= event.buttons) {
                    if (button && event.buttons) { // 掩码
                        let key;
                        // 把中键和右键的顺序调整正确
                        if (button === 2)
                            key = 4;
                        else if (button === 4)
                            key = 2;
                        else
                            key = button;
                        
                        let context = contexts.get(`mouse${key}`)
                     //    console.log('move',button);
                        
                     recognizer.move(event, context)
                    }
                    button = button << 1
                }
        
            }
            let mouseup = event => {
                let context = contexts.get(`mouse${1 << event.button}`)
                recognizer.end(event, context)
                contexts.delete(`mouse${1 << event.button}`)
        
                if (event.buttons === 0) {
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    isListeninMouse = false;
        
                }
            }
            // 如果没有在监听的话
            if (!isListeninMouse) {
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
                isListeninMouse = true;
            }
        })

        element.addEventListener("touchstart", event => {
            // console.log(event.changedTouches);
            for (let touch of event.changedTouches) {
                // console.log(touch.clientX, touch.clientY);
                let context = Object.create(null)
                contexts.set(touch.identifier, context)
                recognizer.start(touch, context)
            }
            
        })
        element.addEventListener("touchmove", event => {
            // console.log(event.changedTouches);
            for (let touch of event.changedTouches) {
                // console.log(touch.clientX, touch.clientY);
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context)
            }
        })
        element.addEventListener("touchend", event => {
            // console.log(event.changedTouches);
            for (let touch of event.changedTouches) {
                // console.log(touch.clientX, touch.clientY);
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context)
                contexts.delete(touch.identifier); // 删除
            }
        })
        element.addEventListener("touchcancel", event => {
            // console.log(event.changedTouches);
            for (let touch of event.changedTouches) {
                // console.log('cancel', touch.clientX, touch.clientY);
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context)
                contexts.delete(touch.identifier); // 删除
        
            }
        })
        
    }
}
export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
    start(point, context){
        // console.log('start', point.clientX, point.clientY);
        context.startX = point.clientX, context.startY = point.clientY; // 用逗号表示这两句的关系紧密
        context.points = [{
            t:Date.now(),
            x:point.clientX,
            y:point.clientY,
        }]
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
    
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null; // 避免多次调用clear
            // console.log("press");
            this.dispatcher.dispatch("press", {})
            
        }, 500)
    }

    move(point,context) { // 看有没有移动10px
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if (!context.isPan && (((dx ** 2) + (dy ** 2)) > 100)) { // 看距离是否大于10px，但是开根号计算较慢，所以直接大于100
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            // console.log('pan start');
            context.isVertical = Math.abs(dx < dy)
            this.dispatcher.dispatch("pan start", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY,
                isVertical:context.isVertical,
            })
            clearTimeout(context.handler);
        }
        if (context.isPan) {
            // console.log(dx,dy);
            
            // console.log('pan');
            this.dispatcher.dispatch("pan", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY,
            })
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500) // 只存取半秒内的时间的点
        // 每次move的时候push一个新的的点
        context.points.push({
            t:Date.now(),
            x:point.clientX,
            y:point.clientY,
        });
    }
    end(point, context) {
        // console.log('end', point.clientX, point.clientY);
        if (context.isTap) {
            // console.log('tap');
            this.dispatcher.dispatch('tap', {})
            clearTimeout(context.handler); // 不清除会立即触发
        }
        
        if (context.isPress) {
            this.dispatcher.dispatch('press end', {})
            // console.log('press end');
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500) // 只存取半秒内的时间的点
        let d,v;
        if (!context.points.length) {
            v = 0
        } else {
            // 计算距离
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
            v = d / (Date.now() - context.points[0].t)
        }
        if (v > 1.5) {
            context.isFlick = true;
            // console.log("flick");
            this.dispatcher.dispatch("flick", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY,
                isVertical:context.isVertical,
                isFlick:context.isFlick,
                velocity:v, // 速度
            })
        } else {
            context.isFlick = false;
        }

        if (context.isPan) {
            // console.log('pan end');
            this.dispatcher.dispatch("pan end", {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY,
                isVertical:context.isVertical,
                isFlick:context.isFlick
            })
        }
        // console.log('vvvvvvvvvvvvvvvv',v);
        
    }
    cancel (point, context){
        clearTimeout(context.handler); 
        this.dispatcher.dispatch("cancel", {})
        // console.log('cancel', point.clientX, point.clientY);
    
    }


}
export const enableGesture = element => {
    new Listener(element, new Recognizer(new Dispatcher(element)))
}