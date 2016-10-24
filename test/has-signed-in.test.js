const assert=require('assert');
const hasSignedIin=require('../lib/has-signed-in');

describe("测试 has-has-signed-in 模块",function(){

    describe("测试 hasSignedIin()",function(){

        var req={session:{'username':''},};

        it("当username是['',undefined,null] 之一时，都应该返回false",function(){
            var usernames=['',undefined,null];
            usernames.forEach(e=>{
                req.session.username=e;
                assert.ok(!hasSignedIin(req),`username=${e}，应该返回false`);
            });
        });

        it("当username是常规字符串时，都应该返回true",function(){
            var usernames=['shit',"admin","\x00admin"];
            usernames.forEach(e=>{
                req.session.username=e;
                assert.ok(hasSignedIin(req),`username=${e}，应该返回true`);
            });
        });

    });

});