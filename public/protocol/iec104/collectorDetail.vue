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
        label: "分组地址",
        value: data.configuration?.terminnalAddress,
      },
      {
        label: "确认帧数量",
        value: data.configuration?.frameAmountMax,
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
