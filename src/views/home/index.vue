<template>
    <page-container>
        <div class="iot-home-container" v-loading="loading">
            <InitHome v-if="currentView === 'init'" @refresh="setCurrentView" />
            <DeviceHome v-else-if="currentView === 'device'" />
            <DevOpsHome v-else-if="currentView === 'ops'" />
            <ComprehensiveHome v-else-if="currentView === 'comprehensive'" />

            <Api
                v-else-if="currentView === 'api'"
                :mode="'home'"
                hasHome
                showTitle
                :code="clientId"
            >
                <template #top>
                    <div class="card">
                        <h3 style="margin: 0 0 24px 0">基本信息</h3>
                        <p>
                            <span style="font-weight: bold">clientId: </span>
                            <span>{{ clientId }}</span>
                        </p>
                        <p>
                            <span style="font-weight: bold">secureKey:</span>
                            <span>{{ secureKey }}</span>
                        </p>
                    </div>
                </template>
            </Api>
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import InitHome from './components/InitHome/index.vue';
import DeviceHome from './components/DeviceHome/index.vue';
import DevOpsHome from './components/DevOpsHome/index.vue';
import ComprehensiveHome from './components/ComprehensiveHome/index.vue';
import Api from '@/views/system/Platforms/Api/index.vue';
import { useUserInfo } from '@/store/userInfo';

import { isNoCommunity } from '@/utils/utils';
import { getMe_api, getView_api } from '@/api/home';
import { getAppInfo_api } from '@/api/system/apply';

const currentView = ref<string>('');
const loading = ref<boolean>(true);
const clientId = useUserInfo().$state.userInfos.id;
const secureKey = ref<string>('');

// 获取选择的视图
const setCurrentView = () => {
    getView_api().then((resp: any) => {
        if (resp.status === 200) {
            if (resp.result) currentView.value = resp.result?.content;
            else if (resp.result.username === 'admin') {
                currentView.value = 'comprehensive';
            } else currentView.value = 'init';
        }
    });
};

if (isNoCommunity) {
    // 判断是否是api用户   是则跳转  否则获取选中的视图
    getMe_api().then((resp: any) => {
        if (resp && resp.status === 200) {
            const isApiUser = resp.result.dimensions.find(
                (item: any) =>
                    item.type === 'api-client' || item.type.id === 'api-client',
            );

            if (isApiUser) {
                currentView.value = 'api';
                getAppInfo_api(clientId).then((resp: any) => {
                    secureKey.value = resp.result.apiServer.secureKey;
                });
            } else setCurrentView();
        }
    });
} else setCurrentView();
</script>

<style lang="less" scoped>
.iot-home-container {
    .card {
        background-color: #fff;
        padding: 24px;
        margin-bottom: 24px;

        p {
            margin: 0;
            font-size: 16px;
        }
    }
}
</style>
