<template>
    <page-container>
        <full-page>
            <div class="container">
                <div class="flex-lf">
                    <sidebar v-model:product-id="productId" />
                </div>
                <div class="flex-rt">
                    <div class="main">
                        <j-tabs type="card">
                            <j-tab-pane key="property" tab="属性">
                                <property-table
                                    :product-id="productId"
                                    @show-modal="showModal"
                                />
                            </j-tab-pane>
                            <j-tab-pane key="event" tab="事件">
                                <event-table
                                    :product-id="productId"
                                    @show-modal="showModal"
                                />
                            </j-tab-pane>
                        </j-tabs>
                    </div>
                </div>
            </div>
        </full-page>
    </page-container>
    <modal v-model:visible="isShowModal" :data="modalData"></modal>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import Sidebar from './components/sidebar/index.vue';
import modal from './components/modal/index.vue';
import PropertyTable from '@/views/link/DataCleaning/components/propertyTable/index.vue';
import EventTable from '@/views/link/DataCleaning/components/eventTable/index.vue';

// 左侧设备的选项卡的tab索引
const productId = ref<string>('');

// 控制modal框
const isShowModal = ref(false);
const modalData = ref<Record<string, any>>({});

const showModal = (payload: Record<string, any>) => {
    console.log('father trigger');
    isShowModal.value = true;
    modalData.value = payload;
};
</script>

<style scoped lang="less">
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
        :deep(.ant-tabs-tab) {
            padding: 8px 24px !important;
            border-top-left-radius: 2px !important;
            border-top-right-radius: 2px !important;
        }
    }
    :deep(.ant-tabs-nav) {
        padding-left: 20px;
    }
    :deep(.JSearch-warp) {
        margin-bottom: 0;
    }
}
</style>
