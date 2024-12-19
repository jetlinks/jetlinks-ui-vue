<template>
    <div class="content">
        <div>
            <div class="header">
                <a-space :size="12">
                    <AIcon type="AppstoreOutlined" style="font-size: 18px" />
                    <span style="font-size: 20px">物模型</span>
                    <span @click="handleClick('metadata')">受影响的产品: 10</span>
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
                    v-for="item in dataSource"
                    :data="item"
                    :options="[
                        { label: '取交集', value: 1 },
                        { label: '取并集', value: 2 },
                        { label: '忽略', value: 3 },
                        { label: '覆盖', value: 4 },
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
        <div class="header">
            <a-space :size="12">
                <AIcon type="AppstoreOutlined" style="font-size: 18px" />
                <span style="font-size: 20px">消息协议</span>
                <span @click="handleClick('metadata')">受影响的产品: 10</span>
            </a-space>
        </div>
        <div class="protocol-items">
            <CardItem
                v-for="item in protocolList"
                :data="item"
                :options="[
                    { label: '更新', value: 1 },
                    { label: '忽略', value: 2 },
                ]"
            >
                <template #leftRender>
                    <a-space :size="12" align="end">
                        <div>
                            <div style="color: #00000080">当前协议</div>
                            <div class="protocol-item">
                                <div class="protocol-item-img">
                                    <img
                                        :src="
                                            item.img ||
                                            getImage(
                                                '/device/instance/device-card.png',
                                            )
                                        "
                                    />
                                </div>
                                <div class="protocol-item-text">
                                    <j-ellipsis>
                                        {{ item.old }}
                                    </j-ellipsis>
                                </div>
                                <div class="protocol-item-version">
                                    <j-ellipsis>
                                        {{ item.version }}
                                    </j-ellipsis>
                                </div>
                            </div>
                        </div>
                        <div>
                            <AIcon
                                type="ArrowRightOutlined"
                                style="font-size: 18px; margin-bottom: 12px"
                            />
                        </div>
                        <div>
                            <div style="color: #00000080">新版协议</div>
                            <div class="protocol-item">
                                <div class="protocol-item-img">
                                    <img
                                        :src="
                                            item.img ||
                                            getImage(
                                                '/device/instance/device-card.png',
                                            )
                                        "
                                    />
                                </div>
                                <div class="protocol-item-text">
                                    <j-ellipsis>
                                        {{ item.new }}
                                    </j-ellipsis>
                                </div>
                                <div class="protocol-item-version">
                                    <j-ellipsis>
                                        {{ item.version }}
                                    </j-ellipsis>
                                </div>
                            </div>
                        </div>
                    </a-space>
                </template>
            </CardItem>
        </div>
        <Product v-if="visible" :params="params" @close="visible = false" />
    </div>
</template>

<script setup lang="ts" name="List">
import { getImage } from '@/utils/comm';
import CardItem from './CardItem.vue';
import Product from './Product.vue';

const dataSource = [
    { id: 1, name: '产品xxxxx' },
    { id: 2, name: '产品xxxxx' },
    { id: 3, name: '产品xxxxx' },
    { id: 4, name: '产品xxxxx' },
    { id: 2, name: '产品xxxxx' },
    { id: 3, name: '产品xxxxx' },
    { id: 4, name: '产品xxxxx' },
];
const protocolList = [
    {
        id: 1,
        // name: '协议xxxxx',
        old: 'old协议xxxxx',
        version: '1.0.0.11158',
        new: 'new协议xxxxxxxxxxxxxxxxxxxxx',
    },
];
const expand = ref(false);
const visible = ref(false);
const params = ref({});

const handleClick = (type: any) => {
    if (type === 'metadata') {
        params.value = {
            terms:[{ column: 'metadata', termType: 'eq', value: 'metadata' }]
        };
    }else{
        params.value = {
            terms:[{ column: 'metadata', termType: 'eq', value: 'metadata' }]
        };
    }

    visible.value = true;
};
</script>

<style lang="less" scoped>
.content {
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
        height: 190px;
        // max-height: 190px;
        // height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        &.items-expand {
            height: 100%;
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
