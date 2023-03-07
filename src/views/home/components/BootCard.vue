<template>
    <div class="boot-card-container" :bordered="false">
        <h5 class="title">{{ cardTitle }}</h5>

        <div class="box">
            <div
                class="box-item"
                v-for="(item, index) in cardData"
                @click="jumpPage(item.link,item.params)"
            >
                <div class="item-english">{{ item.english }}</div>
                <div class="item-title">{{ item.label }}</div>
                <img
                    class="item-image"
                    :src="`/images/home/${index + 1}.png`"
                    alt=""
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { bootConfig } from "../typing";
import { useMenuStore } from '@/store/menu';

const { jumpPage } = useMenuStore();

const router = useRouter();
const props = defineProps({
    cardData: Array<bootConfig>,
    cardTitle: String,
});
const { cardData, cardTitle } = toRefs(props);

</script>

<style lang="less" scoped>
.boot-card-container {
    background-color: #fff;
    padding: 24px 14px;
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
        display: grid;
        grid-column-gap: 56px;
        grid-template-columns: repeat(3, 1fr);
        .box-item {
            cursor: pointer;
            position: relative;
            padding: 16px;
            background: linear-gradient(
                135.62deg,
                #f6f7fd 22.27%,
                rgba(255, 255, 255, 0.86) 91.82%
            );
            border-radius: 2px;
            box-shadow: 0 4px 18px #efefef;
            .item-english {
                color: #4f4f4f;
            }

            .item-title {
                margin: 20px 0;
                color: @text-color;
                font-weight: 700;
                font-size: 20px;
            }
            .item-image {
                position: absolute;
                right: 10%;
                bottom: 0;
            }
            &::after {
                position: absolute;
                top: 50%;
                right: -60px;
                width: 60px;
                height: 40px;
                transform: translateY(-50%);
                content: ' ';
            }
            &:nth-child(1) {
                &::after {
                    background: url('/images/home/arrow-2.png') no-repeat center;
                }
            }
            &:nth-child(2) {
                &::after {
                    background: url('/images/home/arrow-2.png') no-repeat center;
                }
            }
        }
    }
}
</style>
