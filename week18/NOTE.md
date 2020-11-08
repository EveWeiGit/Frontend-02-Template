学习笔记

## 步骤

- 下载安装VM Box, Ubuntu 镜像
- 新建一个Node Server（Linux，Ubuntu-64bit）
- 启动Node Server的时候引入Ubuntu 镜像
- Ubuntu 镜像启动后需要更改镜像地址
![](./img/mirror.png)

- 填写用户名和服务器名，密码
![](./img/userinfo.png)

- 勾选Install OpenSSH server
![](./img/openssh.png)

- 安装完毕，点击Reboot重启
![](./img/installed.png)

- 手动重启
![](./img/reboot.png)


- 输入用户名和密码登录成功
![](./img/loginsuccess.png)

- 用apt安装nodejs
```
sudo apt install nodejs
```
![](./img/apt.png)

- 用apt安装npm
```
sudo apt install npm
```
![](./img/npm.png)


- 用npm 全局安装 n
  
  用node 写的node版本管理
```
sudo npm install -g n
```
![](./img/n.png)


- 用 n 来管理node版本
  要最新的node
![](./img/latest.png)

- PATH=$"PATH"


- 启动ssh
```
service ssh start
```
默认22端口
  
![](./img/ssh.png)

- 虚拟机设置22端口

![](./img/step1.png)

![](./img/step2.png)


- 用scp命令

把本目录的所有文件从8022 端口copy到虚拟机上
P后面跟端口号
127.0.0.1 如果是真的服务器，就用服务器的ip地址就可以了

因为copy整个目录，所以加个-r
```
scp -P 8022 -r ./* eve@127.0.0.1:/home/eve/server
```

![](./img/step3.png)
创建完目录再试一次
![](./img/mkdir.png)


## 总结

做了一半，还没做完，虚拟机总是半路异常，然后要重新启动，重新安装🤦‍♂️






