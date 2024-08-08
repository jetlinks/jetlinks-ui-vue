<template>
    <div class="sidebar">
        <div class="search-box">
            <j-input
                v-model:value="productName"
                placeholder="请输入产品名称"
                class="search-input"
                allowClear
                size="large"
                @keydown.enter="handleDeviceSearch"
            >
                <template #suffix>
                    <AIcon type="SearchOutlined" @click="handleDeviceSearch" />
                </template>
            </j-input>
        </div>
        <div class="device-list">
            <j-spin :spinning="loading">
                <template v-for="item in deviceList" :key="item.id">
                    <div
                        class="device-item"
                        :class="productId === item.id ? 'active' : ''"
                        @click="handleDeviceClick(item.id)"
                    >
                        {{ item.name }}
                    </div>
                </template>
            </j-spin>
        </div>
    </div>
</template>

<script setup lang="ts">
import { queryProductList } from '@/api/device/product';

defineOptions({
    name: 'Sidebar',
});

defineProps<{
    productId: string;
}>();
const emit = defineEmits(['update:productId']);

// search 组件
const productName = ref('');
const handleDeviceSearch = async () => {
    await handleRequest(productName.value);
};

// 列表组件及相关事件
const deviceList = ref<any[]>([]);
const handleDeviceClick = (id: number) => {
    emit('update:productId', id);
};
const loading = ref(false);
const getDeviceList = async () => {
    await handleRequest();
};

async function handleRequest(name?: string) {
    loading.value = true;
    let resp = null;
    if (name) {
        resp = await queryProductList({
            pageIndex: 0,
            pageSize: 10000,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            type: 'or',
                            value: `%${name}%`,
                            termType: 'like',
                            column: 'name',
                        },
                    ],
                },
            ],
        });
    } else {
        // 获取全部设备
        resp = await queryProductList({
            pageIndex: 0,
            pageSize: 10000,
            sorts: [{ name: 'createTime', order: 'desc' }],
        });
    }
    if (resp.status === 200) {
        deviceList.value = (resp as any).result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
        }));
        emit('update:productId', deviceList.value[0].id);
        loading.value = false;
    } else {
        loading.value = false;
    }
}

onMounted(() => {
    getDeviceList();
});
</script>

<style scoped lang="less">
.sidebar {
    --default-font-color: #000000d9;
    --default-border-color: #d9d9d9;
    overflow-y: auto;

    .device-list {
        margin-top: 16px;
        border-top: 1px solid #f0f0f0;
        padding-top: 16px;

        width: 100%;
        text-align: center;

        .device-item {
            font-size: 14px;
            color: var(--default-font-color);
            line-height: 22px;
            padding: 6px 16px;
            border-radius: 2px;
            border: 1px solid var(--default-border-color);
            text-align: center;
            transition: all 0.3s;
            cursor: pointer;

            &.active {
                color: var(--ant-primary-color);
                border-color: var(--ant-primary-color);
            }

            &:hover {
                color: var(--ant-primary-color-hover);
                border-color: var(--ant-primary-color-hover);
            }

            &:not(&:first-child) {
                margin-top: 12px;
            }
        }
    }
}
</style>
