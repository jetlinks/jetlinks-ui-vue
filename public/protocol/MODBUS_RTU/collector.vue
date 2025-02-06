<template>
  <a-form-item label="从机地址" :name="['configuration', 'unitId']" :rules="rules.unitId">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.unitId" placeholder="请输入从机地址" min="0"
                    max="255" :maxlength="64" />
  </a-form-item>
  <a-form-item :name="['configuration', 'endian']" :rules="rules.endian" label="双字高低位切换">
    <j-card-select :showImage="false" v-model:value="formData.configuration.endian" :options="options" :column="2" />
  </a-form-item>
  <a-form-item :name="['configuration', 'endianIn']" :rules="rules.endianIn" label="单字高低位切换">
    <j-card-select :showImage="false" v-model:value="formData.configuration.endianIn" :options="options" :column="2" />
  </a-form-item>
  <div style="color: #616161">
    <p>当前内存布局: {{ endianData }}</p>
    <p>
      只有4字节数据类型(int32、ieee754 float)
      具有4种内存布局，其它只有ABCD、DCBA两种内存布局(以双字配置为准)
    </p>
  </div>
</template>

<script setup>
import {inject, computed} from "vue";

const formData = inject("plugin-form");
if (!('configuration' in formData)) {

  formData.configuration = {
    unitId: undefined,
    endian: 'BIG',
    endianIn: 'BIG',
    port: undefined,
    host: undefined,
  }
}

const options = [
  { label: 'AB', value: 'BIG' },
  { label: 'BA', value: 'LITTLE' },
]

const regIP = new RegExp(
  /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
);
const regIPv6 = new RegExp(
  /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
);
const regDomain = new RegExp(
  /([0-9a-z-]{2,}\.[0-9a-z-]{2,3}\.[0-9a-z-]{2,3}|[0-9a-z-]{2,}\.[0-9a-z-]{2,3})$/i,
);

const checkHost = (_rule, value) =>
  new Promise(async (resolve, reject) => {
    if (!value) return resolve('');
    if (!(regIP.test(value) || regIPv6.test(value) || regDomain.test(value))) {
      return reject('请输入正确格式的Modbus主机IP地址')
    }
    return resolve('')
  });

const rules = {
  unitId: [
    { required: true, message: '请输入从机地址', trigger: 'blur' },
    {
      pattern: new RegExp(/^\d+$/),
      message: '请输入0-255之间的正整数',
    },
  ],
  endian: [
    { required: true, message: '请选择双字高低位切换', trigger: 'blur' },
  ],
  endianIn: [
    { required: true, message: '请选择单字高低位切换', trigger: 'blur' },
  ],
  host: [
    {
      required: true,
      message: '请输入Modbus主机IP',
    },
    {
      validator: checkHost,
      trigger: 'blur',
      // message: '请输入正确格式的Modbus主机IP地址',
    },
  ],
  port: [
    {
      required: true,
      message: '请输入端口',
    },
    {
      pattern: new RegExp(/^\d+$/),
      message: '请输入0-65535之间的正整数',
    },
  ],
}

const endianData = computed(() => {
  const { endian, endianIn } = formData.configuration || {};
  if (endian) {
    if (endianIn) {
      if (endian === 'BIG') {
        return endianIn === 'BIG' ? 'ABCD' : 'BADC';
      } else {
        return endianIn === 'BIG' ? 'CDAB' : 'DCBA';
      }
    } else {
      return endian === 'BIG' ? 'ABCD' : 'DCBA';
    }
  }
});

</script>

<style scoped>
</style>