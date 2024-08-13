<template>
    <page-container>
        <full-page style="height: 848px">
            <div class="container">
                <div class="flex-lf">
                    <sidebar v-model:product-id="productId" />
                </div>
                <div class="flex-rt">
                    <div class="main">
                        <div class="tab-wrapper">
                            <div class="tab-list">
                                <template v-for="tab in tabs" :key="tab.key">
                                    <div
                                        class="tab-item"
                                        :class="
                                            tab.key === curTab ? 'active' : ''
                                        "
                                        @click="() => (curTab = tab.key)"
                                    >
                                        {{ tab.title }}
                                    </div>
                                </template>
                            </div>
                            <div class="content">
                                <template v-if="curTab === 'properties'">
                                    <property-table
                                        :product-id="productId"
                                        @show-modal="showModal"
                                    />
                                </template>
                                <template v-else-if="curTab === 'events'">
                                    <event-table
                                        :product-id="productId"
                                        @show-modal="showModal"
                                    />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </full-page>
    </page-container>
    <modal
        :visible="isShowModal"
        :product-id="productId"
        :info="modalData"
        :permission="modalPermissions"
        :default-data="modalDefaultData"
        @update:visible="handleModalVisible"
    ></modal>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import Sidebar from './components/sidebar/index.vue';
import modal from './components/modal/index.vue';
import PropertyTable from '@/views/link/DataCleaning/components/propertyTable/index.vue';
import EventTable from '@/views/link/DataCleaning/components/eventTable/index.vue';
import { useProductStore } from 'store/product';
import {
    metadata2Object,
    objectsIsCross,
} from '@/views/link/DataCleaning/utils';

const productStore = useProductStore();

// 左侧设备的选项卡的tab索引
const productId = ref<string>('');

// 控制modal框
const isShowModal = ref(false);
// const modalProperty = ref('');
const modalData = ref<any>({});
const modalPermissions = ref<string[]>([]);
const modalDefaultData = reactive({
    maxValue: '',
    minValue: '',
    exceptionKey: '',
    exceptionValue: '',
    invalidKey: '',
    invalidValue: '',
});

let metadata: Record<string, any> = {};

const showModal = (payload: {
    record: { id: string; name: string; type: string };
    permissions: string[];
}) => {
    // 控制 modal 显示
    isShowModal.value = true;

    // 控制modal的默认值
    // modalProperty.value = payload.property;
    modalData.value = payload.record;
    modalPermissions.value = payload.permissions;

    const targetObj = metadata.properties.find(
        (item: any) => item.id === payload.record.id,
    ).expands;
    for (const key in targetObj) {
        if (modalDefaultData[key] !== undefined) {
            modalDefaultData[key] = targetObj[key];
        }
    }
};

const tabs = reactive([
    {
        title: '属性',
        key: 'properties',
        component: PropertyTable,
        props: {
            productId,
            showModal,
        },
    },
    {
        title: '事件',
        key: 'events',
        component: EventTable,
        props: {
            productId,
            showModal,
        },
    },
]);

// 当前选中的tab
const curTab = ref('properties');

const handleModalVisible = (val: boolean) => {
    isShowModal.value = val;
    for (let key in modalDefaultData) {
        modalDefaultData[key] = '';
    }
};

watch(
    () => productStore.current,
    (newVal) => {
        if (productStore.current.metadata) {
            metadata = metadata2Object(productStore.current.metadata);
        }
    },
    { immediate: true },
);
</script>

<style scoped lang="less">
:deep(.ant-pro-page-container-grid-content) {
    margin-bottom: 24px;
}
.container {
    display: flex;
    padding: 24px;

    .flex-lf {
        width: 276px;
        padding-right: 16px;
        margin-right: 16px;
        border-right: 1px solid #f0f0f0;
    }
    .flex-rt {
        flex-grow: 1;
        //:deep(.ant-tabs-tab) {
        //    padding: 8px 24px !important;
        //    border-top-left-radius: 2px !important;
        //    border-top-right-radius: 2px !important;
        //}
        .tab-list {
            height: 40px;
            display: flex;
            gap: 1px;
            position: relative;
            padding: 0 12px;
            &::before {
                content: '';
                position: absolute;
                top: 39px;
                left: 0;
                height: 1px;
                width: 100%;
                background-color: #f0f0f0;
                border-radius: 2px;
            }

            .tab-item {
                padding: 8px 24px;
                font-size: 14px;
                line-height: 24px;
                background-color: #f3f4f4;
                position: relative;
                border: 1px solid #f0f0f0;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                color: #000000d9;
                font-weight: 500;
                //border-top-left-radius: 2px;
                //border-top-right-radius: 2px;
                &::before {
                    content: '';
                    position: absolute;
                    top: 38px;
                    left: 0;
                    height: 1px;
                    width: 100%;
                    background-color: var(--ant-primary-color);
                }
                &:hover {
                    color: var(--ant-primary-5);
                }

                &.active {
                    background-color: var(--ant-primary-color);
                    color: #ffffff;
                }
            }
        }

        .content {
            height: 100%;
            width: 100%;
        }
    }
    :deep(.JSearch-warp) {
        margin-bottom: 0;
    }
}
</style>
