<template>
  <div class="login">
    <div class="bg1" />
    <div class="gyl">
      物联网平台
      <div class="gy2">MQTT TCP CoAP HTTP , 多消息协议适配 , 可视化规则引擎</div>
    </div>
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit">
    <div class="bg">
      <div class="wel">用户登录</div>
      <div class="user">
        <div class="userLabel">用户名</div>
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder=""
            v-decorator="[
              'username',
              {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
            ]">
          </a-input>
        </a-form-item>
      </div>
      <div class="password">
        <div class="userLabel">密<span style="margin-left:1em" />码</div>
        <a-form-item>
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            placeholder=""
            v-decorator="[
              'password',
              {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
            ]">
          </a-input>
        </a-form-item>
      </div>
      <div class="rem">
        <a-form-item>
          <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">记住我</a-checkbox>
        </a-form-item>
      </div>

      <div class="btn-con">
        <a-form-item style="margin-top:256px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn">确定</a-button>
        </a-form-item>
      </div>
    </div>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {},
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.expires = values.rememberMe === 'checked' ? -1 : 3600000
          loginParams.tokenType = 'default'
          delete loginParams.rememberMe
          console.log('login form', loginParams)
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      console.log(res)
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
html,
body {
  width: 100%;
}

body {
  background: url(~@/assets/banner.jpeg) repeat;
  /* background-size: 100%; */
}

.login .bg1 {
  width: 100%;
  height: 237px;
  background: #347ebc;
  opacity: 0.6;
  position: absolute;
  left: 0;
  top: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
}

.login .gyl {
  width: 510px;
  height: 237px;
  color: #ffffff;
  font-size: 72px;
  position: absolute;
  left: 15%;
  top: 11%;

  bottom: 0px;
  margin: auto;
}

.login .gy2 {
  color: #fff;
  margin-left: 6px;
  font-size: 18px;
  margin-top: 10px;
}

.login .bg {
  width: 375px;
  height: 337px;
  background: #fff;
  position: relative;
  position: absolute;
  left: 56%;
  top: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
  z-index: 1;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
}

.login .password {
  position: absolute;
  width: 83%;
  top: 9.5rem;
  right: 2rem;
  display: flex;
}

.login .btn {
  position: absolute;
  top: 16rem;
  right: 2rem;
  border: none;
  color: #fff;
  width: 18.825rem;
  text-align: center;
  background-color: #347ebc;
  text-indent: 0rem;
}

.login .img {
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: -1;
}

.login .wel {
  width: 375px;
  height: 35px;
  color: #347ebc;
  font-size: 1.5rem;
  position: absolute;
  top: 2rem;
  text-align: center;
}

.login input {
  border: none;
  border: 0px;
  border-bottom: 0.0625rem solid #347ebc;
  height: 2.5625rem;
  width: 16.8rem;
  text-indent: 1.125rem;
  outline: none;
}

.user {
  position: absolute;
  width: 83%;
  top: 5.5rem;
  right: 2rem;
  display: flex;
}

.rem {
  position: absolute;
  top: 13rem;
  right: 17rem;
  border: none;
  color: #323333;
}

.rem input {
  width: 0.8125rem;
}

.fg {
  position: absolute;
  top: 12.5rem;
  right: 2.5rem;
  border: none;
  color: #323333;
}

.userLabel {
  border-bottom: 1px solid #347ebc;
  height: 41px;
  line-height: 41px;
}
.ant-input-affix-wrapper .ant-input{
  border: none;
  border-bottom: 1px solid #347ebc;
}
.reb {
  margin-top: -33px;
  margin-left: 20px;
  font-size: 11px;
}

@media (min-width: 1201px) and (max-width: 1500px) {
  .gyl {
    width: 420px;
    font-size: 60px;
    top: 16%;
  }
}

@media (min-width: 800px) and (max-width: 1200px) {
  .bg {
    width: 355px;
    height: 300px;
  }

  .gyl {
    font-size: 50px;
  }

  .wel {
    width: 355px;
  }

  .user {
    top: 5rem;
    right: 3.5rem;
  }

  .password {
    top: 8rem;
    right: 3.5rem;
  }

  input {
    width: 12rem;
  }

  .rem {
    top: 11rem;
    right: 14.3rem;
  }

  .fg {
    top: 11rem;
    right: 3.5rem;
  }

  .btn {
    top: 14rem;
    width: 15rem;
  }
}

.user-layout-login {
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 89%;
    margin-left: 20px;
  }
  .btn-con{
    width: 100%;
  }
}
</style>
