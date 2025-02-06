<template>
  <a-form-item label="地址区域" :name="['configuration', 'daveArea']" :rules="{
                required: true,
                message: '请选择地址区域',
                trigger: 'change',
            }">
    <a-select
      v-model:value="formData.configuration.daveArea"
      show-search
      placeholder="请选择地址区域"
      :options="dataAreaFilterList"
      :fieldNames="{label: 'name', value: 'id'}"
      @change="daveAreaChange"
    >
    </a-select>
  </a-form-item>
  <a-form-item label="地址编号" :name="['configuration', 'areaNumber']" v-show="showAreaNumber"
               :rules="{
                    required: true,
                    message: '请输入地址编号',
                    trigger: 'blur',
                }">
    <a-input-number v-model:value="formData.configuration.areaNumber" :maxlength="64" style="width: 100%"
                    :max="65535" autocomplete="off" :disabled="areaNumberDisabled"
                    placeholder="请输入地址编号" />
  </a-form-item>
  <a-form-item label="数据类型" :name="['configuration', 'type']" :rules="{
                required: true,
                message: '请选择数据类型',
                trigger: 'change',
            }">
    <a-select v-model:value="formData.configuration.type" show-search placeholder="请选择数据类型"
              :options="dataTypesList"
              :fieldNames="{label: 'name', value: 'id'}"
              @change="chooseS7DataType">
    </a-select>
  </a-form-item>

  <a-form-item v-if="!showBytes" label="字符串长度（byte）" :name="['configuration', 'bytes']" :rules="{
                required: true,
                message: '请输入0~65535之间的正整数',
                trigger: 'blur',
            }">
    <a-input-number type="number" style="width: 100%" addon-after="字节" v-model:value="formData.configuration.bytes"
                    placeholder="请输入字符串长度" :precision="0" :controls="false" :disabled="showBytes" :max="65535" :min="0" />
  </a-form-item>

  <a-form-item v-if="formData.configuration.type === 'Bool'" label="位偏移量（bit）" :name="['configuration', 'bits']"
               :rules="{
                    required: true,
                    message: '请输入0~7之间的正整数',
                    trigger: 'blur',
                }">
    <a-input-number type="number" style="width: 100%" addon-after="位" v-model:value="formData.configuration.bits"
                    placeholder="请输入位偏移量" :precision="0" :min="0" :max="7" :controls="false" :maxlength="2" />
  </a-form-item>

  <a-form-item label="偏移量" :name="['configuration', 'offset']" :rules="{
                required: true,
                message: '请输入0~65535之间的正整数',
                trigger: 'blur',
            }">
    <a-input-number type="number" style="width: 100%" v-model:value="formData.configuration.offset"
                    placeholder="请输入偏移量" :precision="0" :min="0" :max="65535" :controls="false" :maxlength="64" />
  </a-form-item>
  <a-form-item label="缩放因子" :name="['configuration', 'scaleFactor']">
    <a-input-number type="number" style="width: 100%" v-model:value="formData.configuration.scaleFactor"
                    placeholder="缩放因子" :min="0" :max="65535" :controls="false" :maxlength="64" />
  </a-form-item>
  <a-form-item label="小数保留位数" :name="['configuration', 'scale']">
    <a-input-number type="number" style="width: 100%" v-model:value="formData.configuration.scale"
                    placeholder="缩放因子" :precision="0" :min="1" :max="65535" :controls="false" :maxlength="64" />
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="{
                required: true,
                message: '请选择访问类型',
            }">
    <j-card-select :multiple="true" :showImage="false" v-model:value="formData.accessModes" :options="accessModesOptions" :column="2" />
  </a-form-item>
  <a-form-item label="轮询任务" :name="['configuration', 'interval']">
    <p>
      采集频率<span style="margin-left: 5px; color: #9d9ea1; font-size: 12px">采集频率为0时不执行轮询任务</span>
    </p>
    <a-input-number
      style="width: 100%"
      placeholder="请输入采集频率"
      v-model:value="formData.configuration.interval"
      addon-after="ms"
      :max="2147483648"
      :min="0"
    />
  </a-form-item>
  <a-form-item name="features">
    <a-checkbox-group v-model:value="formData.features">
      <a-checkbox value="changedOnly">只推送变化的数据</a-checkbox>
    </a-checkbox-group>
  </a-form-item>
