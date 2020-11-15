学习笔记

- 打开隐藏文件

```
open ./.git
```
- hooks文件
hooks里面文件都是以.sample结尾表示不会实际执行，只要把.sample去掉就会变成可执行

- 对客户端有用的hooks
    * pre-commit
    * pre-push

- 添加执行权限
```
  chmod +x ./pre-commit
```

- 拦截git提交
```
#!/usr/bin/env node

let process = require("process");

console.log("hello hooks")

process.exitCode = 1;
```

- git 提交添加eslint
```
#!/usr/bin/env node

let process = require("process");
let child_process = require("child_process");

function exec(name) {
    return new Promise((resolve,reject) => {
        child_process.exec(name,resolve);
    })
}

const { ESLint } = require("eslint");

(async function main() {
  // 1. Create an instance.
  const eslint = new ESLint({fix:false});

await exec("git stash push -k");

  // 2. Lint files.
  const results = await eslint.lintFiles(["index.js"]);

await exec("git stash pop");

 
  // 3. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 4. Output it.
  console.log(resultText);

 for (let result of results) {
      if (result.errorCount) {
          process.exitCode = 1;
      }
  }


})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

- puppeteer代替PhantomJS和命令行




## 总结

就这样结束了，虽然有惰性，但我还坚持到了最后，感觉还是学到了一些有用东西，还可以多复习复习，再练一练

