<template>
  <div class="node-select" @click="show">
    <j-ellipsis>
      {{ searchText }}
    </j-ellipsis>
  </div>
  <a-modal
    title="节点筛选"
    :visible="visible"
    :mask-closable="false"
    width="600px"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="header">
      <span>筛选项</span>
    </div>
    <div class="node-list">
      <a-form ref="formRef" :model="formData">
        <a-form-item name="list" :rules="rules" validateStatus="success">
          <div
            class="node-item"
            v-for="(item, index) in formData.list"
            :key="item.id"
          >
            <div class="action">
              <a-button
                danger
                @click="onDelete(index)"
                :disabled="formData.list.length === 1"
              >
                <template #icon>
                  <AIcon type="DeleteOutlined" />
                </template>
              </a-button>
            </div>
            <div style="width: 150px">
              <a-select
                v-model:value="item.column"
                allow-clear
                show-search
                :options="tagList"
                :filter-option="filterOption"
                :placeholder="$t('components.TagSearch.396210-2')"
                style="width: 100%"
                @change="(val) => handleChangeColumn(index, value)"
              />
            </div>
            <div class="value" style="flex: 1 1 0; min-width: 0">
              <a-auto-complete
                allow-clear
                v-model:value="item.value"
                :options="valueList(item.column)"
                :placeholder="$t('components.TagSearch.396210-3')"
                :maxLength="200"
              />
            </div>
            <div class="type">
              <a-button
                v-if="index === formData.list.length - 1"
                :disabled="formData.list.length >= 10"
                @click="onAdd"
              >
                <template #icon>
                  <AIcon type="PlusOutlined" />
                </template>
              </a-button>
              <a-select
                v-else
                v-model:value="item.type"
                :options="[
                  { label: $t('components.TagSearch.396210-4'), value: 'and' },
                  { label: $t('components.TagSearch.396210-5'), value: 'or' },
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
import { onlyMessage, randomString } from "@jetlinks-web/utils";
import { omit } from "lodash-es";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const props = defineProps({
  tagList: {
    type: Array,
    default: () => ([])
  },
  tagValueObj: {
    type: Array,
    default: () => ([])
  },
  value: {
    type: Array,
    default: () => ([])
  }
})
const emit = defineEmits(["change"]);
const searchText = ref($t("Detail.NodeSelect.141135-0"));
const visible = ref(false);
const show = () => {
  visible.value = true;
};

const valueList = computed(() => {
  return (val) => {
    return props.tagValueObj[val]
  }
})
const formRef = ref();

const formData = reactive({
  list: [
    {
      id: randomString(8),
      column: undefined,
      value: undefined,
      type: "and",
    },
    {
      id: randomString(8),
      column: undefined,
      value: undefined,
      type: "and",
    },
    {
      id: randomString(8),
      column: undefined,
      value: undefined,
      type: "and",
    },
  ],
});

const rules = [{
    validator: (_, value) => {
        const error = []

        if (value.length) {
            value.forEach((item) => {
                if (item.column && !item.value) {
                    error.push($t('components.TagSearch.396210-6', [item.column]))
                }
            })
        }

        if (error.length) {
            return Promise.reject(error.join(';'))
        }
        return Promise.resolve()
    }
}]

const onAdd = () =>{
    formData.list.push({
        id: randomString(8),
        column: undefined,
        value: undefined,
        type: 'and'
    })
}

const onDelete = (index) =>{
    formData.list.splice(index,1)

    formRef.value.validate()
}

const handleChangeColumn = (index, value) => {
  formData.list[index].value = undefined
}

const handleCancel = () => {
  visible.value = false;
  formData.list.forEach((item, index) => {
    if(props.value[index]?.column) {
      item.column = props.value[index]?.column;
      item.value = props.value[index]?.value;
      item.type = props.value[index]?.type
    } else {
      item.column = undefined;
      item.value = undefined;
      item.type = 'and'
    }
  })
}
const handleOk = () => {
  formRef.value.validate().then(() => {
    const result = formData.list.filter(item => item.column && item.value)
    if (!result.length) {
      return onlyMessage($t('Detail.NodeSelect.141135-1'), 'warning')
    }
    searchText.value = result.map(item => {
      return `${item.column}-${item.value}`
    }).join(';')
    visible.value = false;
    emit('change', result.map(item => omit(item, 'id')))
  })
}

watch(() => props.value, (val) => {
  if(val) {
    val.forEach((item, index) => {
      formData.list[index].column = item.column
      formData.list[index].value = item.value;
      formData.list[index].type = item.type
    })
    const result = formData.list.filter(item => item.column)
    if (!result.length) {
      return $t('Detail.NodeSelect.141135-0')
    }
    searchText.value = result.map(item => {
      return `${item.column}-${item.value}`
    }).join(';')
  }
}, { immediate: true })

watch(() => visible.value, (val) => {
  props.value?.forEach((item, index) => {
    formData.list[index].column = item.column
    formData.list[index].value = item.value;
    formData.list[index].type = item.type
  })
  const result = formData.list.filter(item => item.column)
  if (!result.length) {
    return $t('Detail.NodeSelect.141135-0')
  }
  searchText.value = result.map(item => {
    return `${item.column}-${item.value}`
  }).join(';')
})
</script>
<style lang="less" scoped>
.header {
    padding-bottom: 8px;
}
.node-select {
  width: 100%;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  padding: 4px 8px;
  text-align: center;
  background-color: #fff;
}
.node-item {
    display: flex;
    gap: 16px;

    &:not(:last-child) {
        margin-bottom: 12px;
    }

    .type {
        width: 72px;
    }
}

.node-list {
    :deep(.ant-form-item-explain-success) {
        color: @error-color;
        margin-top: 8px;
    }
}
</style>
