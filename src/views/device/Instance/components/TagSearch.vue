<template>
  <a-button style="width: 100%" @click="show">
    <div style="width: 100%;white-space: normal;">
      <Ellipsis >
        {{ searchText }}
      </Ellipsis>
    </div>
  </a-button>
  <a-modal
    v-model:visible="visible"
    title="标签筛选"
    :width="600"
    :keyboard="false"
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
      <a-form ref="formRef" :model="formData">
        <a-form-item name="list" :rules="rules" validateStatus="success">
          <div class="tags-item" v-for="(item, index) in formData.list" :key="item.id">
            <div class="action">
              <a-button danger @click="onDelete(index)" :disabled="formData.list.length === 1">
                <template #icon>
                  <AIcon type="DeleteOutlined"/>
                </template>
              </a-button>
            </div>
            <div style="width: 200px">
              <a-select
                v-model:value="item.key"
                allow-clear
                show-search
                :options="options"
                :field-names="{
                      label: 'fullName',
                      value: 'key'
                    }"
                :filter-option="filterOption"
                placeholder="请选装标签"
                style="width: 100%"
                @change="(key, option) => onTermsChange(key, option, index)"
              />
            </div>
            <div class="value" style="flex: 1 1 0;min-width: 0">
              <a-input allow-clear v-model:value="item.value" placeholder="标签值" :maxLength="200" />
            </div>
            <div class="type">
              <a-button v-if="index === formData.list.length -1" :disabled="formData.list.length >= 10" @click="onAdd">
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
        </a-form-item>
      </a-form>
    </div>

  </a-modal>
</template>

<script setup>
import { useRequest } from '@/hook'
import { tagsList } from '@/api/device/instance'
import { randomString } from '@/utils/utils'
import {cloneDeep} from "lodash-es";

const emit =  defineEmits(['change','update:value'])



const { data: options, run } = useRequest(tagsList,
  {
    immediate: false,
    onSuccess(resp) {
      return resp.result.map(item => ({
        ...item,
        fullName: `${item.name}-${item.key}`
      }))
    }
  })

const formData = reactive({
  list: [
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
})
const formRef = ref()
const visible = ref(false);
const listCache = ref([])
const rules = [{
  validator: (_, value) => {
    const error = []

    if (value.length) {
      value.forEach((item) => {
        if (item.key && !item.value) {
          error.push(`【${item.label}】 请输入`)
        }
      })
    }

    if (error.length) {
      return Promise.reject(error.join(';'))
    }
    return Promise.resolve()
  }
}]

const searchText = computed(() => {
  const result = listCache.value.filter(item => item.key)
  if (!result.length) {
    return '点击配置标签筛选范围'
  }
  return result.map(item => {
    return `${item.key}-${item.value}`
  }).join(';')
});

const show = () => {
  visible.value = true;

  if (listCache.value.length) {
    formData.list = cloneDeep(listCache.value)
  }
  run()
};

const onAdd = () =>{
  formData.list.push({
    id: randomString(8),
    key: undefined,
    value: undefined,
    componentType: 'string',
    type: 'and'
  })
}

const onDelete = (index) =>{
  formData.list.splice(index,1)
}

const submitSearch = async () => {

  const resp = await formRef.value.validateFields()

  if (!resp) {
    return
  }

  const resultFilter = formData.list.filter(item => item.key)
  listCache.value = cloneDeep(formData.list)
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
    formData.list[index].componentType = option.type
    formData.list[index].label = option.fullName
  } else {
    formData.list[index].componentType = "string"
    formData.list[index].value = undefined
    formData.list[index].label = undefined
  }
}

const onInit = () => {
  formData.list = [
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

const filterOption = (input, option) => {
  return option.fullName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

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

.tags-list {
  :deep(.ant-form-item-explain-success) {
    color: @error-color;
    margin-top: 8px;
  }
}
</style>