</template>
<script setup>
import { inject, ref, computed, toRaw, defineProps } from 'vue'
import { request } from '@jetlinks-web/core'
import { randomString } from "@jetlinks-web/utils";

const defaultValue = {
  type: undefined,
  interval: 3000,
  areaNumber: undefined,
  bytes: undefined,
  terms: []
}

const formData = inject('plugin-form', {})
const collectorData = inject('plugin-form-collector', {})

Object.keys(defaultValue).forEach(key => {
  if (!toRaw(formData.configuration).hasOwnProperty(key)) {
    formData[key] = defaultValue[key]
  }
})

if (!('pointKey' in formData)) {
  formData.pointKey = randomString(9)
}
if (!('inheritBreaker' in formData)) {
  formData.inheritBreaker = true
}

const deviceType = ref(collectorData.configuration.type);
const dataTypesList = ref([]);
const daveAreaList = ref([]);

const accessModesOptions = [
  { label: '读', value: 'read' },
  { label: '写', value: 'write' },
]

const dataAreaFilter = {
  S200: [
    'RELAY',
    'HIGH_SPEED',
    'SYSTEM_FLAGS',
    'ANALOG_INPUTS',
    'ANALOG_OUTPUTS',
    'I',
    'Q',
    'M',
    'IEC_COUNTERS',
    'IEC_TIMERS',
  ],
  S1200: ['I', 'Q', 'M', 'DB'],
  S1500: ['I', 'Q', 'M', 'DB'],
  S300: ['I', 'Q', 'M', 'DB', 'C', 'T'],
  S400: ['I', 'Q', 'M', 'DB', 'C', 'T'],
};

const rules = {
  terms: [{
    validator(_, value) {
      if (!value) {
        return Promise.resolve
      }
      console.log('[validator] >',value)
      if (value.length === 0) {
        return Promise.resolve()
      } else if (value?.length === 1) {
        return value[0].value && value[0].termType ? Promise.resolve() : Promise.reject('请配置点位死区');
      } else {
        if (value?.[0].column === 'currentValue') {
          const pass = value.every((item) => item.termType && item.value)
          return pass ? Promise.resolve() : Promise.reject('请配置点位死区')
        } else {
          value.forEach((item) => {
            if (item.column === `this['currentValue'] - this['lastValue']*init/100`) {
              return Promise.reject('请配置点位死区')
            } else {
              return Promise.resolve()
            }
          });
        }

      }
    },
    trigger: 'change',
  }]
}

const dataAreaFilterList = computed(() => {
  let result = daveAreaList.value.filter((item) =>
    dataAreaFilter[deviceType.value]?.includes(item.id),
  );
  if (deviceType.value === 'S200') {
    result.push({
      id: 'DB',
      name: '变量存储区（V）',
      address: '',
    });
  }
  return result;
});

const showAreaNumber = computed(() => formData.configuration.daveArea === 'DB')

const areaNumberDisabled = computed(() => {
  return formData.configuration.daveArea === 'DB' && deviceType === 'S200'
})

const daveAreaChange = (val) => {
  formData.configuration.areaNumber = val === 'DB' ? 1 : 0;
}

const showBytes = ref(false)

const chooseS7DataType = (val, option) => {
  formData.configuration.bytes = option.length;
  showBytes.value = option.length !== 0;
};

/**
 * 获取地区信息
 */
const getAreaList = async () => {
  const res = await request.post('/data-collect/snap7/command/GetAreaInfoList');
  if (res.success) {
    daveAreaList.value = res.result;
  }
};
getAreaList();

/**
 * 获取数据编解码器
 */
const getTypes = async () => {
  const res = await request.post('/data-collect/snap7/command/GetCodecList');
  if (res.success) {
    dataTypesList.value = res.result;
  }
};
getTypes();

</script>
<style scoped>
.percent .percent-title {
  margin-right: 10px;
}
</style>
