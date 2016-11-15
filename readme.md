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
> npm install express-session
```

### 自定义配置

但是，`AuthorizationChecker`检查机制并不和 `session` 耦合在一起。 通过提供自定义`登陆检查器`、`角色访问器`，完全可以不需要 `session` 。

可以通过`AuthorizationChecker`实现自定义：
```Java
const checker=new AuthorizationChecker(
    (req)=>{return !!req.session.username;},  // 覆盖默认的登陆检查器
    (req)=>{return req.session.roles;}        // 覆盖默认的角色访问器
);
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

## 使用

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
