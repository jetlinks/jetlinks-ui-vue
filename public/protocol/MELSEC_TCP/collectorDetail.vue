<script setup>
import { inject, watch } from "vue";

const { addList, data } = inject("detail-context");

const handleData = (dt) => {
  if (dt?.id) {
    const list = [
      {
        label: "从机地址",
        value: data.configuration?.host,
      },
      {
        label: "从机端口",
        value: data.configuration?.port,
      },
      {
        label: "帧(数据通信报文)类型",
        value: data.configuration?.frameType,
      },
    ];
    addList?.(list);
  }
};

watch(
  () => JSON.stringify(data),
  () => {
    handleData(data);
  },
  {
    immediate: true,
  }
);
</script>
