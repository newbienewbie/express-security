const helper=require('./helper');



const DEFAULT_FAIL_MESSAGE={
    LoginFail:`您尚未登陆，即将为您转向登陆<meta http-equiv="refresh" content="1;url='/account'"/>`,
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
        this.loginChecker=loginChecker;
        this.rolesAccessor=rolesAccessor;
        this.msg=msg;
    }


    /**
     * 高阶函数，返回一个中间件,用于检查是否登陆
     */
    requireLogin(redirect=null){
        return (req,res,next)=>{
            if(this.loginChecker(req)){
                next();
            }else{
                const msg=(!!redirect)?redirect:this.msg.LoginFail;
                res.send(msg);
            }
        };
    }


    /** 
     * 高阶函数，返回一个中间件,用于检查是否拥有指定角色
     */
    requireRole(ROLE_STR, redirect=null){

        return (req, res, next) => {
            let roles = this.rolesAccessor(req) || [];
            if (roles.indexOf(ROLE_STR) != -1) {
                next();
            } else {
                const msg=(!!redirect)?redirect:this.msg.RoleFail;
                res.send(msg);
            }
        };
    }

    /**
     * 高阶函数，返回一个中间件,用于检查是否拥有指定角色之一
     */
    requireAnyRole(ROLES_ARRAY, redirect=null) {
        return (req, res, next) => {
            let roles = this.rolesAccessor(req) || [];
            let accessable = false;
            for (let i = 0; i < roles.length; i++) {
                if (ROLES_ARRAY.indexOf(roles[i]) !== -1) {
                    accessable = true;
                    break;
                }
            }
            if (accessable == true) {
                next();
            } else {
                const msg=(!!redirect)?redirect:this.msg.RoleFail;
                res.send(msg);
            }
        };

    }

    /**
     * 高阶函数，返回一个中间件,用于检查是否拥有指定的所有角色
     */
    requireAllRoles(ROLES_ARRAY, redirect=null) {
        return (req, res, next) => {
            let roles = this.rolesAccessor(req) || [];
            let accessable = true;
            for (let i = 0; i < ROLES_ARRAY.length; i++) {
                if (roles.indexOf(ROLES_ARRAY[i]) == -1) {
                    accessable = false;
                    break;
                }
            }
            if (accessable == true) {
                next();
            } else {
                const msg=(!!redirect)?redirect:this.msg.RoleFail;
                res.send(msg);
            }
        };
    }




}



module.exports=AuthorizationChecker;