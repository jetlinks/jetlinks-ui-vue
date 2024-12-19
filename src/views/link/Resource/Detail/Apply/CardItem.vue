<template>
    <div class="card-item" @click="isExpand = !isExpand">
        <div class="left">
            <slot name="leftRender"></slot>
        </div>
        <div class="right">
            <div class="right-items" >
                <div >
                    <AIcon
                        :type="
                            isExpand
                                ? 'DoubleRightOutlined'
                                : 'DoubleLeftOutlined'
                        "
                    />
                    处理方式：
                </div>
                <div
                    v-for="item in options"
                    :class="{
                        'right-item': true,
                        active: item.value === _selectKey,
                        expand: !isExpand && item.value !== _selectKey,
                    }"
                    @click.stop="onSelect(item)"
                >
                    <span style="margin-right: 6px">{{ item.label }}</span>
                    <AIcon type="AppstoreOutlined" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="CardItem">
const props = defineProps({
    data: {
        type: Object,
    },
    options: {
        type: Array,
        default: [],
    },
});

const _selectKey = ref('');
const isExpand = ref(true);

const onSelect = (item) => {
    _selectKey.value = item.value;
};
</script>

<style lang="less" scoped>
.card-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 6px;
    background-color: #fff;
    .left {
        flex: 1;
    }
    .right {
        .right-items{
            display: flex;
            gap: 8px;
            align-items: center;
            .right-item {
            border: 1px solid #eee;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            &.active {
                border: 1px solid #188fffde;
                color: #1890ff;
            }
            &.expand {
                display: none;
                padding: 6px 0;
            }
        }
        }
        
    }
}
</style>
