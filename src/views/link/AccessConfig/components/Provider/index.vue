<template>
    <div v-for="items in dataSource" :key="items.type" class="card-items">
        <div class="card-items-container">
            <TitleComponent :data="items.title"></TitleComponent>
            <a-row :gutter="[24, 24]">
                <a-col :span="12" v-for="item in items.list" :key="item.id">
                    <div class="provider">
                        <div class="box">
                            <div class="left">
                                <div class="images">
                                    <img :src="BackMap.get(item.id)" />
                                </div>
                                <div class="context">
                                    <div class="title">
                                        {{ item.name }}
                                    </div>
                                    <div class="desc">
                                        <a-tooltip :title="item.description">
                                            {{ item.description || '' }}
                                        </a-tooltip>
                                    </div>
                                </div>
                            </div>
                            <div class="right">
                                <a-button type="primary" @click="click(item)"
                                    >接入</a-button
                                >
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessConfigProvider">
import TitleComponent from '@/components/TitleComponent/index.vue';
import { BackMap } from '../../data';

const props = defineProps({
    dataSource: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['onClick']);

const click = (value: object) => {
    emit('onClick', value);
};
</script>

<style lang="less" scoped>
.card-items {
    margin-bottom: 24px;
    .card-items-container {
    }
}
.provider {
    position: relative;
    width: 100%;
    padding: 20px;
    background: url('/public/images/access/background.png') no-repeat;
    background-size: 100% 100%;
    border: 1px solid #e6e6e6;

    &::before {
        position: absolute;
        top: 0;
        left: 40px;
        display: block;
        width: 15%;
        min-width: 64px;
        height: 2px;
        background-image: url('/public/images/access/rectangle.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        content: ' ';
    }

    &:hover {
        box-shadow: 0 0 24px rgba(#000, 0.1);
    }
}

.box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .left {
        display: flex;
        width: calc(100% - 70px);
        .images {
            width: 64px;
            height: 64px;

            img {
                width: 100%;
            }
        }

        .context {
            width: calc(100% - 84px);
            margin: 10px;

            .title {
                font-weight: 600;
            }

            .desc {
                width: 100%;
                margin-top: 10px;
                overflow: hidden;
                color: rgba(0, 0, 0, 0.55);
                font-weight: 400;
                font-size: 13px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
    .right {
        width: 70px;
    }
}
</style>
