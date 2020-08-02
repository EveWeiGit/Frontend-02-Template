

function getStyle(element) {
    if (!element.style)
        element.style = {}; // 用来存储最后计算出来的属性

    for(let prop in element.computedStyle) {
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if (element.style[prop].toString().match(/^[0-9\.]$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}


function layout(element) {
    if (!element.computedStyle) // 没有computedStyle的元素，就直接跳过去
        return ;
    
    var elementStyle = getStyle(element); // 对style进行预处理

    if (elementStyle.display !== 'flex')  // 不是flex就过滤掉
        return
    
    var items = element.children.filter(e => e.type === 'element'); // 只要元素节点，文本节点就过滤掉

    items.sort((a,b) => {
        return (a.order || 0) - (b.order || 0);
    });

    var style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') { // 如果是空的或者是auto就赋值为null，方便后面判断
            style[size] = null;
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row'; // 默认设置 style.flexDirection 是row

    if (!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch'; // 默认设置 style.alignItems 是stretch

    if (!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start'; // 默认设置 style.justifyContent 是flex-start

    if (!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap'; // 默认设置 style.flexWrap 是nowrap

    if (!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch'; // 默认设置 style.alignContent 是stretch

    var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;

    /**
     * flex-direction:row
     * Main: width x left right
     * Cross: height y top bottom
     */
    if (style.flexDirection === 'row') {  // 从左向右
        mainSize = 'width'; // 主轴的的尺寸用width
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1; // 正1，从左往右排列，所以是正1
        mainBase = 0;// 从最左边开始是初始值0

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    
    if (style.flexDirection === 'row-reverse') {  // 从右向左
        mainSize = 'width'; // 主轴的的尺寸用width
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1; // 负1，从右往左排列，所以是负1
        mainBase = style.width; //从最右边开始，所以等于style.width

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    /**
     * flex-direction:column
     * Main: height y top bottom
     * Cross: width x left right
     */
    if (style.flexDirection === 'column') {  // 从上到下
        mainSize = 'height'; // 主轴的的尺寸用height
        mainStart = 'top';
        mainEnd = 'bottm';
        mainSign = +1; // 正1，从上到下排列，所以是正1
        mainBase = 0; //从最右边开始，所以等于style.width

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {  // 从下到上
        mainSize = 'height'; // 主轴的的尺寸用height
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1; //  负1，从下到上排列，所以是 负1
        mainBase = style.height; //从最右边开始，所以等于style.height

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }


    if (style.flexWrap === 'wrap-reverse') { // 反向换行
        var tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = +1;
    }

    var isAutoMainSize = false; // 父元素没有设置主轴尺寸，子元素会自己撑开
    if (!style[mainSize]) { 
        elementStyle[mainSize] = 0; // 如果没有style[mainSize]，那就给elementStyle[mainSize]设置一开始等于0
        // 把所有子元素的mainSize加起来
        for (var i = 0; i< items.length; i++) {
            var item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }

    var flexLine = [];
    var flexLines = [flexLine];

    var mainSpace = elementStyle[mainSize]; // 剩余空间等于元素的父元素的mainSize
    var crossSpace = 0;

    for(var i = 0; i < items.length; i++) { // 循环所有的flexitem
        var item = items[i];
        var itemStyle = getStyle(item); // 把每个item的属性取出来

        if (itemStyle[mainSize] === null) { // 如果没有就设为0
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) { // 如果有flex属性，不是display：flex，说明此元素可伸缩
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // 如果是AuroMainSize，就直接
            mainSpace -= itemStyle[mainSize]; // 减去主轴空间
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) // 在nowrap的情况item交叉轴尺寸不等于null的话
               crossSpace  = Math.max(crossSpace, itemStyle[crossSize]); // 找出flex 的行高就是交叉轴尺寸最大的那个
        
            flexLine.push(item);
        } else {
            if (itemStyle[mainSize] > style[mainSize]) { // 比主轴尺寸大的就压到跟主轴尺寸一般大
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) { // 主轴剩下的空间不足以容纳每个元素了
                flexLine.mainSpace = mainSpace; // 旧的flexLine，主轴的剩余空间给存到这一行上
                flexLine.crossSpace = crossSpace; //旧的flexLine， 交叉轴的剩余空间给存到这一行上
                 // 然后创建一个新的flexLine，因为前一行已经放不下元素了
                flexLine = [item];
                flexLines.push(flexLine);
                // 这个时候重置一下mainSpace和crossSpace两个属性
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else { // 这里是放得下
                flexLine.push(item);
            }
            //  在wrap的情况不管怎么样都要计算一下交叉轴的尺寸
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

            mainSpace -= itemStyle[mainSize]; // 减去主轴空间
        }
    }
    flexLine.mainSpace = mainSpace; // 给最后一行的line加上space

    

    if (style.flexWrap === 'noWrap' || isAutoMainSize) { // 如果是nowrap就保存crossSpace
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) { // mainSpace < 0对所有元素进行等比压缩，根据主轴的size进行压缩
        var scale = style[mainSize] / (style[mainSize] - mainSpace); // 主轴除以主轴尺寸减去剩余空间表示期望的尺寸，相当于等比压缩
        var currentMain = mainBase;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            if (itemStyle.flex) { // flex 没有权利参加等比压缩的，所以它的尺寸是0 
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale; // 如果有主轴尺寸，就乘以scale

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLine.forEach(items => {
            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for(var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);
                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }
            if (flexTotal > 0) { // 有flex的元素
                var currentMain = mainBase;
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain, step;
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0; // 无间隔
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0; // 无间隔
                }
                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0; // 无间隔
                }
                if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                    currentMain = mainBase;
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    // itemStyle[mainStart] = currentMain;
                    itemStyle[mainStart, currentMain];
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }

            }
        })
    }

    var crossSpace;
    
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (var i = 0; i< flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (var i = 0; i< flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    var lineSize = style[crossSize] / flexLines.length; // 行数

    let step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step /2;
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }
    flexLines.forEach(items => {
        // 这一行的真实的交叉轴的尺寸
        var lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
        
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            var align = itemStyle.alignSelf || style.alignItems;

            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ?
                lineCrossSize : 0;
            }
            
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize);

                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }

        }
        crossBase += crossSign * (lineCrossSize + step);
    });
    console.log(items);

}

module.exports = layout;