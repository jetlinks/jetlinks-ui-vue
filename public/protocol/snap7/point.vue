<template>
  <j-title :data="$lang('snap7.point.20250207-33')"/>
  <a-form-item
      :label="$lang('snap7.point.20250207-1')" :name="['configuration', 'daveArea']" :rules="{
                required: true,
                message: $lang('snap7.point.20250207-2'),
                trigger: 'change',
            }">
    <a-select
        v-model:value="formData.configuration.daveArea"
        show-search
        :placeholder="$lang('snap7.point.20250207-2')"
        :options="dataAreaFilterList"
        :fieldNames="{label: 'name', value: 'id'}"
        @change="daveAreaChange"
    >
    </a-select>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.point.20250207-3')" :name="['configuration', 'areaNumber']" v-show="showAreaNumber"
      :rules="{
                    required: true,
                    message: $lang('snap7.point.20250207-4'),
                    trigger: 'blur',
                }">
    <a-input-number v-model:value="formData.configuration.areaNumber" style="width: 100%"
                    :max="65535" autocomplete="off" :disabled="areaNumberDisabled"
                    :placeholder="$lang('snap7.point.20250207-4')"/>
  </a-form-item>
  <a-divider/>
  <j-title :data="$lang('snap7.point.20250207-34')"/>
  <a-form-item :label="$lang('snap7.point.20250207-5')" :name="['configuration', 'type']" :rules="{
                required: true,
                message: $lang('snap7.point.20250207-6'),
                trigger: 'change',
            }">
    <a-select v-model:value="formData.configuration.type" show-search
              :placeholder="$lang('snap7.point.20250207-6')"
              :options="dataTypesList"
              :fieldNames="{label: 'name', value: 'id'}"
              @change="chooseS7DataType">
    </a-select>
  </a-form-item>
  <a-form-item v-if="!showBytes"
               :label="$lang('snap7.point.20250207-7')" :name="['configuration', 'bytes']" :rules="{
                required: true,
                message: $lang('snap7.point.20250207-8'),
                trigger: 'blur',
            }">
    <a-input-number
        type="number" style="width: 100%"
        :addon-after="$lang('snap7.point.20250207-32')"
        v-model:value="formData.configuration.bytes"
        :placeholder="$lang('snap7.point.20250207-9')"
        :precision="0"
        :controls="false" :disabled="showBytes" :max="65535"
        :min="0"/>
  </a-form-item>
  <a-form-item v-if="formData.configuration.type === 'Bool'"
               :label="$lang('snap7.point.20250207-10')" :name="['configuration', 'bits']"
               :rules="{
                    required: true,
                    message: $lang('snap7.point.20250207-11'),
                    trigger: 'blur',
                }">
    <a-input-number
        type="number"
        style="width: 100%" :addon-after="$lang('snap7.point.20250207-29')"
        v-model:value="formData.configuration.bits"
        :placeholder="$lang('snap7.point.20250207-12')" :precision="0" :min="0" :max="7" :controls="false"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.point.20250207-13')" :name="['configuration', 'offset']" :rules="{
                required: true,
                message: $lang('snap7.point.20250207-14'),
                trigger: 'blur',
            }">
    <a-input-number type="number" style="width: 100%" v-model:value="formData.configuration.offset"
                    :placeholder="$lang('snap7.point.20250207-15')" :precision="0" :min="0" :max="65535"
                    :controls="false"/>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.point.20250207-16')"
      :name="['configuration', 'scaleFactor']"
      :rules="{
          required: true,
          message: $lang('snap7.point.20250207-17'),
      }"
  >
    <a-input-number
        type="number"
        style="width: 100%" v-model:value="formData.configuration.scaleFactor"
        :placeholder="$lang('snap7.point.20250207-17')"
        :min="0"
        :max="65535"
        :controls="false"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.point.20250207-18')" :name="['configuration', 'scale']"
  >
    <a-input-number type="number" style="width: 100%" v-model:value="formData.configuration.scale"
                    :placeholder="$lang('snap7.point.20250207-19')" :precision="0" :min="1" :max="65535"
                    :controls="false"/>
  </a-form-item>
  <a-divider/>
  <j-title :data="$lang('snap7.point.20250207-35')"/>
  <a-form-item
      :label="$lang('snap7.point.20250207-20')" name="accessModes" :rules="{
                required: true,
                message: $lang('snap7.point.20250207-21')
            }">
    <j-card-select :multiple="true" :showImage="false" v-model:value="formData.accessModes"
                   :options="accessModesOptions" :column="2"/>
  </a-form-item>
</template>
<script setup>
import {inject, ref, computed, toRaw, watch} from 'vue'
import {request} from '@jetlinks-web/core'
import {randomString} from "@jetlinks-web/utils";
import {useLocales} from '@hooks'

const {$lang} = useLocales('snap7')

const defaultValue = {
  type: undefined,
  interval: 3000,
  areaNumber: undefined,
  bytes: undefined,
  terms: [],
}

const formData = inject('plugin-form', {})
const collectorData = inject('plugin-form-collector', {})
const showDeathArea = inject('plugin-form-death-area-show', ref(false))

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

if (!('scaleFactor' in formData.configuration)) {
  formData.configuration.scaleFactor = 1
}

const deviceType = ref(collectorData.configuration?.type);
const dataTypesList = ref([]);
const daveAreaList = ref([]);

const accessModesOptions = computed(() => {
  return [
    {label: $lang('snap7.point.20250207-30'), value: 'read'},
    {label: $lang('snap7.point.20250207-31'), value: 'write'},
  ]
})

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

// const rules = {
//   terms: [{
//     validator(_, value) {
//       if (!value) {
//         return Promise.resolve
//       }
//       if (value.length === 0) {
//         return Promise.resolve()
//       } else if (value?.length === 1) {
//         return value[0].value && value[0].termType ? Promise.resolve() : Promise.reject($lang('snap7.point.20250207-27'));
//       } else {
//         if (value?.[0].column === 'currentValue') {
//           const pass = value.every((item) => item.termType && item.value)
//           return pass ? Promise.resolve() : Promise.reject($lang('snap7.point.20250207-27'))
//         } else {
//           value.forEach((item) => {
//             if (item.column === `this['currentValue'] - this['lastValue']*init/100`) {
//               return Promise.reject($lang('snap7.point.20250207-27'))
//             } else {
//               return Promise.resolve()
//             }
//           });
//         }
//
//       }
//     },
//     trigger: 'change',
//   }]
// }

const dataAreaFilterList = computed(() => {
  let result = daveAreaList.value.filter((item) =>
      dataAreaFilter[deviceType.value]?.includes(item.id),
  );
  if (deviceType.value === 'S200') {
    result.push({
      id: 'DB',
      name: $lang('snap7.point.20250207-28'),
      address: '',
    });
  }
  return result;
});

const showAreaNumber = computed(() => formData.configuration.daveArea === 'DB')

const areaNumberDisabled = computed(() => {
  return formData.configuration.daveArea === 'DB' && deviceType.value === 'S200'
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

watch(() => formData.configuration.type, (val) => {
  showDeathArea.value = val && ['Word', 'DWord', 'USInt', 'Byte', 'SInt', 'UInt', 'Int', 'UDInt', 'DInt', 'Real', 'LReal'].includes(val)
}, {
  immediate: true,
})

getTypes();
</script>
<style scoped>

</style>
