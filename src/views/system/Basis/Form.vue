<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :scrollToFirstError="true"
    layout="vertical"
  >
    <div class="form-container">
      <div class="form-left">
        <a-form-item :label="$t('Basis.Form.436809-0')" name="title">
          <a-input
            v-model:value="formData.title"
            :placeholder="$t('Basis.Form.436809-1')"
          />
        </a-form-item>
        <a-form-item :label="$t('Basis.Form.436809-2')" name="headerTheme">
          <a-select v-model:value="formData.headerTheme" :options="headerThemeAreas">
          </a-select>
        </a-form-item>
        <!-- 高德地图API Key输入框 <AIcon type="QuestionCircleOutlined" /> -->

        <a-form-item name="webKey">
          <template #label>
            <a-space>
              <span>{{ $t('Basis.Form.436809-3') }} </span>
              <a-tooltip
                :title="$t('Basis.Form.436809-4')"
              >
                <AIcon type="QuestionCircleOutlined"/>
              </a-tooltip>
            </a-space>
          </template>
          <a-input v-model:value="formData.webKey" :placeholder="$t('Basis.Form.436809-5')"></a-input>
        </a-form-item>
        <a-form-item name="apiKey">
          <template #label>
            <a-space>
              <span>{{ $t('Basis.Form.436809-6') }}</span>
              <a-tooltip :title="$t('Basis.Form.436809-7')">
                <AIcon type="QuestionCircleOutlined"/>
              </a-tooltip>
            </a-space>
          </template>
          <a-input v-model:value="formData.apiKey" :placeholder="$t('Basis.Form.436809-8')"></a-input>
        </a-form-item>
        <a-form-item>
          <template #label>
            <a-space>
              <span>{{ $t('Basis.Form.436809-9') }}</span>
              <a-tooltip
                :title="$t('Basis.Form.436809-10')"
              >
                <AIcon type="QuestionCircleOutlined"/>
              </a-tooltip>
            </a-space>
          </template>
          <a-input
            v-model:value="formData.secretKey"
            :placeholder="$t('Basis.Form.436809-11')"
          />
        </a-form-item>
        <!-- base-path输入框 -->
        <a-form-item name="base-path">
          <template #label>
            <a-space>
              <span>base-path</span>
              <a-tooltip>
                <template #title>
                  <div style="word-break: break-all">
                    <div>{{ $t('Basis.Form.436809-12') }}</div>
                    <div>
                      {{ $t('Basis.Form.436809-13') }}{http/https}:
                      //{前端所在服务器IP地址}:{前端暴露的服务端口}/api
                    </div>
                  </div>
                </template>
                <AIcon type="QuestionCircleOutlined"/>
              </a-tooltip>
            </a-space>
          </template>
          <a-input v-model:value="formData['base-path']" :placeholder="$t('Basis.Form.436809-14')"></a-input>
        </a-form-item>
        <a-form-item
            name="showRecordNumber"
            :label="$t('Basis.Form.436809-24')"
            :required="true"
        >
          <a-switch
              v-model:checked="formData.showRecordNumber"
          ></a-switch>
        </a-form-item>
        <a-form-item
            v-if="formData.showRecordNumber"
            name="recordNumber"
            :label="$t('Basis.Form.436809-25')"
            :rules="[
                        {
                            required: true,
                            message: $t('Basis.Form.436809-26'),
                            trigger: 'blur',
                        },
                    ]"
        >
          <a-input v-model:value="formData.recordNumber" :placeholder="$t('Basis.Form.436809-26')"></a-input>
        </a-form-item>
        <!-- {{ $t('Basis.Form.436809-15') }} 和 浏览器标签 -->
        <a-row :gutter="24">
          <!-- {{ $t('Basis.Form.436809-15') }} -->
          <a-col :span="12">
            <a-form-item :label="$t('Basis.Form.436809-15')">
              <Upload v-model:img-src="formData.logo" uploadType="logo"/>
            </a-form-item>
          </a-col>
          <!-- {{ $t('Basis.Form.436809-16') }}icon -->
          <a-col :span="12">
            <a-form-item :label="$t('Basis.Form.436809-16')">
              <Upload v-model:img-src="formData.ico" uploadType="ico"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 保存按钮 -->
        <a-form-item v-if="showBtn">
          <j-permission-button hasPermission="system/Basis:update" html-type="submit" type="primary" @click="submit">
            {{ $t('Basis.Form.436809-17') }}
          </j-permission-button>
        </a-form-item>
      </div>
      <!-- 表单右侧部分 -->
      <div class="form-right">
        <div class="form-right-background">
          <a-form-item :label="$t('Basis.Form.436809-18')" name="background">
            <Upload v-model:img-src="formData.background" height="400px" uploadType="background" width="550px"/>
          </a-form-item>
        </div>
      </div>
    </div>
  </a-form>
