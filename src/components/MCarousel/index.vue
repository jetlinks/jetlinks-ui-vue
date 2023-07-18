<template>
    <div class="box">
        <div class="box-btn" v-if="pageIndex > 0">
            <div class="box-item-action" @click="onLeft">
                <AIcon type="LeftOutlined" />
            </div>
        </div>
        <div class="box-item" v-for="item in getData" :key="item.id">
            <slot name="card" v-bind="item"></slot>
        </div>
        <div class="box-btn" v-if="(pageIndex + 1) * showLength < data.length">
            <div class="box-item-action" @click="onRight">
                <AIcon type="RightOutlined" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

const props = defineProps({
    data: {
        type: Array as PropType<any[]>,
        default: () => [],
    },
    showLength: {
        type: Number,
        default: 8,
    },
});

const pageIndex = ref<number>(0);

const getData = computed(() => {
    const start = pageIndex.value >= 0 ? pageIndex.value * props.showLength : 0;
    const end =
        (pageIndex.value + 1) * props.showLength < props.data.length
            ? props.showLength * (pageIndex.value + 1)
            : props.data.length;
    return props.data.slice(start, end);
});

const onRight = () => {
    const flag = pageIndex.value + 1;
    if (flag < props.data.length) {
        pageIndex.value = flag;
    }
};

const onLeft = () => {
    const flag = pageIndex.value - 1;
    if (flag >= 0) {
        pageIndex.value -= 1;
    }
};
</script>

<style scoped lang="less">
.box {
    display: flex;
    align-items: center;
    margin: 8px 0;
    .box-item {
        margin: 0 12px;
        max-width: 60px;
    }

    .box-btn {
        .box-item-action {
            width: 12px;
            background-color: #F7F8FA;
            padding: 15px 0;
            text-align: center;
            font-size: 12px;
            color: #666666;
            cursor: pointer;

            &:hover {
                background-color: #EFF2FE;
                color: @primary-color;
            }
        }
    }
}
</style>