<template>
    <div class="init-home-container">
        <div class="title">请选择首页视图</div>

        <div class="choose-view">
            <HomeView v-model:value="selectValue"/>
            <div class="btn">
                <j-button type="primary" @click="confirm">保存修改</j-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { setView_api } from '@/api/home';
import { useUserInfo } from '@/store/userInfo';
import HomeView from '@/components/HomeView/index.vue';

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
        padding: 0 9%;
        box-sizing: border-box;

        .btn {
            display: flex;
            justify-content: flex-end;
            margin-top: 68px;
        }
    }
}
</style>
