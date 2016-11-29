const helper=require('./helper');
const msgGenerator=require('./msg-generator');
const promisify=require('promisify-any');



const DEFAULT_FAIL_MESSAGE={
    LoginFail:`您尚未登陆，即将为您转向登陆<meta http-equiv="refresh" content="1;url='/'"/>`,
    RoleFail:`您无此权限，即将为您从定向<meta http-equiv="refresh" content="1;url='/'"/>`,
};



/**
 * 检查用户是否登陆、是否拥有指定角色
 * 所有暴露的方法调用都会生成一个检查函数——中间件函数
 * 目前的实现依赖于session。默认（未手工配置）情况下，约定：
 * - username 
 * - roles 
 * 存储于session之中
 */
class AuthorizationChecker{

    constructor(loginChecker=helper.loginChecker,rolesAccessor=helper.rolesAccessor,msg=DEFAULT_FAIL_MESSAGE){
        this.loginChecker=promisify(loginChecker,1);    // 未来将接收一个`req`参数
        this.rolesAccessor=promisify(rolesAccessor,1);  // 未来将接收一个`req`参数
        this.msg=msg;
    }


    /**
     * 高阶函数，返回一个中间件,用于检查是否登陆
     */
    requireLogin(redirect=null){
        return (req,res,next)=>{
            const msg=(!!redirect)? 
                msgGenerator.generateLoginFailMsg(redirect):
                this.msg.LoginFail;
            return this.loginChecker(req)
                .then((flag)=>{
                    if(flag){ next(); }
                    else{ res.send(msg); }
                }).catch((err)=>{
                    res.send(msg);
                });
        };
    }


    /** 
     * 高阶函数，返回一个中间件,用于检查是否拥有指定角色
     */
    requireRole(ROLE_STR, redirect=null){

        return (req, res, next) => {
            const msg=(!!redirect)?
                msgGenerator.generateRoleFailMsg(redirect) :
                this.msg.RoleFail;
            return this.rolesAccessor(req)
                .then(roles=>{
                    roles=roles?roles:[];
                    if (roles.indexOf(ROLE_STR) != -1) { next(); } 
                    else { res.send(msg); }
                }).catch(err=>{
                    res.send(msg);
                });
        };
    }

    /**
     * 高阶函数，返回一个中间件,用于检查是否拥有指定角色之一
     */
    requireAnyRole(ROLES_ARRAY, redirect=null) {
        return (req, res, next) => {
            const msg=(!!redirect)?
                msgGenerator.generateRoleFailMsg(redirect) :
                this.msg.RoleFail;
            return this.rolesAccessor(req)
                .then(roles=>{
                    roles = roles?roles:[];
                    let accessable = false;
                    for (let i = 0; i < roles.length; i++) {
                        if (ROLES_ARRAY.indexOf(roles[i]) !== -1) {
                            accessable = true;
                            break;
                        }
                    }
                    if (accessable == true) { next(); } 
                    else { res.send(msg); }
                }).catch(err=>{
                    res.send(msg);
                })
        };

    }

    /**
     * 高阶函数，返回一个中间件,用于检查是否拥有指定的所有角色
     */
    requireAllRoles(ROLES_ARRAY, redirect=null) {
        return (req, res, next) => {
            const msg=(!!redirect)?
                msgGenerator.generateRoleFailMsg(redirect) :
                this.msg.RoleFail;
            return this.rolesAccessor(req)
                .then(roles=>{
                    roles = roles?roles:[];
                    let accessable = true;
                    for (let i = 0; i < ROLES_ARRAY.length; i++) {
                        if (roles.indexOf(ROLES_ARRAY[i]) == -1) {
                            accessable = false;
                            break;
                        }
                    }
                    if (accessable == true) { next(); } 
                    else { res.send(msg); }
                })
                .catch(err=>{
                    res.send(msg);
                });
        };
    }



    /**
     * 高阶函数，返回一个中间件，用于检查传进来的可调用对象的返回值是否为真
     */
    requireTrue(fn=(req)=>true,redirect=null){
        return (req, res, next) => {
            const msg=(!!redirect)?
                msgGenerator.generateRoleFailMsg(redirect) :
                this.msg.RoleFail;
            return promisify(fn,1)(req)
                .then(accessable=>{
                    if (accessable == true) { next(); } 
                    else { res.send(msg); }
                }).catch(e=>{
                    res.send(msg);
                });
        };
    }




}



module.exports=AuthorizationChecker;