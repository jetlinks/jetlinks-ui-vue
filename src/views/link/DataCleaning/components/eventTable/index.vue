<template>
    <j-spin :spinning="loading">
        <full-page>
            <j-data-table
                :columns="columns"
                :serial="true"
                :dataSource="dataSource"
                :height="600"
                ref="tableRef"
            >
                <template #action="{ data }">
                    <a
                        href="javascript: void(0);"
                        @click="handleShowModal(data)"
                    >
                        清洗规则
                    </a>
                </template>
            </j-data-table>
        </full-page>
    </j-spin>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import { useMetadata } from '@/views/device/components/Metadata/Base/hooks';
import { useProductStore } from 'store/product';
import { getMetadataConfig } from '@/api/device/product';
import { onlyMessage } from '@/utils/comm';

defineOptions({
    name: 'PropertyTable',
});

const props = defineProps<{
    productId: string;
    // metadataType: 'properties' | 'events';
}>();
const emit = defineEmits(['showModal']);

const METADATA_TYPE = 'events';
const productStore = useProductStore();
productStore.reSet();

const dataSource = ref<Record<string, any>>([]);
const loading = ref(false);

const columns = ref([
    {
        title: '事件标识',
        dataIndex: 'id',
        // width: 200,
        type: 'text',
    },
    {
        title: '事件名称',
        dataIndex: 'name',
        // width: 200,
        type: 'text',
    },
    {
        title: '事件级别',
        dataIndex: 'level',
        // width: 200,
        type: 'text',
    },
    {
        title: '输出参数',
        dataIndex: 'type',
        // width: 200,
        type: 'text',
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: 140,
    },
]);

const handleShowModal = async (data: Record<string, any>) => {
    loading.value = true;
    // modal框中显示输入框的权限
    const modalPermissions: string[] = [];
    // 获取当前属性标识的配置
    const resp = await getMetadataConfig({
        deviceId: props.productId,
        metadata: {
            type: 'property',
            id: data.record.id,
            dataType: data.record.type,
        },
    });
    if (resp.status === 200) {
        const flag = resp.result.some((item: any) => {
            // 如果遍历到 data_clean 则返回 true ，标记当前属性标识支持配置清洗规则
            if (item.description === 'data_clean') {
                // 同时获取modal的权限
                item.properties.forEach((item: any) =>
                    modalPermissions.push(item.property),
                );
                return true;
            }
        });
        if (!flag) {
            onlyMessage('该事件不支持配置清洗规则', 'warning');
            loading.value = false;
            return;
        }
        loading.value = false;
    } else {
        onlyMessage('网络异常请重试', 'error');
        loading.value = false;
        return;
    }
    loading.value = false;
    emit('showModal', {
        record: data.record,
        permissions: modalPermissions,
    });
};

watch(
    () => props.productId,
    (newVal, oldVal) => {
        console.log('watch', newVal, oldVal);
        if (newVal !== oldVal) {
            if (newVal !== '') {
                loading.value = true;
                productStore
                    .getDetail(newVal)
                    .then(() => {
                        const { data: metadata } = useMetadata(
                            'product',
                            METADATA_TYPE,
                        );
                        loading.value = false;
                        dataSource.value = metadata.value.map((item: any) => {
                            return {
                                id: item.id,
                                name: item.name,
                                level: item.expands.level,
                                type: item.valueType.type,
                            };
                        });
                    })
                    .catch(() => {
                        loading.value = false;
                    });
            }
        }
    },
    { immediate: true },
);
</script>

<style scoped lang="less">
:deep(.full-page-warp-content) {
    padding: 32px 12px 16px;
}
</style>
