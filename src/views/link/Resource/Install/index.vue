<template>
  <a-modal
      title="安装资源"
      visible
      @cancel="emits('close')"
      :maskClosable="false"
      :width="800"
      :footer="null"
  >
    <InstallIng v-if="taskList.length" :taskList="taskList"/>
    <List v-else-if="fileList.length" :source="source" v-model:value="fileList" @cancel="emits('close')" @refresh="getTaskList"/>
    <template v-else>
      <Init v-model:source="source" v-model:value="fileList"/>
    </template>
  </a-modal>
</template>

<script setup>
import Init from './components/Init.vue'
import List from './components/List.vue'
import InstallIng from './components/InstallIng.vue'
import {queryTaskListNoPaging} from "@/api/link/resource";

const emits = defineEmits(['close']);
const source = ref('')
const fileList = ref([]);
const taskList = ref([]);

const getTaskList = async () => {
  const resp = await queryTaskListNoPaging({
    "terms": [
      {
        "column": "state",
        "termType": "not",
        "value": "success"
      }
    ]
  })
  if (resp.success) {
    taskList.value = resp.result
  }
}

onMounted(() => {
  getTaskList()
})
</script>
<style lang="less" scoped>

</style>
