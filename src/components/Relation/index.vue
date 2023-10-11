<template>
  <j-drawer :visible="true" title="关系绑定" placement="right" @close="closeDrawer" :width="500">
    <j-tabs v-model:activeKey="activeKey" type="card" @change="getRelation">
      <j-tab-pane v-for="(item, index) in relationOptions" :key="item.id" :tab="item.name">

      </j-tab-pane>
    </j-tabs>
  </j-drawer>
</template>

<script lang="ts" setup>
import { queryTypes, queryRelation } from '@/api/relation'
const props = defineProps({
  type: {
    type: String,
    default: 'device'
  }
})
const activeKey = ref('user')
const relationOptions = ref()
const closeDrawer = () => {

}
const queryRelationOptions = () => {
  queryTypes().then((resp: any) => {
    if (resp.status === 200) {
      relationOptions.value = resp.result
    }
  })
}
const getRelation = (activeKey: string) => {
  queryRelation({
    paging: false,
    terms: [
      {
        terms: [{
          value: props.type,
          termType: "eq",
          column: "objectType",
          type: "and"
        },
        {
          value: activeKey,
          termType: "eq",
          column: "targetType",
        }]
      },
      {
        terms: [{
          value: activeKey,
          termType: "eq",
          column: "objectType",
          type: "and"
        },
        {
          value: props.type,
          termType: "eq",
          column: "targetType",
        }]
      }
    ]
  }).then((resq: any) => {

  })
}
queryRelationOptions()
</script>
<style lang="less" scoped></style>