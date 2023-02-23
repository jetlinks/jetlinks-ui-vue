export type applyType = 'internal-standalone'
    | 'wechat-webapp'
    | 'internal-integrated'
    | 'dingtalk-ent-app'
    | 'third-party'

export type formType = {
    name: string;
    provider: applyType;
    integrationModes: string[];
    config: string;
    description: string;
    page: {
        baseUrl:string,
        routeType:'hash' | 'history'
    },
    apiClient: {
        baseUrl: string,
        authConfig: {
            type:string,
            oauth2 :{
                authorizationUrl:string,
                tokenUrl: string,
                redirectUri:string,
                clientId:string,
                clientSecret:string
            }
        }
    }
}