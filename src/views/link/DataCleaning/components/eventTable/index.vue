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
                <template #action="{ record }">
                    <a
                        href="javascript: void(0);"
                        @click="handleShowModal(record)"
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
import { useProSearch } from '@/hook/useProSearch';
import { config, mockData } from '../../config';
import { useMetadata } from '@/views/device/components/Metadata/Base/hooks';
import { useProductStore } from 'store/product';

defineOptions({
    name: 'PropertyTable',
});

const props = defineProps<{
    productId: string;
    // metadataType: 'properties' | 'events';
}>();
const emit = defineEmits(['showModal']);

const productStore = useProductStore();
productStore.reSet();

const dataSource = ref([]);
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

// const init = () => {
//     dataSource.value = metadata.value.map((item: any) => {
//         return {
//             id: item.id,
//             name: item.name,
//             type: item.valueType.type,
//         };
//     });
// };

const handleShowModal = (record: Record<string, any>) => {
    emit('showModal', record);
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
                            'events',
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
