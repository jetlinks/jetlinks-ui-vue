<template>
    <div class="init-home-container">
        <div class="title">请选择首页视图</div>

        <div class="choose-view">
            <j-row class="view-content" :gutter="24">
                <j-col
                    :span="8"
                    class="select-item"
                    :class="{ selected: selectValue === 'device' }"
                    @click="selectValue = 'device'"
                >
                    <img :src="getImage('/home/device.png')" alt="" />
                </j-col>
                <j-col
                    :span="8"
                    class="select-item"
                    :class="{ selected: selectValue === 'ops' }"
                    @click="selectValue = 'ops'"
                >
                    <img :src="getImage('/home/ops.png')" alt="" />
                </j-col>
                <j-col
                    :span="8"
                    class="select-item"
                    :class="{ selected: selectValue === 'comprehensive' }"
                    @click="selectValue = 'comprehensive'"
                >
                    <img :src="getImage('/home/comprehensive.png')" alt="" />
                </j-col>
            </j-row>
            <j-button type="primary" class="btn" @click="confirm"
                >确定</j-button
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import { setView_api } from '@/api/home';
import { getImage } from '@/utils/comm';
import { useUserInfo } from '@/store/userInfo';

const user = useUserInfo();
const emits = defineEmits(['refresh']);
const selectValue = ref('device');

const confirm = () => {
    setView_api({
        name: 'view',
        content: selectValue.value,
    }).then(() => emits('refresh'));
};

watch(
    () => user.userInfos,
    (val: any) => {
        // 超管默认综合管理视图
        if (val.username === 'admin') {
            selectValue.value = 'comprehensive';
            confirm();
        }
    },
);
</script>

<style lang="less" scoped>
.init-home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: calc(100vh - 150px);
    padding: 20px;
    background-color: white;

    .title {
        margin-top: 28px;
        margin-bottom: 48px;
        font-weight: 400;
        font-size: 26px;
        text-align: center;
    }

    .choose-view {
        width: 100%;
        .view-content {
            display: flex;
            flex-flow: row wrap;
            .select-item {
                border: 2px solid transparent;
                img {
                    width: 100%;
                }

                &.selected {
                    border-color: #10239e;
                }
            }
        }

        .btn {
            display: block;
            margin: 48px auto;
            margin-bottom: 0;
        }
    }
}
</style>
