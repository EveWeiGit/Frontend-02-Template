function find(source, pattern) {
    let starCount = 0;
    for (let i = 0; i < pattern.length; i++) { // 把*号找出，看有几个
        if (pattern[i] === '*') {
            starCount ++;
        }
    }
    // 没有*的情况
    if (starCount ===  0) {
        for (let i = 0; i < pattern.length; i++) { // 
            if (pattern[i] !== source[i] && pattern[i] !== "?") {
               return false;
            }
        }
        return;
    }
    // 处理第一个*前面的部分
    let i = 0; // pattern的位置
    let lastIndex = 0; // source的位置
    // 把第一个*之前的部分匹配完
    for(i = 0; pattern[i] !== "*"; i++) {
        if (pattern[i] !== source[i] && pattern[i] !== "?") {
            return false;
         }
    }
    
    lastIndex = i; // 更新lastIndex

    // 从0到最后一个*之前的部分
    for (let p = 0; p < starCount - 1; p++) {
        i++;
        let subPattern = ""; // *后面的格式
        while(pattern[i] !== "*") {
            subPattern += pattern[i];
            i++;
        }
        let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), "g"); // 把subPattern里面的？替换成正则表达式的语法，任意字符
        reg.lastIndex = lastIndex;
        // console.log(reg.exec(source));
        if (!reg.exec(source)) return false;
        lastIndex = reg.lastIndex;
    }
    // 最后一个*后面的部分，从后往前进行匹配
    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
        if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== "?") {
            return false;
        }
    }
    return true;
}

console.log(find("abcabcabxaac", "a*b*bx*c"))
// console.log(find("abcabcabxaac", "a*b?*b?x*c"))