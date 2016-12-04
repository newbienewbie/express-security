const helper=require('./helper');
const msgGenerator=require('./msg-generator');
const promisify=require('promisify-any');


const DEFAULT_FAIL_MESSAGE=`您尚未登陆，即将为您转向登陆<meta http-equiv="refresh" content="1;url='/'"/>`;



/**
 * 检查用户是否登陆
 * 调用requireLogin()会生成一个检查函数——中间件函数
 */
class AuthenticationInterceptor{

    constructor(loginChecker=helper.loginChecker,msg=DEFAULT_FAIL_MESSAGE){
        this.loginChecker=promisify(loginChecker,1);    // 未来将接收一个`req`参数
        this.msg=msg;
    }


    /**
     * 高阶函数，返回一个中间件,用于检查是否登陆
     * @redirect {string|Object}  
     */
    requireLogin(redirect=null){
        return (req,res,next)=>{
            const msg=(!!redirect)? 
                msgGenerator.generateLoginFailMsg(redirect):
                this.msg;
            return this.loginChecker(req)
                .then((flag)=>{
                    if(flag){ next(); }
                    else{ res.send(msg); }
                }).catch((err)=>{
                    res.send(msg);
                });
        };
    }


}



module.exports=AuthenticationInterceptor;