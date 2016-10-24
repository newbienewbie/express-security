var assert=require('assert');
var sessionCheck=require('../lib/session-check');



describe('测试 session-check 模块',()=>{

    // 模拟 req、res、next
    var req={ session:{ username:'', roles:[] } };
    var res={ send:()=>{ } };
    var next=()=>{};

    describe('测试 requireLogin()',()=>{
        var requireLogin= sessionCheck.requireLogin();
        it('username={undefined} 时:资源不可访问(跳过next()方法)',()=>{
            req.session.username=undefined;
            let exeuted=false;
            requireLogin(req,res,()=>{
                console.log('这里的代码不会被执行');
                exeuted=true;
                assert.fail("fail");
            });
            assert.ok(!exeuted,'username为defined，next()方法不应该被执行');
        });
        it('username={null} 时:资源不可访问(跳过next()方法)',()=>{
            req.session.username=null;
            let exeuted=false;
            requireLogin(req,res,()=>{
                console.log('这里的代码不会被执行');
                exeuted=true;
                assert.fail("fail");
            });
            assert.ok(!exeuted,'username为null,next()方法不应该被执行');
        });
        it('username={空串} 时:资源不可访问(跳过next()方法)',()=>{
            req.session.username="";
            let exeuted=false;
            requireLogin(req,res,()=>{
                console.log('这里的代码不会被执行');
                exeuted=true;
                assert.fail("fail");
            });
            assert.ok(!exeuted,"username为空字符串，next()方法不应该被执行");
        });
        it('username={普通字符串} 时:资源可以访问(执行next()方法)',()=>{
            req.session.username="hello";
            let exeuted=false;
            requireLogin(req,res,()=>{
                exeuted=true;
            });
            //期待executed为true
            assert.ok(exeuted,'普通字符串的用户名，理应执行next()');
        });
        
    });
    
    describe('测试 requireRole()',()=>{
        it('要求`ROLE_1`，已有`ROLE_X`',()=>{
            req.session.roles=['ROLE_X'];
            var requireRole=sessionCheck.requireRole('ROLE_1');
            var exeuted=false; 
            requireRole(req,res,()=>{
                assert.fail('没有要求的角色，就不该执行');
                exeuted=true;
            });
            //期待executed为false
            assert.ok(!exeuted,"没有要求的角色，但next()被执行了");
        });
        it('要求`ROLE_1`，已有 `ROLE_1`',()=>{
            req.session.roles=['ROLE_12','ROLE_2','ROLE_1'];
            var requireRole=sessionCheck.requireRole('ROLE_1');
            let exeuted=false; 
            requireRole(req,res,()=>{
                exeuted=true;
                assert.ok(exeuted);
            });
            //期待executed为true
            assert.ok(exeuted,"拥有指定角色，next()理应被执行");
        });
    });
    

    describe('测试 requireAnyRole()',()=>{
        it('要求 [ROLE_X,ROLE_Y] 之中的任一角色，已有 `ROLE_1,ROLE_2,ROLE_3`',()=>{
            req.session.roles=['ROLE_1','ROLE_2','ROLE_3'];
            var requireAnyRole=sessionCheck.requireAnyRole(['ROLE_X','ROLE_Y']);
            var exeuted=false; 
            requireAnyRole(req,res,()=>{
                assert.fail('没有要求的角色，就不该执行');
                exeuted=true;
            });
            //期待executed为false
            assert.ok(!exeuted,"没有要求的角色，但next()被执行了");
        });
        it('要求 [ROLE_X,ROLE_Y] 之中的任一角色，已有 `ROLE_1,ROLE_2,ROLE_X`',()=>{
            req.session.roles=['ROLE_1','ROLE_2','ROLE_X'];
            var requireAnyRole=sessionCheck.requireAnyRole(['ROLE_X','ROLE_Y']);
            var exeuted=false; 
            requireAnyRole(req,res,()=>{
                exeuted=true;
                assert.ok(exeuted);
            });
            //期待executed为true
            assert.ok(exeuted,"拥有指定角色，next()理应被执行");
        });

    });



    describe('测试 checkAllRoles()',()=>{
        it('要求 [ROLE_X,ROLE_Y] 的全部角色，已有 `ROLE_1,ROLE_2,ROLE_3,ROLE_X`',()=>{
            req.session.roles=['ROLE_1','ROLE_2','ROLE_3','ROLE_X'];
            var requireAllRoles=sessionCheck.requireAllRoles(['ROLE_X','ROLE_Y']);
            var exeuted=false; 
            requireAllRoles(req,res,()=>{
                assert.fail('没有要求的全部角色，就不该执行');
                exeuted=true;
            });
            //期待executed为false
            assert.ok(!exeuted,"没有要求的角色，但next()被执行了");
        });
        it('要求 [ROLE_X,ROLE_Y] 的全部角色，已有`ROLE_1,ROLE_Y,ROLE_X`',()=>{
            req.session.roles=['ROLE_1','ROLE_Y','ROLE_X'];
            var requireAllRoles=sessionCheck.requireAllRoles(['ROLE_X','ROLE_Y']);
            var exeuted=false; 
            requireAllRoles(req,res,()=>{
                exeuted=true;
                assert.ok(exeuted);
            });
            //期待executed为true
            assert.ok(exeuted,"拥有指定的全部角色，next()理应被执行");
        });
    });

});