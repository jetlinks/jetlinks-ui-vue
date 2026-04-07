import standalone from '@jetlinks-web-core/assets/apply/internal-standalone.png'
import dingtalk from '@jetlinks-web-core/assets/bindPage/dingtalk.png'
import wechat from '@jetlinks-web-core/assets/bindPage/wechat-webapp.png'
import thirdParty from '@jetlinks-web-core/assets/apply/third-party.png'
import wechatMiniapp from '@jetlinks-web-core/assets/apply/wechat-miniapp.png'
import i18n from '@jetlinks-web-core/locales';
export const rules = {
  username: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject(i18n.global.t('login.right.419974-1'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  password: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject(i18n.global.t('login.right.419974-3'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  verifyCode: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject(i18n.global.t('login.right.419974-5'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

export const iconMap = new Map();
iconMap.set('dingtalk-ent-app', dingtalk);
iconMap.set('wechat-webapp', wechat);
iconMap.set('internal-standalone', standalone);
iconMap.set('third-party', thirdParty);
iconMap.set('wechat-miniapp', wechatMiniapp);

