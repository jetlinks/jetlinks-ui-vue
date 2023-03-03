import { defineStore } from 'pinia';
import { authLogin, userDetail } from '@/api/login';
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: () => ({
        userInfos: {
            id: '',
            username: '',
            isAdmin: true,
            currentAuthority: [],
            expires: 0,
            permissions: [],
            roles: [],
            token: '',
            user: {},
        },
        alarmUpdateCount: 0
    }),
    
    actions: {
        login(userInfo: any) {
            const username = userInfo.userName.trim();
            const password = userInfo.password;
            const verifyCode = userInfo.verifyCode;
            return new Promise((resolve: any, reject: any) => {
                authLogin({ username, password, verifyCode })
                    .then((res: any) => {
                        Object.assign(this.userInfos, res.result);
                        LocalStore.set(TOKEN_KEY, res?.result.token);
                        resolve(res);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getUserInfo() {
            return new Promise((res, rej) => {
                userDetail().then(resp => {
                    if (resp.success) {
                        res(true)
                        this.userInfos = resp.result
                    } else {
                        rej()
                    }
                }).catch(() => rej())
            })
        },
        updateAlarm(){
            this.alarmUpdateCount += 1
        }
    },
});
