# express-security

一套`Express`中间件，轻量，用于根据当前用户是否登陆、及其拥有的角色来拦截请求。

目前使用 `AuthorizationChecker` 类作为对外统一接口。

## 使用说明

1. 实例化一个检查器（如果需要，可以将之作为服务暴露出去）
2. 使用检查器拦截请求

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
const checker=new AuthorizationChecker();
```

### 自定义配置

但是，`AuthorizationChecker`检查机制并不和 `session` 耦合在一起。 通过提供自定义`登陆检查器`、`角色访问器`，完全可以不需要 `session` 。

1. `登陆检查器`：函数对象，接收请求`req`参数，同步返回（或者以等价的异步的方式“返回”）当前用户是否登陆的`boolean`值，
2. `角色访问器`: 函数对象，接收请求`req`参数，同步返回（或者以等价的异步的方式“返回”）当前用户所拥有的角色列表

可以通过`AuthorizationChecker`实现自定义：
```JavaScript
const checker=new AuthorizationChecker(
    (req)=>{return !!req.session.username;},  // 覆盖默认的登陆检查器
    (req)=>{return req.session.roles;}        // 覆盖默认的角色访问器
);
```

当前，还可以提供`msg`对象作为第三个参数（详见代码实现），但是大多情况下，不需要定制此参数。

### 异步式

除了上面演示的同步式的登陆检查器和角色访问器，还可以使用异步式进行定制:

```JavaScript
const checker=new AuthorizationChecker(
    // 覆盖默认的登陆检查器
    (req)=>{
        return new Promise(function(resolve,reject){
            resolve(!!req.session.username);
        });
    }, 
    // 覆盖默认的角色访问器
    (req,callback)=>{
        setTimeout(function() {
            callback(null,req.session.rolelist);
        }, 100);
    }
);
```

除此之外，`requireTrue()`方法也支持使用异步式进行拦截：
```JavaScript
const checker=new AuthorizationChecker();

checker.requireTrue(function(req){
    return Promise.resolve(req.sth);
});
```


## 如何拦截请求

AuthorizationChecker实例对请求的拦截是利用`express`中间件原理实现的。
检查器实例对象有一系列requireXxx()方法，比如

1. requireLogin()
2. requireRole()
3. requireAnyRole()
4. requireAllRoles()
5. requireTrue()

每个这种方法都是一个高阶函数，调用后会返回一个中间件函数，用于拦截请求：

```JavaScript
// 要求拥有 "ROLE_ROOT" 角色，否则提示失败消息然后重定向到根目录"/"
router.use("/admin",checker.requireRole("ROLE_ROOT","/"));
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

```JavaScript
const express=require('express');
const AuthorizationChecker=require('express-security').AuthorizationChecker;

const router=express.Router();
const checker=new AuthorizationChecker(
    (req)=>{return !!req.session.username;},
    (req)=>{return req.session.roles;}
);

// 要求登陆
router.use('/dashboard',checker.requireLogin());

// 要求登陆，自定义重定向页面
router.use('/user/detail',checker.requireLogin("/account"));

// 要求拥有 "ROLE_ADMIN" 角色
router.use("/admin",checker.requireRole("ROLE_ADMIN","/"));

// 要求拥有 "ROLE_ROOT"、"ROLE_ADMIN" 中任意一个角色
router.use("/sudo",checker.requireAnyRole(["ROLE_ROOT","ROLE_ADMIN"]));

// 要求拥有 "ROLE_0"、"ROLE_1"、"ROLE_2" 中全部角色
router.use("/holy",checker.requireAllRoles(["ROLE_0","ROLE_1","ROLE_2"]));

// 要求返回正确值的可调用对象
router.use("/shit",checker.requireTrue((req)=>{return !! req.query.sth;},"/"));
```
