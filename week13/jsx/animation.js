
const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATION = Symbol('animation');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');
const CURRENT_TIME = Symbol('current-time');

export class Timeline{
    constructor(){
        this.state = "Inited";
        this[ANIMATION] = new Set();
        this[START_TIME] = new Map();
    }
    start(){
        if (this.state !== "Inited") {
            return;
        }
        this.state = "started";
        this[CURRENT_TIME] = Date.now();
        this[PAUSE_TIME] = 0; // 暂停时间一开始是0
        this[TICK] = () => {
            // console.log("tick");
            let now = Date.now();
            for (let animation of this[ANIMATION]) {
                // console.log({animation});
                let t;

                if (this[START_TIME].get(animation) <  this[CURRENT_TIME] ) {
                    t = now  - this[CURRENT_TIME]  - this[PAUSE_TIME]  - animation.delay; // 为了实现延迟效果，要减去delay的时间
                } else {
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
                }
                
                if (animation.duration < t){
                    this[ANIMATION].delete(animation)
                    t = animation.duration
                }
                if (t > 0) // t是负的，说明动画还未开始
                    animation.receiveTime(t)
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    // 播放速率
    // set rate(){}
    // get rate(){}

    // 暂停
    pause(){
        if (this.state !== "started") {
            return;
        }
        this.state = "paused";
        this[PAUSE_START] = Date.now(); // 把暂停开始的时间和暂停截止的时间保存下来
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    // 恢复
    resume(){
        if (this.state !== "paused") {
            return;
        }
        this.state = "started";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]; // 暂停的时间
        this[TICK]();
    }
    // 重置
    reset(){
        this.pause();
        this.state = "Inited";
        this[CURRENT_TIME] = Date.now();
        this[PAUSE_TIME] = 0;
        this[ANIMATION] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;
        this[PAUSE_START] = 0;
    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATION].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    
    constructor(object,property,startValue,endValue,duration,delay,timingFunction,template) {
        timingFunction = timingFunction || (v => v)
        template = template || (v => v)

        this.object = object; // 对象
        this.property = property; // 属性
        this.startValue = startValue; // 开始值
        this.endValue = endValue;   // 结束值
        this.duration = duration; // 持续时间
        this.delay = delay; // 延迟时间
        this.timingFunction = timingFunction; // 返回0~1的函数
        this.template = template;
    }
    receiveTime(time) {
        // console.log({time});
        
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time / this.duration); // 进展

        this.object[this.property] = this.template(this.startValue + range * progress) // 开始值加上变化之后的值
    }

}