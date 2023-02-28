<template>
    <page-container>
        <div class="iot-home-container" v-loading="loading">
            <InitHome v-if="currentView === 'init'" @refresh="setCurrentView" />
            <DeviceHome v-else-if="currentView === 'device'" />
            <DevOpsHome v-else-if="currentView === 'ops'" />
            <ComprehensiveHome v-else-if="currentView === 'comprehensive'" />

            <Api :mode="'home'" hasHome showTitle>
                <template #top> </template>
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

import { isNoCommunity } from '@/utils/utils';
import { getMe_api, getView_api } from '@/api/home';

const router = useRouter();

const currentView = ref<string>('');
const loading = ref<boolean>(true);

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

            isApiUser ? router.push('/system/api') : setCurrentView();
        }
    });
} else setCurrentView();
</script>

<style lang="less" scoped>
.iot-home-container {
    background: #f0f2f5;
    overflow: hidden;
}
</style>
