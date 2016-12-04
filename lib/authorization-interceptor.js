const helper=require('./helper');
const msgGenerator=require('./msg-generator');
const promisify=require('promisify-any');



const DEFAULT_FAIL_MESSAGE=`您无此权限，即将为您从定向<meta http-equiv="refresh" content="1;url='/'"/>`;



/**
 * 检查用户是否登陆、是否拥有指定角色
 * 所有暴露的`requireXxx()`方法调用后都会生成一个检查函数——中间件函数
 */
class AuthorizationInterceptor{

    constructor(rolesAccessor=helper.rolesAccessor,msg=DEFAULT_FAIL_MESSAGE){
        this.rolesAccessor=promisify(rolesAccessor,1);  // 未来将接收一个`req`参数
        this.msg=msg;
    }


    /** 
     * 高阶函数，返回一个中间件,用于检查是否拥有指定角色
     */
    requireRole(ROLE_STR, redirect=null){

        return (req, res, next) => {
            const msg=(!!redirect)?
                msgGenerator.generateRoleFailMsg(redirect) :
                this.msg;
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
                this.msg;
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
                this.msg;
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
                this.msg;
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



module.exports=AuthorizationInterceptor;