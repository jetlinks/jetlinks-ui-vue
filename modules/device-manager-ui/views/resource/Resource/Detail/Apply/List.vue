<template>
    <div class="list">
        <div>
            <div class="header">
                <a-space :size="12">
                    <AIcon type="AppstoreOutlined" style="font-size: 18px" />
                    <span style="font-size: 20px">{{ $t('Apply.List.326977-0') }}</span>
                    <span @click="handleClick('metadata')"
                        >{{ $t('Apply.List.326977-1') }} <span style="color: #1890ff; "> {{ productList.length }} </span></span
                    >
                </a-space>
                <a-space>
                    <a-tooltip>
                        <template #title>
                            <div>{{ $t('Apply.List.326977-3') }}</div>
                            <div>{{ $t('Apply.List.326977-2') }}</div>
                            <div>{{ $t('Apply.List.326977-4') }}</div>
                            <div>{{ $t('Apply.List.326977-5') }}</div>
                        </template>
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                        {{ $t('Apply.List.326977-6') }}
                    </a-tooltip>
                </a-space>
            </div>
            <div
                v-if="!!productList.length"
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
                        { label: $t('Apply.List.326977-7'), value: 'intersection', icon: 'icon-jiaoji' },
                        { label: $t('Apply.List.326977-8'), value: 'union', icon: 'icon-hebing' },
                        { label: $t('Apply.List.326977-9'), value: 'ignore', icon: 'icon-hulve' },
                        { label: $t('Apply.List.326977-10'), value: 'cover', icon: 'icon-fugai' },
                    ]"
                >
                    <template #leftRender>
                        <a-space :size="12">
                            <div class="render-img">
                                <img
                                    :src="
                                        item.photoUrl ||
                                        device.deviceCard
                                    "
                                />
                            </div>
                            <div>
                                <j-ellipsis>
                                  <div>{{ item.name }}</div>
                                </j-ellipsis>
                                <div>{{ item.id }}</div>
                            </div>
                        </a-space>
                    </template>
                </CardItem>
            </div>
            <div style="padding: 100px 0;" v-else>
              <j-empty  />
            </div>
            <div v-if="productList.length > 2" class="expand-btn" @click="expand = !expand">
                {{ expand ? $t('Apply.List.326977-11') : $t('Apply.List.326977-12') }}
            </div>
        </div>
        <Product v-if="visible" @close="visible = false" />
    </div>
</template>

<script setup lang="ts" name="List">
import CardItem from './CardItem.vue';
import Product from './Product.vue';
import { device } from '@device-manager-ui/assets/device'

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
