import standalone from '@/assets/apply/internal-standalone.png'
import dingtalk from '@/assets/bindPage/dingtalk.png'
import wechat from '@/assets/bindPage/wechat-webapp.png'
import thirdParty from '@/assets/apply/third-party.png'
import wechatMiniapp from '@/assets/apply/wechat-miniapp.png'

export const rules = {
  username: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject('请输入账号!')
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
          return Promise.reject('请输入密码!')
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
          return Promise.reject('请输入验证码!')
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

