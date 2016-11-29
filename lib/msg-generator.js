
/**
 * 生成登陆失败消息
 */
const generateLoginFailMsg=function(url='/',msg='您尚未登陆，即将为您转向登陆',timeout=1){
    return `${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`;
};

/**
 * 生成角色验证失败消息
 */
const generateRoleFailMsg=function(url='/',msg='您无此权限，即将为您重定向',timeout=1){
    return `${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`;
};


module.exports={
    generateLoginFailMsg,
    generateRoleFailMsg,
};