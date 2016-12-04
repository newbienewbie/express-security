const assert=require('assert');
const AuthenticationChecker=require('../lib/authentication-checker');



describe('测试 AuthenticationChecker 类',()=>{

    // 模拟 req、res、next
    // 第一组：
    let req={ session:{ username:'', roles:[]} };
    let res={ send:()=>{ } };
    let next=()=>{};

    describe('.requireLogin()',()=>{

        const test=(checker)=>{
            let executed=false;
            const middleware=checker.requireLogin();
            return middleware(req,res,()=>{
                executed=true;
            }).then(()=>{
                return executed;
            });
        };
        describe("当username=假 时:\t资源不可访问(跳过next()方法)",function(){

            it('以默认参数进行初始化',(done)=>{
                const checker=new AuthenticationChecker();
                const promises=["",undefined,null].map(e=>{
                    req.session.username=e;
                    return test(checker)
                        .then(executed=>{
                            assert.ok(!executed,'username=假，next()方法不应该被执行');
                        });
                });
                Promise.all(promises).then(()=>{
                    done();
                }).catch(done);
            });
            
            it('自定义配置(同步式)',(done)=>{

                const promises=["",undefined,null].map(e=>{
                    req.session.user=e;
                    const checker=new AuthenticationChecker(
                        (req)=>{return !! req.session.user;}
                    );
                    return test(checker)
                        .then((executed)=>{
                            assert.ok(!executed,'username=假，next()方法不应该被执行');
                        });
                });

                Promise.all(promises).then(()=>{done();}).catch(done);
            });
                      
            it('自定义配置(异步式)',(done)=>{

                const promises=["",undefined,null].map(e=>{
                    req.session.user=e;
                    const checker=new AuthenticationChecker(
                        (req)=>{
                            return new Promise(function(resolve,reject){
                                resolve(!! req.session.user); 
                            });
                        }
                    );
                    return test(checker)
                        .then((executed)=>{
                            assert.ok(!executed,'username=假，next()方法不应该被执行');
                        });
                });

                Promise.all(promises).then(()=>{done();}).catch(done);
            });
        });
        describe('username=普通字符串 时:\t资源可以访问(执行next()方法)',()=>{

            it("以默认参数进行初始化",function(done){
                const checker=new AuthenticationChecker();
                req.session.username="hello";
                test(checker)
                    .then(executed=>{
                        //期待executed为true
                        assert.ok(executed,'普通字符串的用户名，理应执行next()');
                    })
                    .then(done)
                    .catch(done);
            });

            it('自定义配置(同步式)', function(done){
                const promises=[" ", 0x00af, "\x00ab","admin"].map(e => {
                    req.session.user = e;
                    const checker = new AuthenticationChecker(
                        (req) => { return !!req.session.user; }
                    );
                    return test(checker)
                        .then((executed)=>{
                            assert.ok(executed,`用户名=${e}，理应执行next(),然而executed=${executed}`);
                        });
                });
                Promise.all(promises).then(()=>{done();}).catch(done);
            });
            
            it('自定义配置(异步式)', function(done){
                const promises=[" ", 0x00af, "\x00ab","admin"].map(e => {
                    req.session.user = e;
                    const checker = new AuthenticationChecker(
                        (req) => { 
                            return new Promise(function(resolve,reject){
                                resolve(!!req.session.user);
                            })
                        }
                    );
                    return test(checker)
                        .then((executed)=>{
                            assert.ok(executed,`用户名=${e}，理应执行next(),然而executed=${executed}`);
                        });
                });
                Promise.all(promises).then(()=>{done();}).catch(done);
            });
           
        });
        
    });
    

});