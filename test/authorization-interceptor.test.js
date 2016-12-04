const assert=require('assert');
const AuthorizationInterceptor=require('../lib/authorization-interceptor');



describe('测试 AuthorizationInterceptor类',()=>{

    // 模拟 req、res、next
    // 第一组：
    let req={ session:{ username:'', roles:[]} };
    let res={ send:()=>{ } };
    let next=()=>{};


    describe('.requireRole()',()=>{

        const test=(checker,ROLE)=>{
            let executed=false;
            const middleware=checker.requireRole(ROLE);
            return middleware(req,res,()=>{
                executed=true;
            }).then(()=>{
                return executed;
            });
        };

        describe("要求`ROLE_1`，已有`ROLE_X`",()=>{

            it("使用默认参数进行初始化",function(done){
                let checker=new AuthorizationInterceptor();
                req.session.roles=['ROLE_X'];
                test(checker,"ROLE_1")
                    .then(executed=>{
                        assert.ok(!executed, "没有要求的角色，但next()被执行了");
                    })
                    .then(done).catch(done);
            });
            it("使用自定义参数(同步式)进行初始化",function(done){
                let checker=new AuthorizationInterceptor(
                    (req)=>{return req.session.rolelist;}
                );
                req.session.rolelist=['ROLE_X'];
                test(checker,"ROLE_1")
                    .then(executed=>{
                        assert.ok(!executed, "没有要求的角色，但next()被执行了");
                    })
                    .then(done).catch(done);
            });
            it("使用自定义参数(异步式)进行初始化",function(done){
                let checker=new AuthorizationInterceptor(
                    (req)=>{
                        return new Promise(function(resolve,reject){
                            resolve(req.session.rolelist);
                        });
                    }
                );
                req.session.rolelist=['ROLE_X'];
                test(checker,"ROLE_1")
                    .then(executed=>{
                        assert.ok(!executed, "没有要求的角色，但next()被执行了");
                    })
                    .then(done).catch(done);
            });
            
        });


        describe("要求`ROLE_A`，已有`ROLE_A`",()=>{

            it("使用默认参数进行初始化",function(done){
                let checker=new AuthorizationInterceptor();
                req.session.roles=['ROLE_A'];
                test(checker,"ROLE_A")
                    .then(executed=>{
                        assert.ok(executed,"拥有所要求的角色`ROLE_A`，但next()未执行");
                    })
                    .then(done).catch(done);
            });

            it("使用自定义参数(同步式)进行初始化",function(done){
                let checker=new AuthorizationInterceptor(
                    (req)=>{return req.session.rolelist;}
                );
                req.session.rolelist=['ROLE_A'];
                test(checker,"ROLE_A")
                    .then(executed=>{
                        assert.ok(executed,"拥有所要求的角色`ROLE_A`，但next()未执行");
                    })
                    .then(done).catch(done);
            });

            it("使用自定义参数(异步式)进行初始化",function(done){
                let checker=new AuthorizationInterceptor(
                    (req)=>{
                        return new Promise(function(resolve,reject){
                            resolve(req.session.rolelist);
                        });
                    }
                );
                req.session.rolelist=['ROLE_X',"ROLE_Y"];
                test(checker,"ROLE_X")
                    .then(executed=>{
                        assert.ok(executed,"拥有所要求的角色`ROLE_X`，但next()未执行");
                    })
                    .then(done).catch(done);
            });
            
        });

    });

    describe('.requireAnyRole()',()=>{

        const test=(checker,ROLE_ARRAY)=>{
            let executed=false; 
            const middleware = checker.requireAnyRole(ROLE_ARRAY);
            return middleware(req, res, () => {
                executed = true;
            }).then(() => {
                return executed;
            });
        };

        describe('要求 [ROLE_X,ROLE_Y] 之中的任一角色，已有 `ROLE_1,ROLE_2,ROLE_X`',()=>{

            it('使用默认参数进行初始化', function(done){
                req.session.roles = ['ROLE_1', 'ROLE_2', 'ROLE_X'];
                const checker=new AuthorizationInterceptor();
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有指定角色，next()理应被执行");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(同步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_2', 'ROLE_X'];
                const checker=new AuthorizationInterceptor(
                    (req)=>{return req.session.rolelist;}
                );
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有指定角色，next()理应被执行");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(异步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_', 'ROLE_2', 'ROLE_X'];
                const checker=new AuthorizationInterceptor(
                    (req)=>{
                        return new Promise(function(resolve,reject){
                            resolve(req.session.rolelist);
                        });
                    }
                );
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有指定角色，next()理应被执行");
                    })
                    .then(done).catch(done);
            });
        });
  
        describe('要求 [ROLE_X,ROLE_Y] 之中的任一角色，已有 `ROLE_1,ROLE_2,ROLE_3`', () => {

            it('使用默认参数进行初始化', function(done){
                req.session.roles = ['ROLE_1', 'ROLE_2', 'ROLE_3'];
                const checker = new AuthorizationInterceptor();
                test(checker, ['ROLE_X', 'ROLE_Y'])
                    .then(executed=>{
                        assert.ok(!executed, "无指定的任一角色，绝不应该执行next()");
                    }).
                    then(done).catch(done);
            });

            it('使用自定义参数(同步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_2', 'ROLE_3'];
                const checker = new AuthorizationInterceptor(
                    (req) => { return req.session.rolelist; }
                );
                test(checker, ['ROLE_X', 'ROLE_Y'])
                    .then(executed=>{
                        assert.ok(!executed, "无指定的任一角色，绝不应该执行next()");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(异步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_2', 'ROLE_X'];
                const checker=new AuthorizationInterceptor(
                    (req)=>{
                        return new Promise(function(resolve,reject){
                            resolve(req.session.rolelist);
                        });
                    }
                );
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有指定角色，next()理应被执行");
                    })
                    .then(done).catch(done);
            });
        });
 
    });

    describe('.requireAllRoles()',()=>{

        const test=(checker,ROLE_ARRAY)=>{
            let executed=false; 
            const middleware = checker.requireAllRoles(ROLE_ARRAY);
            return middleware(req, res, () => {
                executed = true;
            }).then(() => {
                return executed;
            });
        };

        describe('要求 [ROLE_X,ROLE_Y] 的全部角色，已有 `ROLE_1,ROLE_2,ROLE_3,ROLE_X`',()=>{

            it('使用默认参数进行初始化', function(done){
                req.session.roles = ['ROLE_1', 'ROLE_2','ROLE_3', 'ROLE_X'];
                const checker=new AuthorizationInterceptor();
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(!executed, "未拥有指定的全部角色，next()不应被执行");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(同步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_2','ROLE_3', 'ROLE_X'];
                const checker=new AuthorizationInterceptor(
                    (req)=>{return req.session.rolelist;}
                );
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(!executed, "未拥有指定的全部角色，next()不应被执行");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(异步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_2','ROLE_3', 'ROLE_X'];
                const checker=new AuthorizationInterceptor(
                    (req)=>{
                        return new Promise(function(resolve,reject){
                            resolve(req.session.rolelist);
                        });
                    }
                );
                test(checker,['ROLE_X','ROLE_Y'])
                    .then(executed=>{
                        assert.ok(!executed, "未拥有指定的全部角色，next()不应被执行");
                    })
                    .then(done).catch(done);
            });
        });
  
        describe('要求 [ROLE_X,ROLE_Y] 的全部角色，已有`ROLE_1,ROLE_Y,ROLE_X``', () => {

            it('使用默认参数进行初始化', function(done){
                req.session.roles = ['ROLE_1', 'ROLE_Y','ROLE_X',];
                const checker = new AuthorizationInterceptor();
                test(checker, ['ROLE_X', 'ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有要求的全部角色，理应应该执行next()");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(同步式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_Y','ROLE_X',];
                const checker = new AuthorizationInterceptor(
                    (req) => { return req.session.rolelist; }
                );
                test(checker, ['ROLE_X', 'ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有要求的全部角色，理应应该执行next()");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(异步Promise式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_Y','ROLE_X',];
                const checker = new AuthorizationInterceptor(
                    (req)=>{
                        return new Promise(function(resolve,reject){
                            resolve(req.session.rolelist);
                        });
                    }
                );
                test(checker, ['ROLE_X', 'ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有要求的全部角色，理应应该执行next()");
                    })
                    .then(done).catch(done);
            });

            it('使用自定义参数(异步callback式)进行初始化', function(done){
                req.session.rolelist = ['ROLE_1', 'ROLE_Y','ROLE_X',];
                const checker = new AuthorizationInterceptor(
                    (req,callback)=>{
                        setTimeout(function() {
                            callback(null,req.session.rolelist);
                        }, 100);
                    }
                );
                test(checker, ['ROLE_X', 'ROLE_Y'])
                    .then(executed=>{
                        assert.ok(executed, "拥有要求的全部角色，理应应该执行next()");
                    })
                    .then(done).catch(done);
            });
        });
 
    });


    describe('.requireTrue()',()=>{

        const test=(checker,fn)=>{
            const middleware = checker.requireTrue(fn);
            let executed=false; 
            return middleware(req, res, () => {
                executed = true;
            }).then(() => {
                return executed;
            });
        };
        
        describe("当fn返回值为真时:\t资源应可以被访问(必须执行next()方法)",function(){
            
            it('默认情况',function(done){
                const checker=new AuthorizationInterceptor();
                req.sth=true;
                test(checker)
                    .then(executed=>{
                        assert.ok(executed,"必须为真");
                    })
                    .then(done).catch(done);
            });

            it('传递返回值为真的函数(同步式)',function(done){
                const checker=new AuthorizationInterceptor();
                req.sth=true;
                test(checker,(req)=>{return req.sth;})
                    .then(executed=>{
                        assert.ok(executed,"必须为真");
                    })
                    .then(done).catch(done);
            });

            it('传递异步真的函数',function(done){
                const checker=new AuthorizationInterceptor();
                req.sth=true;
                function asyncFunc(req){
                    return Promise.resolve(req.sth);
                }
                test(checker,asyncFunc)
                    .then(executed=>{
                        assert.ok(executed,"必须为真");
                    })
                    .then(done).catch(done);
            });
       
        });

        describe("当fn返回值为假时:\t资源应不可被访问(必须跳过next()方法)",function(){
            
            it('传递返回值为假的函数(同步式)',function(done){
                const checker=new AuthorizationInterceptor();
                req.sth=false;
                test(checker,(req)=>{return req.sth;})
                    .then(executed=>{
                        assert.ok(!executed,"必不能执行");
                    })
                    .then(done).catch(done);
            });

            it('传递异步为假的函数(异步式)',function(done){
                const checker=new AuthorizationInterceptor();
                req.sth=false;
                const asyncFunc=function(req){
                    return Promise.resolve(req.sth);
                };
                test(checker,asyncFunc)
                    .then(executed=>{
                        assert.ok(!executed,"必不能执行");
                    })
                    .then(done).catch(done);
            });
       
        });
     
    });
});