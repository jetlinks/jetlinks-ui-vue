<template>
    <div class="step-container">
        <h5 class="title">
            <span style="margin-right: 12px">{{ props.cardTitle }}</span>
            <j-tooltip placement="top">
                <template #title>
                    <span>{{ props.tooltip }}</span>
                </template>
                <AIcon type="QuestionCircleOutlined" style="padding-top: 5px" />
            </j-tooltip>
        </h5>

        <div class="box-list">
            <div class="list-item" v-for="item in props.dataList">
                <div class="box-top" @click="jumpPage(item)">
                    <span class="top-title">{{ item.title }}</span>
                    <img :src="item.iconUrl" alt="" />
                </div>
                <div class="box-details">{{ item.details }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { message } from 'ant-design-vue';
import { recommendList } from '../typing';
import { useMenuStore } from '@/store/menu';

const { jumpPage: _jumpPage } = useMenuStore();

const props = defineProps({
    cardTitle: String,
    tooltip: String,
    dataList: Array as PropType<recommendList[]>,
});

// 跳转页面
const jumpPage = (row: recommendList) => {
    if (row.auth === false) return message.warning('暂无权限，请联系管理员');
    row.onClick ? row.onClick(row) : _jumpPage(row.linkUrl, row.params);
};
</script>

<style lang="less" scoped>
.step-container {
    width: 100%;
    padding: 24px 14px;
    background-color: #fff;
    .title {
        position: relative;
        z-index: 2;
        display: flex;
        margin-bottom: 12px;
        padding-left: 18px;
        font-weight: 700;
        font-size: 18px;

        &::before {
            position: absolute;
            top: 50%;
            left: 0;
            width: 8px;
            height: 8px;
            background-color: #1d39c4;
            border: 1px solid #b4c0da;
            transform: translateY(-50%);
            content: ' ';
        }
    }

    .box-list {
        // grid-template-columns: repeat(5, 1fr);
        // display: grid;
        // grid-column-gap: 66px;
        display: flex;
        gap: 66px;

        .list-item {
            flex: 1;
            position: relative;
            .box-top {
                position: relative;
                padding: 16px 24px;
                background-color: #f8f9fd;
                color: #333;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;

                img {
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 1;
                    height: 100%;
                }
            }
            .box-details {
                padding: 24px;
                border: 1px solid #e5edf4;
                border-top: none;
            }

            &:not(:last-child)::after {
                position: absolute;
                top: 50%;
                right: -60px;
                width: 60px;
                height: 40px;
                transform: translateY(-50%);
                content: ' ';
                background: url(/images/home/arrow-1.png) no-repeat 50%;
            }
        }
    }
}
</style>
