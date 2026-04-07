<template>
    <a-card class="tags-card" :bordered="true">
        <template #title>
            <div class="card-title">
                <AIcon type="TagsOutlined" class="card-icon" />
                <span>{{$t('Operator.index.745665-15')}}</span>
            </div>
        </template>
        <template #extra>
            <j-permission-button
                type="link"
                class="edit-button"
                @click="visible = true"
                hasPermission="device/Instance:update"
            >
                <AIcon type="EditOutlined" />{{ $t('Product.index.660348-13') }}
            </j-permission-button>
        </template>
        <a-descriptions class="compact-descriptions" bordered :labelStyle="{width: '120px'}" size="small">
            <a-descriptions-item
                :span="1"
                v-for="item in dataSource"
                :key="item.key"
            >
                <template #label>
                    <j-ellipsis>{{ `${item.name}（${item.key})` }}</j-ellipsis>
                </template>
                <j-ellipsis>{{ findName(item) }}</j-ellipsis>
            </a-descriptions-item>
        </a-descriptions>
        <Save v-if="visible" @close="visible = false" @save="saveBtn" />
    </a-card>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '../../../../../../../store/instance';
import Save from './Save.vue';

const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const visible = ref<boolean>(false);

watchEffect(() => {
    const arr = instanceStore.current?.tags || [];
    dataSource.value = arr as Record<any, any>[];
});

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};

const findName = (item: any) => {
  let name = undefined
  if (item.dataType) {
    let arr = item.dataType?.elements || []
    if(item.dataType?.type === 'boolean'){
      arr = [
        {
          text: item.dataType.trueText,
          value: item.dataType.trueValue,
        },
        {
          text: item.dataType.falseText,
          value: item.dataType.falseValue,
        }
      ]
    }
    const _element = arr?.find((a: any) => a.value === item.value)
    name = _element?.text
  }
  return name || item.formatValue || item.value
}
</script>

<style lang="less" scoped>
.tags-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    margin-top: 16px;
    margin-bottom: 16px;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        border-color: #d9d9d9;
    }

    :deep(.ant-card-head) {
        border-bottom: 1px solid #f0f0f0;
        padding: 12px 24px;
        min-height: 48px;
    }

    :deep(.ant-card-body) {
        padding: 16px 20px;
    }
}

.compact-descriptions {
    :deep(.ant-descriptions-item-label) {
        font-size: 13px;
        padding: 8px 12px;
    }

    :deep(.ant-descriptions-item-content) {
        font-size: 13px;
        padding: 8px 12px;
    }

    :deep(.ant-descriptions-row) {
        > td {
            padding-bottom: 8px;
        }
    }
}

.card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);

    .card-icon {
        color: #1890ff;
        font-size: 16px;
    }
}

.edit-button {
    padding: 0;
    height: auto;
    font-size: 14px;
}
</style>
