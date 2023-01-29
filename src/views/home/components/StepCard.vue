<template>
    <a-card class="step-container">
        <h5 class="title">
            <span style="margin-right: 12px">{{ cardTitle }}</span>
            <a-tooltip placement="top">
                <template #title>
                    <span>{{ tooltip }}</span>
                </template>
                <question-circle-outlined style="padding-top: 5px" />
            </a-tooltip>
        </h5>

        <div class="box-list">
            <div class="list-item" v-for="item in dataList">
                <div class="box-top" @click="jumpPage(item)">
                    <span class="top-title">{{ item.title }}</span>
                    <img :src="item.iconUrl" alt="" />
                </div>
                <div class="box-details">{{ item.details }}</div>
            </div>
        </div>

        <div class="dialogs">
            <ProductChooseDialog
                :open-number="openAccess"
                @confirm="againJumpPage"
            />
            <DeviceChooseDialog
                :open-number="openFunc"
                @confirm="againJumpPage"
            />
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import ProductChooseDialog from './dialogs/ProductChooseDialog.vue';
import DeviceChooseDialog from './dialogs/DeviceChooseDialog.vue';

import { recommendList } from '../index';

type rowType = {
    params: object;
    linkUrl: string;
};

const props = defineProps({
    cardTitle: String,
    tooltip: String,
    dataList: Array as PropType<recommendList[]>,
});
const router = useRouter();

const { cardTitle, tooltip, dataList } = toRefs(props);
const openAccess = ref<number>(0);
const openFunc = ref<number>(0);
let selectRow: recommendList | rowType = {
    params: {},
    linkUrl: '',
};
// 跳转页面
const jumpPage = (row: recommendList) => {
    if (!row.auth) return message.warning('暂无权限，请联系管理员');
    selectRow = row; // 二次跳转需要使用
    if (row.dialogTag == 'accessMethod') return (openAccess.value += 1);
    else if (row.dialogTag === 'funcTest') return (openFunc.value += 1);
    else if (row.linkUrl) {
        router.push(`${row.linkUrl}${objToParams(row.params || {})}`);
    }
};
// 弹窗返回后的二次跳转
const againJumpPage = (params: string) => {
    router.push(`${selectRow.linkUrl}/${params}`);
};

const objToParams = (source: object): string => {
    if (Object.prototype.toString.call(source) === '[object Object]') {
        const paramsArr = <any>[];
        // 直接使用for in遍历对象ts会报错
        Object.entries(source).forEach(([prop, value]) => {
            if (typeof value === 'object') value = JSON.stringify(value);
            paramsArr.push(`${prop}=${value}`);
        });
        if (paramsArr.length > 0) return '?' + paramsArr.join('&');
    }
    return '';
};
</script>

<style lang="less" scoped>
.step-container {
    width: 100%;
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
        grid-template-columns: repeat(5, 1fr);
        display: grid;
        grid-column-gap: 66px;

        .list-item {
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
