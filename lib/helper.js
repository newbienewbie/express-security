/**
 * 默认的登陆检查器：根据`req`检查是否已经登陆
 */
function loginChecker(req) {
    return !! req.session.username;
}


/**
 * 默认的角色访问器：利用`req`得到一个`roles`对象
 */
function rolesAccessor(req) {
    let roles= req.session.roles;
    return roles;
}


module.exports={
    loginChecker,
    rolesAccessor,
};

