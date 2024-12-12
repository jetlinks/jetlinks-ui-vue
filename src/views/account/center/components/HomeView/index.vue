<template>
    <div class="choose-view">
        <HomeView v-model:value="currentView" />
        <div class="btn">
            <a-button type="primary" @click="confirm">{{$t('InitHome.index.152181-1')}}</a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getMe_api, getView_api, setView_api } from '@/api/account/center';
import { onlyMessage } from "@jetlinks-web/utils";
import HomeView from '@/components/HomeView/index.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const currentView = ref<string>('');
const isApiUser = ref<boolean>();

function getViews() {
    // 判断是否是api用户 不是则获取选中的视图
    getMe_api()
        .then((resp: any) => {
            if (resp && resp.status === 200) {
                isApiUser.value = resp.result.dimensions.find(
                    (item: any) =>
                        item.type === 'api-client' ||
                        item.type.id === 'api-client',
                );
                if (!isApiUser.value) return getView_api();
            }
        })
        .then((resp: any) => {
            if (resp?.status === 200) {
                if (resp.result) {
                    currentView.value = resp.result?.content;
                } else if (resp.result?.username === 'admin') {
                    currentView.value = 'comprehensive';
                } else {
                    currentView.value = 'device';
                }
            }
        });
}

const confirm = () => {
    setView_api({
        name: 'view',
        content: currentView.value,
    }).then(() => onlyMessage($t('EditInfo.index.557023-17'), 'success'));
};

onMounted(() => {
    getViews();
});
</script>

<style lang="less" scoped>
.choose-view {
    width: 100%;
    padding: 4% 9% 0 9%;
    box-sizing: border-box;

    .btn {
        display: flex;
        justify-content: flex-end;
        margin-top: 68px;

        button {
            background-color: @primary-2;
            color: @primary-color-hover;
        }
    }
}
</style>
