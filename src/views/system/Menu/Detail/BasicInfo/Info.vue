<template>
  <div>
    <a-form ref="formRef" :model="formModel" layout="vertical">
      <a-row type="flex">
        <a-col flex="186px">
          <a-form-item
            :label="$t('BasicInfo.Info.607342-0')"
            name="icon"
            :rules="[
              {
                required: true,
                message: $t('BasicInfo.Info.607342-1'),
                trigger: 'change',
              },
            ]"
          >
            <div class="icon-upload has-icon" v-if="formModel.icon">
              <AIcon :type="formModel.icon" style="font-size: 90px" />
              <span class="mark" @click="dialogVisible = true">{{ $t('BasicInfo.Info.607342-2') }}</span>
            </div>

            <div
              v-else
              @click="dialogVisible = true"
              class="icon-upload no-icon"
            >
              <span>
                <AIcon type="PlusOutlined" style="font-size: 30px" />
                <p>{{ $t('BasicInfo.Info.607342-3') }}</p>
              </span>
            </div>
          </a-form-item>
        </a-col>
        <a-col flex="auto">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                :label="$t('BasicInfo.Info.607342-4')"
                name="name"
                :rules="[
                  {
                    required: true,
                    message: $t('BasicInfo.Info.607342-5'),
                    trigger: 'change',
                  },
                  {
                    max: 64,
                    message: $t('BasicInfo.Info.607342-6'),
                    trigger: 'change',
                  },
                ]"
              >
                <a-input
                  v-model:value="formModel.name"
                  :placeholder="$t('BasicInfo.Info.607342-5')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="$t('BasicInfo.Info.607342-7')"
                name="code"
                :rules="[
                  {
                    required: true,
                    message: $t('BasicInfo.Info.607342-8'),
                    trigger: 'change',
                  },
                  {
                    max: 64,
                    message: $t('BasicInfo.Info.607342-6'),
                    trigger: 'change',
                  },
                  {
                    validator: checkCode,
                    trigger: 'blur',
                  },
                ]"
              >
                <a-input
                  v-model:value="formModel.code"
                  :placeholder="$t('BasicInfo.Info.607342-8')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="$t('BasicInfo.Info.607342-9')"
                name="url"
                :rules="[
                  { validator: checkUrl, trigger: 'blur' }
                ]"
              >
                <a-input
                  v-model:value="formModel.url"
                  :placeholder="$t('BasicInfo.Info.607342-10')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="$t('BasicInfo.Info.607342-12')"
                name="sortIndex"
                :rules="[
                  {
                    pattern: /^[0-9]*[1-9][0-9]*$/,
                    message: $t('BasicInfo.Info.607342-13'),
                  },
                ]"
              >
                <a-input-number
                  v-model:value="formModel.sortIndex"
                  :placeholder="$t('BasicInfo.Info.607342-14')"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <a-form-item :label="$t('BasicInfo.Info.607342-15')" name="describe">
        <a-textarea
          v-model:value="formModel.describe"
          :rows="4"
          show-count
          :maxlength="200"
          :placeholder="$t('BasicInfo.Info.607342-16')"
        />
      </a-form-item>
    </a-form>
    <!-- 弹窗 -->
    <ChooseIconDialog
      @close="dialogVisible = false"
      v-if="dialogVisible"
      @save="confirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ChooseIconDialog from '../../components/ChooseIconDialog.vue'
import { validMenuCode } from '@/api/system/menu'
import {OWNER_KEY} from "@/utils/consts";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute()
const formRef = ref<any>()

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
})

const routeParams = {
  id: route.params.id === ':id' ? undefined : (route.params.id as string),
  ...route.query,
  sortIndex: route.query.sortIndex,
  url: route.query.basePath,
  parentId: route.query.pid,
}

const formModel = reactive({
  id: routeParams.id,
  name: '',
  code: '',
  sortIndex: routeParams?.sortIndex || undefined,
  icon: '',
  describe: '',
  url: routeParams?.url || '',
})

const dialogVisible = ref<boolean>(false)

const confirm = (url: string) => {
  dialogVisible.value = false
  formModel.icon = url
}

const checkCode = async (_rule: any, value: string): Promise<any> => {
  if (!value) {
    return Promise.reject('')
  } else if (value.length > 64) {
    return Promise.reject($t('BasicInfo.Info.607342-6'))
  } else if (
    route.params.id &&
    route.params.id !== ':id' &&
    value === props.value?.code
  ) {
    // 编辑时不校验原本的编码
    return Promise.resolve('')
  } else {
    const resp: any = await validMenuCode({
      code: value,
      owner: OWNER_KEY,
    })
    if (resp.result.passed) return Promise.resolve()
    else return Promise.reject($t('BasicInfo.Info.607342-17'))
  }
}

const checkUrl = async (_rule: any, value: string): Promise<any> => {
  const reg = /^\//
  if (!value) {
    return Promise.reject($t('BasicInfo.Info.607342-10')) 
  }
  if(value && !reg.test(value)) {
    return Promise.reject($t('BasicInfo.Info.607342-18')) 
  } else if(value.length > 128) {
    return Promise.reject($t('BasicInfo.Info.607342-11'))
  } else {
    return Promise.resolve()
  }
}

watch(
  () => props.value,
  () => {
    Object.assign(formModel, props.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

const onSave = () =>
  new Promise((resolve, reject) => {
    formRef.value
      .validate()
      .then((_data) => {
        resolve({
          ...routeParams,
          ..._data,
        })
      })
      .catch(() => {
        reject(false)
      })
  })

defineExpose({ onSave })
</script>

<style lang="less" scoped>
.icon-upload {
  width: 160px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    border-color: #415ed1;
  }
}
.has-icon {
  position: relative;
  text-align: center;

  .mark {
    position: absolute;
    left: 0;
    top: 0;
    display: none;
    background-color: rgba(0, 0, 0, 0.35);
    color: #fff;
    width: 100%;
    height: 100%;
    font-size: 16px;
    align-items: center;
    justify-content: center;
  }
  &:hover .mark {
    display: flex;
  }
}
.no-icon {
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
