<template>
    <div class="top-card">
        <div class="top-card-content">
            <div class="content-left">
                <div class="content-left-title">
                    <span>{{ title }}</span>
                    <j-tooltip placement="top" v-if="tooltip">
                        <template #title>
                            <span>{{ tooltip }}</span>
                        </template>
                        <AIcon type="QuestionCircleOutlined" />
                    </j-tooltip>
                </div>
                <div class="content-left-value">{{ value }}</div>
            </div>
            <div class="content-right">
                <img :src="img" alt="" />
            </div>
        </div>
        <div class="top-card-footer">
            <template v-for="(item, index) in footer" :key="index">
                <span v-if="!item.status">{{ item.title }}</span>
                <j-badge v-else :text="item.title" :status="item.status" />
                <div class="footer-item-value">{{ item.value }}</div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { Footer } from '../typings.d';

const props = defineProps({
    title: { type: String, default: '' },
    tooltip: { type: String, default: '' },
    img: { type: String, default: '' },
    footer: { type: Array as PropType<Footer[]>, default: '' },
    value: { type: Number, default: 0 },
});
</script>

<style lang="less" scoped>
.top-card {
    display: flex;
    flex-direction: column;
    padding: 24px;
    background-color: #fff;
    border: 1px solid #e0e4e8;
    border-radius: 2px;
    max-height: 215px;
    .top-card-content {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        .content-left {
            height: 100%;
            width: 50%;
            &-title {
                color: rgba(0, 0, 0, 0.64);
            }
            &-value {
                padding: 12px 0;
                color: #323130;
                font-weight: 700;
                font-size: 36px;
            }
        }
        .content-right {
            width: 0;
            height: 100%;
            display: flex;
            flex-grow: 1;
            align-items: flex-end;
            justify-content: flex-end;
            img {
                width: 100%;
                height: 100%;
                max-height: 123px;
                max-width: 140px;
            }
        }
    }
    .top-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid #f0f0f0;
        .footer-item-value {
            color: #323130;
            font-weight: 700;
            font-size: 16px;
        }
    }
}
</style>
