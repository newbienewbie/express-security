const assert=require('assert');
const helper=require('../lib/helper');

describe("测试 helper 模块",function(){

    describe("测试 loginChecker()",function(){

        var loginChecker=helper.loginChecker;
        var req={session:{'username':''},};

        it("当username是['',undefined,null] 之一时，都应该返回false",function(){
            var usernames=['',undefined,null];
            usernames.forEach(e=>{
                req.session.username=e;
                assert.ok(!loginChecker(req),`username=${e}，应该返回false`);
            });
        });

        it("当username是常规字符串时，都应该返回true",function(){
            var usernames=['shit',"admin","\x00admin"];
            usernames.forEach(e=>{
                req.session.username=e;
                assert.ok(loginChecker(req),`username=${e}，应该返回true`);
            });
        });

    });

    describe("测试 rolesAccessor()",function(){
        var rolesAccessor=helper.rolesAccessor;
        var req={session:{'roles':[]},};
        it("所取即所得",function(){
            var roles=[
                ["ROLE_0"],
                ["ROLE_0","ROLE_1","ROLE_2"],
                ["ROLE_A","ROLE_A","ROLE_A"],
            ];
            roles.forEach(e=>{
                req.session.roles=e;
                assert.equal(rolesAccessor(req),e,"角色访问器拿到的角色列表和原始的角色理应相等");
            });
        });
    });

});