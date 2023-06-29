<template>
    <div class="box">
        <div class="box-item" v-if="pageIndex > 0">
            <j-button
                @click="onLeft"
                shape="circle"
                class="box-item-action"
                >+{{ pageIndex * showLength }}</j-button>
        </div>
        <div class="box-item" v-for="item in getData" :key="item.id">
            <slot name="card" v-bind="item"></slot>
        </div>
        <div class="box-item">
            <slot name="add"></slot>
        </div>
        <div class="box-item" v-if="(pageIndex + 1) * showLength < data.length">
            <j-button
                shape="circle"
                class="box-item-action"
                @click="onRight"
                >+{{ data.length - (pageIndex + 1) * showLength }}</j-button>
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
    margin: 5px;
    .box-item {
        margin-left: 10px;
    }
}
</style>