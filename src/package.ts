import {getToken, LocalStore, setToken} from "@jetlinks-web/utils";
import {BASE_API, TOKEN_KEY_URL} from "@jetlinks-web/constants";
import {crateAxios, wsClient} from '@jetlinks-web/core'
import {jumpLogin} from '@/router'
import {notification} from 'ant-design-vue'
import {langKey} from "@/utils/consts";
import Relogin from '@/views/relogin/index.vue'

/**
 * 初始化package
 */
export const initPackages = () => {

    /**
     * 初始化websocket
     */
    const token = getToken();

    if (!token) return

    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const host = document.location.host;
    const url = `${protocol}${host}${BASE_API}/messaging/${token}?${TOKEN_KEY_URL}=${token}`;
    // wsClient.setOptions({
    //     onError(message) {
    //         notification.error({
    //             key: 'ws-error',
    //             message: message.message,
    //             style: {
    //                 zIndex: 1090
    //             },
    //         });
    //     }
    // })
    wsClient.initWebSocket(url);
    wsClient.connect()
};

const _handleReconnect = async () => {
    // 如何监听弹窗是否关闭
    const modalWrapper = document.createElement('div');
    const modalApp = createApp(Relogin).mount(modalWrapper);
    document.body.appendChild(modalWrapper);
    return await modalApp?.open?.();
}
export const initAxios = () => {
    crateAxios(
        {
            langKey: langKey,
            isCreateTokenRefresh: true,
            tokenExpiration: () => {
                const token = getToken();
                if(!token){
                    jumpLogin()
                }
            },
            handleReconnect: _handleReconnect,
            filter_url: [
                '/system/version',
                '/system/config/front',
                '/authorize/captcha/config',
                '/authorize/captcha/image',
                '/application/sso/bind-code',
                '/authorize/login',
                '/application/',
                '/application/sso/_all',
            ],
            handleError: (description, key, err) => {
                if (!err.config?.hiddenError) {
                    notification.error({
                        style: {
                            zIndex: 1040
                        },
                        key: key as string,
                        message: '',
                        description
                    })
                }
            }
        },
    )
}


export const loadMicroApp = () => {
    (window as any).microApp?.addDataListener((data: any) => {

        if (data.token) {
            setToken(data.token)
        }

        if (data.appId) {
            LocalStore.set('appId', data.appId)
        }
    }, true)
}
