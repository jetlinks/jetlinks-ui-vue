<template>
    <div class="choose-view">
        <div class="view-content">
            <div
                :span="8"
                class="select-item"
                v-for="item in list"
                :key="item.id"
                @click="currentView = item.id"
                :class="{
                    active: currentView === item.id,
                }"
            >
                <div class="select-item-box">
                    <div class="title">{{ item.name }}</div>
                </div>
                <img :src="getImage(`/home/home-view/${item.id}.png`)" alt="" />
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
const list = [
    {
        id: 'device',
        name: '设备接入视图',
    },
    {
        id: 'ops',
        name: '运营管理视图',
    },
    {
        id: 'comprehensive',
        name: '综合管理视图',
    },
];

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
            border-radius: 14px;
            overflow: hidden;
            color: #333333;

            .select-item-box {
                position: relative;
                width: 100%;
                .title {
                    position: absolute;
                    top: 36px;
                    left: 36px;
                    font-size: 24px;
                }
            }

            img {
                width: 100%;
                height: 100%;
                background-size: cover;
            }

            &.active {
                border: 1px solid @primary-color-active;
                color: @primary-color-active;
            }

            &:hover {
                box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
                    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
                    0px 9px 16px 8px rgba(0, 0, 0, 0.1);
            }
        }
    }

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