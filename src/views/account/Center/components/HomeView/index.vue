<template>
    <div class="choose-view">
        <div class="view-content">
            <div
                :span="8"
                class="select-item"
                @click="currentView = 'device'"
            >
                <img :src="getImage(`/home/home-view/device${currentView === 'device' ? '-active' : ''}.png`)" alt="" />
            </div>
            <div
                :span="8"
                class="select-item"
                @click="currentView = 'ops'"
            >
                <img :src="getImage(`/home/home-view/ops${currentView === 'ops' ? '-active' : ''}.png`)" alt="" />
            </div>
            <div
                :span="8"
                class="select-item"
                @click="currentView = 'comprehensive'"
            >
                <img :src="getImage(`/home/home-view/comprehensive${currentView === 'comprehensive' ? '-active' : ''}.png`)" alt="" />
            </div>
        </div>
        <div class="btn">
            <j-button type="primary" @click="confirm">保存修改</j-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getMe_api, getView_api, setView_api } from '@/api/home';
import { getImage, onlyMessage } from '@/utils/comm';
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
                if (resp.result) currentView.value = resp.result?.content;
                else if (resp.result?.username === 'admin') {
                    currentView.value = 'comprehensive';
                } else currentView.value = 'init';
            }
        });
}

const confirm = () => {
    setView_api({
        name: 'view',
        content: currentView.value,
    }).then(() => onlyMessage('保存成功', 'success'));
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
    .view-content {
        display: flex;
        justify-content: space-between;
        .select-item {
            cursor: pointer;
            width: 30%;

            img {
                width: 100%;
                background-size: cover;
            }
        }
    }

    .btn {
        display: flex;
        justify-content: flex-end;
        margin-top: 68px;
    }
}
</style>