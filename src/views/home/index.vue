<template>
    <page-container>
        <div class="iot-home-container">
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
                        <h3 style="margin: 0 0 24px 0">{{ $t('home.index.926510-0') }}</h3>
                        <p>
                            <span class="label">clientId: </span>
                            <span class="value">{{ clientId }}</span>
                        </p>
                        <p>
                            <span class="label">secureKey:</span>
                            <span class="value">
                                {{ showKey ? secureKey : '****************' }}
                            </span>
                            <AIcon
                                :type="
                                    showKey
                                        ? 'EyeOutlined'
                                        : 'EyeInvisibleOutlined'
                                "
                                @click="showKey = !showKey"
                            />
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const currentView = ref<string>('');
const clientId = useUserInfo().$state.userInfos.id;
const secureKey = ref<string>('');
const showKey = ref(false);
// 获取选择的视图
const setCurrentView = () => {
    getView_api().then(({ status, result }: any) => {
        if (status === 200) {
            currentView.value = 'init';
            if (result) {
                currentView.value =
                    result.username === 'admin'
                        ? 'comprehensive'
                        : result?.content;
            }
        }
    });
};

if (isNoCommunity) {
    // 判断是否是api用户   不是则获取选中的视图
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
            } else {
                setCurrentView();
            }
        }
    });
} else {
    setCurrentView();
}
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

            .label {
                font-weight: bold;
                margin-right: 3px;
            }
            .value {
                margin-right: 10px;
                font-size: 14px;
            }
        }
    }
}
</style>
