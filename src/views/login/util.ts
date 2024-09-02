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
