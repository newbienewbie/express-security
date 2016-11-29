const assert=require('assert');
const msgGenerator=require('../lib/msg-generator');


describe('测试 msg-generator.js',function(){

    describe('#generateLoginFailMsg()',function(){

        let msg="您尚未登陆，即将为您转向登陆";
        let timeout=1;
        let url='/';

        it('默认情况',function(){
            const failMsg=msgGenerator.generateLoginFailMsg();
            assert.equal(failMsg,`${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`);
        });
        
        it('提供参数情况',function(){
            msg="您尚未登陆";
            timeout='2';
            url="/sss"
            const failMsg=msgGenerator.generateLoginFailMsg(url,msg,timeout);
            assert.equal(failMsg,`${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`);
        });
    });

    describe('#generateRoleFailMsg()',function(){

        let msg="您无此权限，即将为您重定向";
        let timeout=1;
        let url='/';

        it('默认情况',function(){
            const failMsg=msgGenerator.generateRoleFailMsg();
            assert.equal(failMsg,`${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`);
        });
        
        it('提供参数情况',function(){
            msg="您尚未此权限";
            timeout='2';
            url="/sss"
            const failMsg=msgGenerator.generateRoleFailMsg(url,msg,timeout);
            assert.equal(failMsg,`${msg}<meta http-equiv="refresh" content="${timeout};url='${url}'"/>`);
        });
    });
    
});