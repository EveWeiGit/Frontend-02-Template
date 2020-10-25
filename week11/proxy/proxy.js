
    let callbacks = new Map()
    let Reactivties = new Map(); // 需要一个全局的表格来存储，每个对象去调用reactive的时候，会加一个缓存
let obj = {
    a:1,
    b:2
}
let useReactivties = [];
// let po = new Proxy(obj, {
//     set(o,prop){ // 钩子,修改Object属性的时候会触发
//         console.log(o,prop);
//     }
// })
// po.a = 33
    let po = reactive(obj)

    effect(() => {
        console.log(po.a)
    })



    function effect(callback) {
        // callbacks.push(callback);
        useReactivties = [];
        callback();
        console.log(useReactivties)
        for (let reactivty of useReactivties) {
            if (!callbacks.has(reactivty[0])) { // 如果没有的话
                callbacks.set(reactivty[0], new Map())
            }
            if (!callbacks.get(reactivty[0]).has(reactivty[1])) { // 如果没有的话
                callbacks.get(reactivty[0]).set(reactivty[1], [])
            }
            // 两级的索引上push callback
            callbacks.get(reactivty[0]).get(reactivty[1]).push(callback)
        }
    }

function reactive(obj) { // 代理obj

    if (Reactivties.has(obj)) {
        return Reactivties.get(obj)
    }

    let proxy =  new Proxy(obj, {
        set(o,prop, val){ // 钩子,修改Object属性的时候会触发
            o[prop] = val
            
            if(callbacks.get(o))
                if(callbacks.get(o).get(prop))
                    for (let callback of callbacks.get(o).get(prop)) {
                        callback();
                    }
            // console.log('set',o,prop, val);
        },
        get(o, prop) { // 在get里注册进useReactivties里面
            // console.log('get', o,prop);
            useReactivties.push([o, prop])
            if (typeof o[prop] === 'object') {
                return reactive(o[prop]);
            }
            return o[prop]
        }
    })
    Reactivties.set(obj, proxy);
    return proxy;
}

po.a.c = {o:0}
// console.log('>>>>', obj)