</template>

<script lang="ts" name="BasicForm" setup>
import {reactive, ref} from 'vue'
import type {formDataType} from '@/views/system/Basis/typing'
import {useRequest} from '@jetlinks-web/hooks';
import {save_api} from '@/api/system/basis';
import {useSystemStore} from '@/store/system';
import Upload from '@/views/system/Basis/components/upload/upload.vue'
import {onlyMessage} from '@jetlinks-web/utils';
import {omit} from "lodash-es";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  hideSubmitBtn: {
    type: Boolean,
    default: false
  }
})

const system = useSystemStore()
// 表单数据
const formData = reactive<formDataType>({
  title: "",  // 系统名称
  headerTheme: "light",  // 主题色
  apiKey: "",  // 高德API Key
  webKey: "", // 高德web key
  secretKey: "", // 高德web key
  'base-path': `${window.location.origin}/api`,  // base-path
  logo: "/images/login/logo.png",  // 系统logo
  ico: "/favicon.ico",  // 浏览器页签
  background: "/images/login/login.png"  // 登录背景图
})

const formRef = ref()

const showBtn = computed(() => {
  return props.hideSubmitBtn === false
})
// 表单验证规则
const formRules = {
  // 系统名称输入框验证规则
  title: [
    {
      required: true,
      message: $t('Basis.Form.436809-1'),
      trigger: 'blur'
    },
    {
      max: 64,
      message: $t('Basis.Form.436809-19')
    }
  ],
  // 主题色验证规则
  headerTheme: [
    {
      required: true,
    }
  ],
  'base-path': [
    {
      required: true,
      message: $t('Basis.Form.436809-20'),
      trigger: "blur"
    }
  ]
}

// 主题色下拉框选项
const headerThemeAreas = ref([
  {label: $t('Basis.Form.436809-21'), value: 'light'},
  {label: $t('Basis.Form.436809-22'), value: 'dark'}
])


// 修改系统信息
const getDetails = async () => {
  await system.queryInfo()
  const configInfo = system.systemInfo;

  Object.assign(formData, {
    title: configInfo.front?.title,
    headerTheme: configInfo.front?.headerTheme || 'light',
    logo: configInfo.front?.logo || '/logo.png',
    ico: configInfo.front?.ico || '/favicon.ico',
    showRecordNumber: configInfo.front?.showRecordNumber || false,
    recordNumber: configInfo.front?.recordNumber,
    background: configInfo.front?.background || '/images/login.png',
    apiKey: configInfo.amap?.apiKey,
    webKey: configInfo.amap?.webKey,
    secretKey: configInfo.amap?.secretKey,
    'base-path': configInfo.paths?.['base-path'],
  })
}

// 回显数据
onMounted(() => {
  getDetails()
})

// 保存请求
const {run} = useRequest(save_api, {
  immediate: false,
  onSuccess(res) {
    if (res.success) {
      onlyMessage($t('Basis.Form.436809-23'), 'success')
      getDetails()
    }
  }
})

// 提交表单
const submit = () => {
  return new Promise((resolve, reject) => {
    formRef.value.validate().then(() => {
      const params = [
        {
          scope: 'front',
          properties: omit(formData, [
            'apiKey',
            'webKey',
            'secretKey',
            'base-path',
          ])
        },
        {
          scope: 'amap',
          properties: {
            apiKey: formData.apiKey,
            webKey: formData.webKey,
            secretKey: formData.secretKey,
          },
        },
        {
          scope: 'paths',
          properties: {
            'base-path': formData['base-path'],
          },
        },
      ]
      run(params).then(resp => {
        resolve(true)
      }).catch(() => {
        reject(false)
      })
    }).catch((e) => {
      reject(e)
      return false
    })
  })
}

defineExpose({
  submit
})

</script>

<style lang="less" scoped>
.form-container {
  display: flex;
  overflow-y: auto;

  .form-left {
    height: inherit;
    width: 50%;
  }

  .form-right {
    padding-left: 12px;
    width: 50%;

    .form-right-bgImage {
      width: 100%;

      .bgImage-div {
        width: 550px;
        height: 400px;
      }
    }
  }
}
</style>
