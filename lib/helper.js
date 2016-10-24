/**
 * 登陆检查器：检查是否已经登陆
 */
function loginChecker(req) {
    return !! req.session.username;
}


/**
 * 角色访问器：利用`req`返回 一个`roles`对象
 */
function rolesAccessor(req) {
    let roles= req.session.roles;
    return roles;
}


module.exports={
    loginChecker,
    rolesAccessor,
};

