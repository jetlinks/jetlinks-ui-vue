<template>
  <page-container>
    <search
      :columns='columns'
    />
    <j-table
      :columns='columns'
    >
      <template #headerTitle>
        <a-space>
          <a-button type="primary" @click="visible = true">新增</a-button>
        </a-space>
      </template>
    </j-table>
    <SaveModal v-if='visible' @close='visible = false'/>
  </page-container>
</template>

<script setup lang='ts'>
import SaveModal from './Save/save.vue'
import type { SceneItem } from './typings'
import { useMenuStore } from 'store/menu'

const menuStory = useMenuStore()
const visible = ref<boolean>(false)

const columns = [
  {
    dataIndex: 'name',
    fixed: 'left',
    ellipsis: true,
    width: 300,
    title: '名称',
    search: {
      type: 'string'
    }
  },
  {
    dataIndex: 'triggerType',
    title: '触发方式',
    search: {
      type: 'select',
      options: [
        { label: '手动触发', value: 'manual'},
        { label: '定时触发', value: 'timer'},
        { label: '设备触发', value: 'device'}
      ]
    }
  },
  {
    dataIndex: 'description',
    title: '说明',
  },
  {
    dataIndex: 'state',
    title: '状态',
    search: {
      type: 'select',
      options: [
        { label: '正常', value: 'started'},
        { label: '禁用', value: 'disable'},
      ]
    }
  }
]

/**
 * 编辑
 * @param id
 * @param triggerType 触发类型
 */
const handleEdit = (id: string, triggerType: string) => {
  menuStory.jumpPage('Scene/Save', { }, { triggerType: triggerType, id, type: 'edit' })
}

/**
 * 查看
 * @param id
 * @param triggerType 触发类型
 */
const handleView = (id: string, triggerType: string) => {
  menuStory.jumpPage('Scene/Save', { }, { triggerType: triggerType, id, type: 'view' })
};
</script>

<style scoped>

</style>