/**
 * 检查是否已经登陆
 */
function hasSignedIn(req) {
    return req.session.username?true:false;
}



module.exports=hasSignedIn;

