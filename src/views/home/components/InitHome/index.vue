<template>
    <div class="init-home-container">
        <div class="title">请选择首页视图</div>

        <div class="choose-view">
            <a-row class="view-content" :gutter="24">
                <a-col
                    :span="8"
                    class="select-item"
                    :class="{ selected: selectValue === 'device' }"
                    @click="selectValue = 'device'"
                >
                    <img src="/images/home/device.png" alt="" />
                </a-col>
                <a-col
                    :span="8"
                    class="select-item"
                    :class="{ selected: selectValue === 'ops' }"
                    @click="selectValue = 'ops'"
                >
                    <img src="/images/home/ops.png" alt="" />
                </a-col>
                <a-col
                    :span="8"
                    class="select-item"
                    :class="{ selected: selectValue === 'comprehensive' }"
                    @click="selectValue = 'comprehensive'"
                >
                    <img src="/images/home/comprehensive.png" alt="" />
                </a-col>
            </a-row>
            <a-button type="primary" class="btn" @click="confirm"
                >确定</a-button
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import { setView_api } from '@/api/home';

const emits = defineEmits(['refresh']);
const selectValue = ref('device');

const confirm = () => {
    setView_api({
        name: 'view',
        content: selectValue.value,
    }).then(() => emits('refresh'));
};
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
