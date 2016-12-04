
/**
 * 使用`url`、`msg`、`timeout`生成登陆失败消息
 */
const generateLoginFailMsg=function(url='/',msg='您尚未登陆，即将为您转向登陆',timeout=1){
    return `${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`;
};

/**
 * 使用对象的方式来生成登陆失败消息
 * 如果有`responseMessage`属性，则返回该属性值，否则根据`url`、`msg`、`timeout`生成之。
 * 这个函数的存在是为了在兼容原代码的情况下，直接使用完全由用户定制的消息作为响应内容发送到浏览器。
 */
const generateLoginFailMsgWithObj=function(obj={url:'',msg:'',timeout:1,responseMessage:''}){
    let {url,msg,timeout,responseMessage}=obj;
    if(responseMessage){
        return responseMsg;
    }
    if(!timeout){ timeout=1;}
    if(!url){url='/';}
    if(!msg){msg='';}    // 对于null、undefined，直接替换为空串
    return generateLoginFailMsg(url,msg,timeout);
};

/**
 * 生成角色验证失败消息
 */
const generateRoleFailMsg=function(url='/',msg='您无此权限，即将为您重定向',timeout=1){
    return `${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`;
};


module.exports={
    generateLoginFailMsg,
    generateLoginFailMsgWithObj,
    generateRoleFailMsg,
};