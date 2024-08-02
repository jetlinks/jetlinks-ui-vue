<template>
    <div class="sidebar">
        <div class="search-box">
            <j-input
                v-model:value="deviceName"
                @change="handleDeviceSearch"
                placeholder="请输入设备名称"
                class="search-input"
                allowClear
                size="large"
            >
                <template #suffix>
                    <AIcon type="SearchOutlined" />
                </template>
            </j-input>
        </div>
        <div class="device-list">
            <j-spin :spinning="loading">
                <template v-for="item in deviceList" :key="item.id">
                    <div
                        class="device-item"
                        :class="deviceIndex === item.id ? 'active' : ''"
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
defineOptions({
    name: 'Sidebar',
});

const props = defineProps<{
    deviceIndex: number;
}>();
const emit = defineEmits(['change']);

// search 组件
const deviceName = ref('');
const handleDeviceSearch = async () => {
    await handleRequest(props.deviceIndex);
};

// 列表组件及相关事件
const deviceList = ref([
    {
        id: 1,
        name: '发动机',
    },
    {
        id: 2,
        name: '变速箱',
    },
]);
const handleDeviceClick = (id: number) => {
    emit('change', id);
};
const loading = ref(false);
const getDeviceList = async () => {
    await handleRequest();
};

async function handleRequest(id?: number) {
    loading.value = true;
    let resp = {} as { status: number; result: any[] };
    if (id) {
        // todo 根据id获取设备列表
    } else {
        // todo 获取全部设备
    }
    if (resp.status === 200) {
        deviceList.value = resp.result.map((item: any) => ({
            id: item.id,
            name: item.name,
        }));
        emit('change', deviceList.value[0].id);
        loading.value = false;
    } else {
        loading.value = false;
    }
}
</script>

<style scoped lang="less">
.sidebar {
    --default-font-color: #000000d9;
    --default-border-color: #d9d9d9;
    overflow-y: auto;

    .device-list {
        margin-top: 16px;
        border-top: 1px solid #f0f0f0;
        .device-item {
            margin-top: 16px;
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
        }
    }
}
</style>
