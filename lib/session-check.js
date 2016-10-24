/**
 * 检查用户是否登陆、是否拥有指定角色的一套检查函数（生成中间件函数）
 * 目前的实现依赖于session，要求：
 * - username 
 * - roles 
 * 存储于session之中
 */
var hasSignedIn=require('./has-signed-in');



/**
 * 高阶函数，返回一个中间件,用于检查是否登陆
 */
function requireLogin(redirect="/account",loginChecker=hasSignedIn) {

    return (req,res,next)=>{
        if(loginChecker(req)){
            next();
        }else{
            //res.redirect("/");
            res.send(`您尚未登陆，即将为您转向登陆<meta http-equiv="refresh" content="1;url=${redirect}"/>`);
        }
    };
}


/** 
 * 高阶函数，返回一个中间件,用于检查是否拥有指定角色
 */
function requireRole(ROLE_STR,redirect="/") {

    return (req,res,next)=>{
        let roles=req.session.roles||[];
        if(roles.indexOf(ROLE_STR)!=-1){
            next();
        }else{
            res.send(`您无此权限，即将为您从定向<meta http-equiv="refresh" content="1;url=${redirect}"/>`);
        }
    };
}


/**
 * 高阶函数，返回一个中间件,用于检查是否拥有指定角色之一
 */
function requireAnyRole(ROLES_ARRAY,redirect="/") {

    return (req,res,next)=>{
        let roles=req.session.roles||[];
        let accessable=false;
        for(let i=0;i<roles.length;i++){
            if(ROLES_ARRAY.indexOf(roles[i])!==-1){
                accessable=true;
                break;
            }
        }
        if(accessable==true){
            next();
        }else{
            res.send(`您无此权限，即将为您从定向<meta http-equiv="refresh" content="1;url=${redirect}"/>`);
        }
    };
    
}


/**
 * 高阶函数，返回一个中间件,用于检查是否拥有指定的所有角色
 */
function requireAllRoles(ROLES_ARRAY,redirect="/") {
    return (req, res, next) => {
        let roles=req.session.roles||[];
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
            res.send(`您无此权限，即将为您从定向<meta http-equiv="refresh" content="1;url=${redirect}"/>`);
        }
    };
}



module.exports={
    requireLogin,
    requireRole,
    requireAnyRole,
    requireAllRoles,
};