var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    // this.option('babel'); // This method adds support for a `--babel` flag
  }
//   async method1() {
//       // 命令行交互
//     const answers = await this.prompt([
//         {
//           type: "input",
//           name: "name",
//           message: "Your project name",
//           default: this.appname // Default to current folder name
//         },
//         {
//           type: "confirm",
//           name: "cool",
//           message: "Would you like to enable the Cool feature?"
//         }
//       ]);
//       this.log('method 1 just ran');
//       this.log("app name", answers.name);
//     this.log("cool feature", answers.cool);
//   }

//   async step() {
//       // 在demo文件夹yo toolofchain复制模板
//     this.fs.copyTpl(
//         this.templatePath('t.html'),
//         this.destinationPath('public/index.html'),
//         { title: 'Templating with Yeoman' }
//       );
//     this.log('method 2 just ran');
//   }

// 给demo初始化package.json
  initPackage() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    // npm install
    this.npmInstall();
  }
};