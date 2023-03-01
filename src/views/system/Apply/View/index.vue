<template>
    <page-container>
        <Api :mode="'home'" hasHome showTitle :code="clientId">
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
    </page-container>
</template>

<script setup lang="ts" name="apiPage">
import { getAppInfo_api } from '@/api/system/apply';
import Api from '@/views/system/Platforms/Api/index.vue';
const route = useRoute();
const clientId = route.query.code as string;

const secureKey = ref<string>('');

getAppInfo_api(clientId).then((resp: any) => {
    secureKey.value = resp.result.apiServer.secureKey;
});
</script>

<style lang="less" scoped>
.card {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 24px;

    p {
        margin: 0;
        font-size: 16px;
    }
}
</style>
