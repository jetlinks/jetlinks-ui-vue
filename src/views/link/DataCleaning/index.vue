<template>
    <page-container>
        <full-page>
            <div class="container">
                <div class="flex-lf">
                    <sidebar
                        :device-index="deviceIndex"
                        @change="(id) => (deviceIndex = id)"
                    />
                </div>
                <div class="flex-rt">
                    <div class="main">
                        <j-tabs type="card">
                            <j-tab-pane key="1" tab="属性">
                                <div class="content">
                                    <j-pro-search></j-pro-search>
                                    <j-pro-table></j-pro-table>
                                </div>
                            </j-tab-pane>
                            <j-tab-pane key="2" tab="事件">
                                <div class="content">
                                    <j-pro-search></j-pro-search>
                                    <j-pro-table></j-pro-table>
                                </div>
                            </j-tab-pane>
                        </j-tabs>
                    </div>
                </div>
            </div>
        </full-page>
    </page-container>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import Sidebar from './components/sidebar/index.vue';

const deviceIndex = ref(1);
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
}
</style>
