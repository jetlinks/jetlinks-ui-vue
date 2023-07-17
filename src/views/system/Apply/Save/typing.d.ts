export type applyType = 'internal-standalone'
    | 'wechat-webapp'
    | 'internal-integrated'
    | 'dingtalk-ent-app'
    | 'third-party'
    | 'wechat-miniapp'
export type dictType = {
    id: string;
    name: string;
    children?: dictType
}[];

export type optionsType = {
    label?: string;
    key?: string;
    value: string;
    disabled?: boolean;
    required?: boolean;
}[]
export type formType = {
    id?:string,
    name: string;
    provider: applyType | undefined;
    logoUrl: string | undefined,
    integrationModes: string[];
    config?: string;
    description: string;
    page: { // 页面集成
        baseUrl: string,
        routeType: 'hash' | 'history',
        parameters: optionsType,
        configuration: any
    },
    apiClient: { // API客户端
        baseUrl: string, // 接口地址	
        headers: optionsType, // 请求头	
        parameters: optionsType, // 请求参数	
        authConfig: { // 认证配置	
            type: 'none' | 'bearer' | 'oauth2' | 'basic' | 'other', // 类型, 可选值：none, bearer, oauth2, basic, other
            bearer: { token: string }, // 授权信息	
            basic: { username: string, password: string }, // 基本信息	
            token?: string,
            oauth2: { // OAuth2信息
                authorizationUrl: string, // 授权地址	
                tokenUrl: string, // token地址	
                redirectUri: string, // 重定向地址	
                clientId: string, // 客户端ID	
                clientSecret: string, // 客户端密钥
                grantType: 'authorization_code' | 'client_credentials' | '', // 类型
                accessTokenProperty: string, // token属性名	
                tokenRequestType: 'POST_URI' | 'POST_BODY' | '' | undefined // token请求方式, 可选值：POST_URI，POST_BODY
            }
        }
    },
    apiServer: { // API服务
        appId: string,
        secureKey: string, // 密钥
        redirectUri: string, // 重定向URL	
        roleIdList: string[], // 角色列表	
        orgIdList: string[], // 部门列表	
        ipWhiteList: string, // IP白名单	
        signature?: 'MD5' | 'SHA256' | '', // 签名方式, 可选值：MD5，SHA256
        enableOAuth2: boolean, // 是否启用OAuth2	
    },
    sso: { // 统一单点登陆集成
        configuration: { // 配置
            oauth2: { // Oauth2单点登录配置
                type?: string, // 认证方式
                authorizationUrl: string, // 授权地址	
                redirectUri: string, // 重定向地址	
                clientId: string, // 客户端ID	
                clientSecret: string, // 客户端密钥	
                userInfoUrl: string, // 用户信息接口	
                scope: string, // scope
                logoUrl?:string, // logo
                userProperty: { // 用户属性字段信息	
                    userId: string, // 用户ID	
                    username: string, // 用户名	
                    name: string, // 名称
                    avatar: string, // 头像	
                    email: string, // 邮箱	
                    telephone: string, // 电话
                    description: string, // 说明
                },
                grantType: 'authorization_code' | 'client_credentials' | '', // 类型	
                tokenUrl: string, // token地址	
                accessTokenProperty: string, // token属性名	
                tokenRequestType: 'POST_URI' | 'POST_BODY' | '', // token请求方式	
            },
            appId: string, // 微信单点登录配置
            appKey: string, // 钉钉单点登录配置
            appSecret: string, // 钉钉、微信单点登录配置
        },
        autoCreateUser: boolean, // 是否自动创建平台用户
        usernamePrefix: string, // 用户ID前缀
        roleIdList: string[], // 自动创建平台用户时角色列表	
        orgIdList: string[], // 自动创建平台用户时部门列表	
        defaultPasswd: string, // 默认密码
    }
}