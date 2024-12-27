<template>
    <div class="list">
        <div class="header">
            <a-space :size="12">
                <AIcon type="AppstoreOutlined" style="font-size: 18px" />
                <span style="font-size: 20px">消息协议</span>
                <span @click="handleClick('metadata')">受影响的产品: <span style="color: #1890ff; "> {{count }} </span></span>
            </a-space>
        </div>
        <div class="protocol-items">
            <CardItem
                v-for="(item,index) in protocolList"
                type="protocol"
                v-model:value="protocolList[index]"
                :options="[
                    { label: '更新', value: 'cover' },
                    { label: '忽略', value: 'ignore' },
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
                                           
                                            getImage(
                                                '/device/instance/device-card.png',
                                            )
                                        "
                                    />
                                </div>
                                <div class="protocol-item-text">
                                    <j-ellipsis>
                                        {{ item.name }}
                                    </j-ellipsis>
                                </div>
                                <div class="protocol-item-version">
                                    <j-ellipsis>
                                        {{ item.configuration.version || '--' }}
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
                                           
                                            getImage(
                                                '/device/instance/device-card.png',
                                            )
                                        "
                                    />
                                </div>
                                <div class="protocol-item-text">
                                    <j-ellipsis>
                                        {{ item.newProtocol?.name || '--' }}
                                    </j-ellipsis>
                                </div>
                                <div class="protocol-item-version">
                                    <j-ellipsis>
                                        {{ item.newProtocol?.version || '--' }}
                                    </j-ellipsis>
                                </div>
                            </div>
                        </div>
                    </a-space>
                </template>
            </CardItem>
        </div>
        <Product v-if="visible" type="protocol"  @close="visible = false" />
    </div>
</template>

<script setup lang="ts" name="List">
import { getImage } from '@/utils/comm';
import CardItem from './CardItem.vue';
import Product from './Product.vue';
import {
    _queryProtocol,_queryProtocolNoPag
} from '@/api/link/resource';

const props = defineProps({
    protocolList: {
        type: Array ,
        default: () => ([]),
    },
});

const route = useRoute();
const _id = route.params?.id as any;

const visible = ref(false);
const productList = ref<any>([]);
const count = ref(0)

// 受协议影响的产品
const getProtocol = async () => {
    const res = await _queryProtocol(_id, {  });
    if (res.success) {
        count.value = res.result.total;
    }
    // await _queryProtocolNoPag(_id, { paging: false });
};
const handleClick = (type: any) => {
    visible.value = true;
};

onMounted(() => {
    getProtocol();
});

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
