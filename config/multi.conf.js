const path = require('path');
const pack = require('../package.json');
// const argvs = 

//多模块配置文件，定位各个模块自己的端口，名称，转发规则，静态资源
var importModules = [
    new MultiModule('wuye',{
        port:80,
        statics:['wuyestatic'],
        proxyTable:{
            '/servers1/':getProxyConfig(PROXY_DOMAIN_DEFAULT)
        }
    }),
    new MultiModule('home',{
        port:81,
        statics:['homestatic'],
        proxyTable:{
            '/servers2/':getProxyConfig(PROXY_DOMAIN_DEFAULT)   
        }
    }),
    new MultiModule('group',{
        port:83,
        statics:['groupstatic'],
        proxyTable:{
            '/servers3/':getProxyConfig(PROXY_DOMAIN_DEFAULT)   
        }
    }),
    new MultiModule('person',{
        port:84,
        statics:['personstatic'],
        proxyTable:{
            '/servers4/':getProxyConfig(PROXY_DOMAIN_DEFAULT)   
        }
    })
]