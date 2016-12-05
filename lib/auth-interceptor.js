const promisify=require('promisify-any');
const AuthenticationInterceptor=require('./authentication-interceptor');
const AuthorizationInterceptor=require('./authorization-interceptor');
const helper=require('./helper');


const DEFAULT_FAIL_MESSAGE={
    loginFail:`您尚未登陆，即将为您转向登陆<meta http-equiv="refresh" content="1;url='/'"/>`,
    roleFail:`您无此权限，即将为您从定向<meta http-equiv="refresh" content="1;url='/'"/>`,
};


/**
 * 检查用户是否登陆、是否拥有指定角色
 * 所有暴露的方法调用都会生成一个检查函数——中间件函数
 */
class AuthInterceptor{

    constructor(loginChecker=helper.loginChecker,rolesAccessor=helper.rolesAccessor,msg=DEFAULT_FAIL_MESSAGE){
        this.loginChecker=loginChecker;
        this.rolesAccessor=rolesAccessor;
        this.authenticationInterceptor=new AuthenticationInterceptor(loginChecker,msg.loginFail);
        this.authorizationInterceptor=new AuthorizationInterceptor(rolesAccessor,msg.roleFail);
    }

    requireLogin(redirect=null){
        return this.authenticationInterceptor.requireLogin(redirect);
    }

    requireRole(ROLE_STR, redirect=null){
        return this.authorizationInterceptor.requireRole(ROLE_STR, redirect);
    }

    requireAnyRole(ROLES_ARRAY, redirect=null){
        return this.authorizationInterceptor.requireAnyRole(ROLES_ARRAY, redirect);
    }
    
    requireAllRoles(ROLES_ARRAY, redirect=null){
        return this.authorizationInterceptor.requireAllRoles(ROLES_ARRAY, redirect);
    }

    requireTrue(fn=(req)=>true,redirect=null){
        return this.authorizationInterceptor.requireTrue(fn,redirect);
    }
}


module.exports=AuthInterceptor;