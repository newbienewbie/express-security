# express-security

一套`Express`中间件，轻量，用于根据当前用户是否登陆、及其拥有的角色来拦截请求。

## 使用说明

目前使用`AuthenticationInterceptor`、 `AuthorizationInterceptor`、`AuthInterceptor` 类作为对外统一接口。三个类的职责为：
* `AuthenticationInterceptor`： 负责认证检查
* `AuthorizationInterceptor`：负责授权检查
* `AuthInterceptor`：负责认证和授权检查，只是以上两个类的包装

1. 根据需要，实例化一个`AuthenticationInterceptor`、`AuthorizationInterceptor`、或者`AuthInterceptor`拦截器
2. 使用拦截器拦截请求

### 默认情况

默认的实现是基于`session`机制:

* 默认情况下，需要确保  `req.session` 的可用性。
* 默认情况下，对客户端的用户名判断是通过`req.session.username`实现的。如果要定制，需要自行提供登陆检查器。
* 默认情况下，对客户端的角色判断是通过`req.session.roles`实现的。如果要定制，需要自行提供角色访问器。

所以，这时候往往需要安装第三方模块保证`session`可用，比如使用`express-session`中间件：
```
> npm install express-session --save
```

使用之前需要实例化出一个对象：
```JavaScript

// initialize a authentication-interceptor
const authenInterceptor=new AuthenticationInterceptor();

// initialize a authorization-interceptor
const authorInterceptor=new AuthorizationInterceptor();

// or just initialize a auth-interceptor
const interceptor=new AuthInterceptor();
```

### 自定义配置

尽管默认的配置是基于`session`的，但是，`AuthInterceptor`、`AuthenticationInterceptor`、和`AuthorizationInterceptor`的检查机制并不和 `session` 耦合在一起。 通过提供自定义`登陆检查器`、`角色访问器`，完全可以丢掉 `session` 。

1. `登陆检查器`：函数对象，接收请求`req`参数，同步返回（或者以等价的异步的方式“返回”）当前用户是否登陆的`boolean`值，
2. `角色访问器`: 函数对象，接收请求`req`参数，同步返回（或者以等价的异步的方式“返回”）当前用户所拥有的角色列表。放心，拦截器只会对“返回”的角色列表读操作。

可以通过`AuthenticationInterceptor`、`AuthorizationInterceptor`实现自定义：
```JavaScript

// 认证拦截器
const authenticationInterceptor=new AuthenticationInterceptor(
    (req)=>{return !!req.session.username;},  // 覆盖默认的登陆检查器
);

// 授权拦截器
const authorizationInterceptor=new AuthorizationInterceptor(
    (req)=>{return req.session.roles;}        // 覆盖默认的角色访问器
);

// 如果你认证/授权都需要的话：
const authInterceptor=new AuthInterceptor(
    (req)=>{return !!req.session.username;},  // 覆盖默认的登陆检查器
    (req)=>{return req.session.roles;}        // 覆盖默认的角色访问器
);
```

当前，还可以提供`msg`对象作为附加的默认返回消息（详见代码实现），但是大多情况下，不需要定制此参数。

### 异步式

除了上面演示的同步式的登陆检查器和角色访问器，还可以使用异步式进行定制:

```JavaScript

// 支持各类异步方式：比如可以以Promise的方式进行检查
const authenticationInterceptor=new AuthenticationInterceptor(
    // 覆盖默认的登陆检查器
    (req)=>{
        return new Promise(function(resolve,reject){
            resolve(!!req.session.username);
        });
    }
);

// 支持各类异步方式：还可以以callback的方式进行检查
const authorizationInterceptor=new AuthorizationInterceptor(
    // 覆盖默认的角色访问器
    (req,callback)=>{
        setTimeout(function() {
            callback(null,req.session.rolelist);
        }, 100);
    }
);

const interceptor=new AuthInterceptor(
    (req)=>{return !!req.session.username;},
    (req)=>{
        return new Promise(function(resolve,reject){
            resolve(req.session.rolelist);
        });
    }
);
```

除此之外，`requireTrue()`方法也支持使用异步式进行拦截：
```JavaScript
const interceptor=new AuthorizationInterceptor();

interceptor.requireTrue(function(req){
    return Promise.resolve(req.sth);
});
```


## 如何拦截请求

`AuthenticationInterceptor`和`AuthorizationInterceptor`实例对请求的拦截是利用`express`中间件原理实现的。
拦截器实例对象有一系列`requireXxx()`方法，比如

1. `requireLogin()`
2. `requireRole()`
3. `requireAnyRole()`
4. `requireAllRoles()`
5. `requireTrue()`

`AuthInterceptor`的`requireXxx()`只是简单调用`AuthenticationInterceptor`和`AuthorizationInterceptor`的相应`requireXxx()`方法。
每个这种方法都是一个高阶函数，调用后会返回一个中间件函数，用于拦截请求：

```JavaScript
// 要求拥有 "ROLE_ROOT" 角色，否则提示失败消息然后重定向到根目录"/"
router.use("/admin",interceptor.requireRole("ROLE_ROOT","/"));
```

## 安装与测试

通过`npm`安装：
```
> npm install express-security --save
```

测试：
```
> npm run test
```

## 使用示例

可以根据需要，分别实例化一个`AuthenticationInterceptor`和`AuthorizationInterceptor`。

```JavaScript
const express=require('express');
const {AuthInterceptor,AuthenticationInterceptor,AuthorizationInterceptor}=require('express-security');

const router=express.Router();

const authenInterceptor=new AuthencationInterceptor(
    (req)=>{return !!req.session.username;},
);

const interceptor=new AuthorizationInterceptor(
    (req)=>{return req.session.roles;}
);

// 要求登陆
router.use('/dashboard',authenInterceptor.requireLogin());

// 要求登陆，自定义重定向页面
router.use('/user/detail',authenInterceptor.requireLogin("/account"));

// 要求拥有 "ROLE_ADMIN" 角色
router.use("/admin",interceptor.requireRole("ROLE_ADMIN","/"));

// 要求拥有 "ROLE_ROOT"、"ROLE_ADMIN" 中任意一个角色
router.use("/sudo",interceptor.requireAnyRole(["ROLE_ROOT","ROLE_ADMIN"]));

// 要求拥有 "ROLE_0"、"ROLE_1"、"ROLE_2" 中全部角色
router.use("/holy",interceptor.requireAllRoles(["ROLE_0","ROLE_1","ROLE_2"]));

// 要求返回正确值的可调用对象
router.use("/shit",interceptor.requireTrue((req)=>{return !! req.query.sth;},"/"));
```
如果同时需要根据用户登录状态和角色信息对请求进行拦截,也可以直接实例化一个`AuthInterceptor`作为统一的外部接口。

```JavaScript
const AuthInterceptor=new AuthInterceptor(
    (req)=>{return !!req.session.username;},
    (req)=>{return req.session.roles;}
);
```

## 案例

参见我的这篇笔记：[ASP.NET 与 Node.js 的协作实践](http://www.itminus.com/2016/11/29/Misc/ASP-NET-%E4%B8%8E-Node-js-%E7%9A%84%E5%8D%8F%E4%BD%9C%E5%AE%9E%E8%B7%B5/) 