<template>
  <div>
    <div class="allDlt">
      <PermissionButton type="primary" :popConfirm="{
        title: `确定删除吗？?`,
        placement: 'bottomRight',
        onConfirm: allDelete,
      }" :hasPermission="true" placement="topRight">一键删除</PermissionButton>
    </div>

    <TabComponent :id="id" :type="type" />
  </div>
</template>
 
<script lang="ts" setup>
import TabComponent from '@/views/rule-engine/Alarm/Log/TabComponent/index.vue'
import { useRoute } from 'vue-router';
import {
  dltAllAlarmHistory
} from '@/api/rule-engine/log';
import { message } from 'ant-design-vue';
const route = useRoute();
const id = route.query?.id as string

const props = defineProps({
  type: {
    type: String,
    default: 'detail'
  }
})
const allDelete = () => {
  dltAllAlarmHistory(id).then(res => {
    if (res.status === 200) {
      message.success('删除成功,请手动重置，刷新列表')
    }
  })
}
</script>
<style lang="less" scoped>
.allDlt {
  text-align: right;
}
</style>