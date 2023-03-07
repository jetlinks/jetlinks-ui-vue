<template>
    <a-card class="boot-card-container" :bordered="false">
        <template #title>
            <h5 class="title">{{ cardTitle }}</h5>
        </template>
        <div class="box">
            <div
                class="box-item"
                v-for="(item, index) in cardData"
                @click="jumpPage(item)"
            >
                <div class="item-content">
                    <div class="icon">
                        <img :src="item.image" alt="" />
                    </div>
                    <div class="intro">
                        <div class="item-english">{{ item.english }}</div>
                        <div class="item-label">{{ item.label }}</div>
                    </div>
                </div>
                <div class="right-bj">
                    <img :src="`/images/home/home-${index + 1}.png`" alt="" />
                </div>
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { bootConfig } from "../typing";

const router = useRouter();
const props = defineProps({
    cardData: Array<bootConfig>,
    cardTitle: String,
});
const { cardData, cardTitle } = toRefs(props);

const jumpPage = (row: bootConfig): void => {
    if (row.auth && row.link) {
        router.push(`${row.link}${objToParams(row.params || {})}`);
    } else {
        message.warning('暂无权限，请联系管理员');
    }
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
.boot-card-container {
    :deep(.ant-card-body) {
        padding-top: 0;
    }
    .title {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-between;
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
    .box {
        font-size: 14px;
        .box-item {
            cursor: pointer;
            position: relative;
            border-width: 1px 1px 1px 2px;
            border-style: solid;
            border-color: rgb(238, 238, 238) rgb(238, 238, 238)
                rgb(238, 238, 238) rgb(133, 165, 255);
            padding: 11px;
            background: linear-gradient(
                135.62deg,
                #f6f7fd 22.27%,
                rgba(255, 255, 255, 0.86) 91.82%
            );
            border-radius: 2px;
            box-shadow: 0 4px 18px #efefef;
            &:not(:first-child) {
                margin-top: 12px;
            }

            .item-content {
                display: flex;
                align-items: center;
                .item-label {
                    color: #252526;
                    font-size: 18px;
                    font-weight: 700;
                }
            }

            .right-bj {
                position: absolute;
                right: 10%;
                bottom: 0;
                width: 37px;
            }
        }
    }
}
</style>
