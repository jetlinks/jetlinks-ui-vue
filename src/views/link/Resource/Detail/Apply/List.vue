<template>
    <div class="list">
        <div>
            <div class="header">
                <a-space :size="12">
                    <AIcon type="AppstoreOutlined" style="font-size: 18px" />
                    <span style="font-size: 20px">物模型</span>
                    <span @click="handleClick('metadata')"
                        >受影响的产品: <span style="color: #1890ff; "> {{ productList.length }} </span></span
                    >
                </a-space>
                <a-space>
                    <a-tooltip>
                        <template #title>
                            <div>取并集：仅保留标识一致的属性</div>
                            <div>取交集：保留平台、资源中的所有属性</div>
                            <div>忽略：保留资源中的所有属性</div>
                            <div>覆盖：仅保留平台中的属性</div>
                        </template>
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                        处理方式说明
                    </a-tooltip>
                </a-space>
            </div>
            <div
                :class="{
                    items: true,
                    'items-expand': expand,
                }"
            >
                <CardItem
                    v-for="(item,index) in productList"
                    v-model:value="productList[index]"
                    :resourceMetadata="resourceMetadata"
                    :options="[
                        { label: '取交集', value: 'intersection' },
                        { label: '取并集', value: 'union' },
                        { label: '忽略', value: 'ignore' },
                        { label: '覆盖', value: 'cover' },
                    ]"
                >
                    <template #leftRender>
                        <a-space :size="12">
                            <div class="render-img">
                                <img
                                    :src="
                                        item.img ||
                                        getImage(
                                            '/device/instance/device-card.png',
                                        )
                                    "
                                />
                            </div>
                            <div>
                                <div>{{ item.name }}</div>
                                <div>{{ item.id }}</div>
                            </div>
                        </a-space>
                    </template>
                </CardItem>
            </div>
            <div class="expand-btn" @click="expand = !expand">
                {{ expand ? '收起' : '展开' }}
            </div>
        </div>
        <Product v-if="visible" @close="visible = false" />
    </div>
</template>

<script setup lang="ts" name="List">
import { getImage } from '@/utils/comm';
import CardItem from './CardItem.vue';
import Product from './Product.vue';

const props = defineProps({
    productList: {
        type: Array,
        default: () => [],
    },
    resourceMetadata: {
        type: Object,
        default: () => ({}),
    },
});


const expand = ref(false);
const visible = ref(false);
const params = ref({});

const handleClick = (type: any) => {
    visible.value = true;
};
</script>

<style lang="less" scoped>
.list {
    .header {
        padding-bottom: 12px;
        display: flex;
        justify-content: space-between;
    }
    .items {
        background-color: #eee;
        padding: 6px;
        border: 1px solid #eeeeee;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        // height: 190px;
        max-height: 190px;
        // height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        &.items-expand {
            height: 100%;
            max-height: 100%;
        }
        .render-img {
            height: 56px;
            width: 56px;
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
    .expand-btn {
        color: #1890ff;
        cursor: pointer;
        width: 100%;
        text-align: center;
    }
    .protocol-items {
        background-color: #eeeeee;
        padding: 6px;
        border: 1px solid #eeeeee;
        border-radius: 6px;
        display: flex;
        flex-direction: column;

        .protocol-item {
            display: flex;
            align-items: center;
            background-color: #eeeeee83;
            border-radius: 6px;
            padding: 6px;
            gap: 12px;
            .protocol-item-img {
                height: 30px;
                width: 30px;
                img {
                    height: 100%;
                    width: 100%;
                }
            }
            .protocol-item-text {
                width: 170px;
            }
            .protocol-item-version {
                width: 60px;
            }
        }
    }
}
</style>
