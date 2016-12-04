
/**
 * 使用`url`、`msg`、`timeout`生成登陆失败消息
 */
const generateLoginFailMsgWithParams=function(url='/',msg='您尚未登陆，即将为您转向登陆',timeout=1){
    return `${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`;
};


/**
 * 使用对象的方式来生成登陆验证失败消息
 * 如果有`responseMessage`属性，则返回该属性值，否则根据`url`、`msg`、`timeout`生成之。
 * 这个函数的存在是为了在兼容原代码的情况下，直接使用完全由用户定制的消息作为响应内容发送到浏览器。
 */
const generateLoginFailMsgWithObj=function(obj={url:'',msg:'',timeout:1,responseMessage:''}){
    let {url,msg,timeout,responseMessage}=obj;
    if(responseMessage){
        return responseMessage;
    }
    if(!timeout){ timeout=1;}
    if(!url){url='/';}
    if(!msg){msg='';}    // 对于null、undefined，直接替换为空串
    return generateLoginFailMsgWithParams(url,msg,timeout);
};

/**
 * 生成角色验证失败消息
 */
const generateRoleFailMsgWithParams=function(url='/',msg='您无此权限，即将为您重定向',timeout=1){
    return `${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`;
};


/**
 * 如果`redirect` 是 `string`,则认为是redirect url，将之构造为重定向字符串
 * 如果`redirect` 不是字符串，则认为是用obj的方式生成失败消息。
 */
const generateLoginFailMsg=function(redirect){
    if(typeof redirect == "string"){
        return generateLoginFailMsgWithParams(redirect) ;
    }else{
        return generateRoleFailMsgWithObj(redirect);
    }
};

/**
 * 使用对象的方式来生成角色验证失败消息
 * 如果有`responseMessage`属性，则返回该属性值，否则根据`url`、`msg`、`timeout`生成之。
 * 这个函数的存在是为了在兼容原代码的情况下，直接使用完全由用户定制的消息作为响应内容发送到浏览器。
 */
const generateRoleFailMsgWithObj=function(obj={url:'',msg:'',timeout:1,responseMessage:''}){
    let {url,msg,timeout,responseMessage}=obj;
    if(responseMessage){
        return responseMessage;
    }
    if(!timeout){ timeout=1;}
    if(!url){url='/';}
    if(!msg){msg='';}    // 对于null、undefined，直接替换为空串
    return generateRoleFailMsgWithParams(url,msg,timeout);
};


/**
 * 如果`redirect` 是 `string`,则认为是redirect url，将之构造为重定向字符串
 * 如果`redirect` 不是字符串，则认为是用obj的方式生成失败消息。
 */
const generateRoleFailMsg=function(redirect){
    if(typeof redirect == "string"){
        return generateRoleFailMsgWithParams(redirect);
    }else{
        return generateRoleFailMsgWithObj(redirect);
    }
};

module.exports={
    generateLoginFailMsgWithParams,
    generateLoginFailMsgWithObj,
    generateLoginFailMsg,
    generateRoleFailMsgWithParams,
    generateRoleFailMsgWithObj,
    generateRoleFailMsg,
};