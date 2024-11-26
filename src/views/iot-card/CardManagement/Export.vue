<template>
  <!-- 导入 -->
  <j-modal
      :maskClosable="false"
      :visible="true"
      title="导出"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="loading"
  >
    <div style="margin-top: 10px">
      <j-space>
        <span>文件格式：</span>
        <j-radio-group
            v-model:value="type"
            placeholder="请选择文件格式"
            button-style="solid"
        >
          <j-radio-button value="xlsx">xlsx</j-radio-button>
          <j-radio-button value="csv">csv</j-radio-button>
        </j-radio-group>
      </j-space>
    </div>
  </j-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import {_export} from '@/api/iot-card/cardManagement';
import {downloadFileByUrl} from '@/utils/utils';
import {paramsEncodeQuery} from "@/utils/encodeQuery";
import {LocalStore} from "@/utils/comm";
import {TOKEN_KEY} from "@/utils/variable";

const emit = defineEmits(['close']);

const props = defineProps({
  data: {
    type: Object,
    default: undefined,
  },
});

const type = ref<string>('xlsx');
const loading = ref<boolean>(false);

const handleOk = () => {
  loading.value = true
  const _params = paramsEncodeQuery(props.data);
  const urlParams = new URLSearchParams()

  Object.keys(_params).forEach(key => {
    if (_params[key]) {
      urlParams.append(key, _params[key])
    }
  })
  const url = `${origin}/api/network/card/download.${type.value}/_query?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&${urlParams}`
  window.open(url)
  loading.value = false
  emit('close');
  // _export(type.value, props.data).then((res: any) => {
  //   if (res) {
  //     const blob = new Blob([res.data], {type: type.value});
  //     const url = URL.createObjectURL(blob);
  //     downloadFileByUrl(
  //         url,
  //         `物联卡管理-${dayjs(new Date()).format(
  //             'YYYY/MM/DD HH:mm:ss',
  //         )}`,
  //         type.value,
  //     );
  //     emit('close');
  //   }
  // }).finally(() => {
  //   loading.value = false
  // })
};

const handleCancel = () => {
  emit('close');
};
</script>

<style scoped lang="less"></style>
