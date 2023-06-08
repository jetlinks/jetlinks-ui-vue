<template>
    <div class="choose-view">
        <j-row class="view-content" :gutter="24">
            <j-col
                :span="8"
                class="select-item"
                :class="{ selected: currentView === 'device' }"
                @click="currentView = 'device'"
            >
                <img :src="getImage('/home/device.png')" alt="" />
            </j-col>
            <j-col
                :span="8"
                class="select-item"
                :class="{ selected: currentView === 'ops' }"
                @click="currentView = 'ops'"
            >
                <img :src="getImage('/home/ops.png')" alt="" />
            </j-col>
            <j-col
                :span="8"
                class="select-item"
                :class="{
                    selected: currentView === 'comprehensive',
                }"
                @click="currentView = 'comprehensive'"
            >
                <img :src="getImage('/home/comprehensive.png')" alt="" />
            </j-col>
        </j-row>
        <j-button type="primary" class="btn" @click="confirm">确定</j-button>
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
    margin-top: 30px;
    padding: 48px 150px;
    box-sizing: border-box;
    .view-content {
        display: flex;
        flex-flow: row wrap;
        .select-item {
            border: 2px solid transparent;
            img {
                width: 100%;
                background-size: cover;
            }

            &.selected {
                border-color: #10239e;
            }
        }
    }

    .btn {
        display: block;
        margin: 48px auto;
    }
}
</style>