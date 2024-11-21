<template>
  <a-button style="width: 100%" @click="show">
    点击配置标签筛选范围
  </a-button>
    <a-modal
      v-model:visible="visible"
      title="标签筛选"
      :width="600"
      @cancel="visible = false"
      @ok="submitSearch"
    >
      <div class="header">
        <a-space :size="16">
          <span class="title">筛选项</span>
          <AIcon type="ReloadOutlined" @click="onInit" />
        </a-space>
      </div>
      <div class="tags-list">
        <div class="tags-item" v-for="(item, index) in list" :key="item.id">
          <div class="action">
            <a-button danger @click="onDelete(index)" :disabled="list.length === 1">
              <template #icon>
                <AIcon type="DeleteOutlined"/>
              </template>
            </a-button>
          </div>
          <div style="width: 200px">
            <a-select
              v-model:value="item.key"
              allow-clear
              :options="options"
              :field-names="{
                  label: 'name',
                  value: 'key'
                }"
              placeholder="请选装标签"
              style="width: 100%"
              @change="(key, option) => onTermsChange(key, option, index)"
            />
          </div>
          <div class="value" style="flex: 1 1 0;min-width: 0">
            <ValueItem v-model="item.value" :itemType="item.componentType" placeholder="标签值" />
          </div>
          <div class="type">
            <a-button v-if="index === list.length -1" @click="onAdd">
              <template #icon>
                <AIcon type="PlusOutlined"/>
              </template>
            </a-button>
            <a-select
              v-else
              v-model:value="item.type"
              :options="[
                { label: '并且', value: 'and'},
                { label: '或者', value: 'or'},
              ]"
            />
          </div>

        </div>
      </div>

    </a-modal>
</template>

<script setup>
import { useRequest } from '@/hook'
import { tagsList } from '@/api/device/instance'
import { randomString } from '@/utils/utils'
import {cloneDeep} from "lodash-es";

const emit =  defineEmits(['change','update:value'])

const list = ref([
  {
    id: randomString(8),
    key: undefined,
    value: undefined,
    componentType: 'string',
    type: 'and'
  },
  {
    id: randomString(8),
    key: undefined,
    value: undefined,
    componentType: 'string',
    type: 'and'
  },
  {
    id: randomString(8),
    key: undefined,
    value: undefined,
    componentType: 'string',
    type: 'and'
  },
])

const { data: options, run } = useRequest(tagsList,
  {
    immediate: false
})

const visible = ref(false);
const presentation = ref('');
let listCache = []
const show = () => {
  visible.value = true;

  if (listCache.length) {
    list.value = cloneDeep(listCache)
  }
  run()
};

const onAdd = () =>{
  list.value.push({
      id: randomString(8),
      key: undefined,
      value: undefined,
      componentType: 'string',
      type: 'and'
    })
}

const onDelete = (index) =>{
  list.value.splice(index,1)
}

const submitSearch = () => {

    const resultFilter = list.value.filter(item => item.key)
    listCache = cloneDeep(list.value)
    let result =[]

    if (resultFilter.length) {
        result = resultFilter.reduce((prev, next, index) => {
          const newItem = {
            column: 'id$dev-tag',
            type: index === 0 ? next.type : resultFilter[index - 1].type,
            value: [{
              key: next.key,
              value: next.value,
            }]
          }
          prev.push(newItem)
          return prev
        }, [])
    }

    emit('update:value',result)
    emit('change')
    visible.value = false
}

const onTermsChange = (key, option, index) => {
  if (key) {
    list.value[index].componentType = option.type
  } else {
    list.value[index].componentType = "string"
    list.value[index].value = undefined
  }
}

const onInit = () => {
  list.value = [
    {
      id: randomString(8),
      key: undefined,
      value: undefined,
      componentType: 'string',
      type: 'and'
    },
    {
      id: randomString(8),
      key: undefined,
      value: undefined,
      componentType: 'string',
      type: 'and'
    },
    {
      id: randomString(8),
      key: undefined,
      value: undefined,
      componentType: 'string',
      type: 'and'
    },
  ]
}

</script>
<style lang="less" scoped>
.header {
  padding-bottom: 8px;
}
.tags-item {
  display: flex;
  gap: 16px;

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .type {
    width: 72px;
  }
}
</style>
