<template>
    <div class="boot-card-container">
        <h5 class="title">{{ cardTitle }}</h5>
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
    </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { bootConfig } from '../typing';
import { useMenuStore } from '@/store/menu';

const props = defineProps({
    cardData: Array<bootConfig>,
    cardTitle: String,
});
const { cardData, cardTitle } = toRefs(props);
const { jumpPage: _jumpPage } = useMenuStore();

const jumpPage = (item: bootConfig) => {
    if (item.auth === undefined || item.auth) _jumpPage(item.link, item.params);
    else message.warning('暂无权限，请联系管理员');
};
</script>

<style lang="less" scoped>
.boot-card-container {
    background-color: #fff;
    padding: 24px 12px;
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
