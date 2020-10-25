
        function kmp(source, pattern) {
            // 计算跳转表格
            let table = new Array(pattern.length).fill(0);
            {
                let i = 1, j = 0;
    
                while(i < pattern.length) {
                    if (pattern[i] === pattern[j]){ // 开始模板串的第0个和第1个看能否匹配
                        ++j, ++i;
                        table[i] = j;
                    } else {
                        if (j > 0) {
                            j = table[j];
                        } else {
                            ++i;
                        }
                    }
                }
            }
            // console.log(table)
            // 匹配
            {
                let i = 0, j = 0; // i 是source串的位置，j是pattern串的位置
                while(i < source.length) {
                    
                    if (pattern[j] === source[i]){ // 
                        ++j, ++i;
                        // table[i] = j;
                    } else {
                        if (j > 0) {
                            j = table[j];
                        } else {
                            ++i;
                        }
                    }
                    if (j === pattern.length) return true;
                }
                return false
            }
        }
        // abcdabce
        // abababc
        // aabaaac
        // console.log(kmp("Hello", "ll"));
        // console.log(kmp("abcdabcdabcex", "abcdabce"));
        console.log(kmp("a", "a"));
