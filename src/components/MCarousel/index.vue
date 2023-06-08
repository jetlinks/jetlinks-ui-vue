<template>
    <div class="box">
        <div class="box-item" v-if="data.length > showLength">
            <j-button
                @click="onLeft"
                type="primary"
                :disabled="!(pageIndex > 0)"
                shape="circle"
                class="box-item-action"
                ><AIcon type="LeftOutlined"
            /></j-button>
        </div>
        <div class="box-item" v-for="item in getData" :key="item.id">
            <slot name="card" v-bind="item"></slot>
        </div>
        <div class="box-item">
            <slot name="add"></slot>
        </div>
        <div class="box-item" v-if="data.length > showLength">
            <j-button
                :disabled="!(pageIndex + showLength < data.length)"
                type="primary"
                shape="circle"
                class="box-item-action"
                @click="onRight"
                ><AIcon type="RightOutlined"
            /></j-button>
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

// const emit = defineEmits(['add']);

const pageIndex = ref<number>(0);

const getData = computed(() => {
    const start = pageIndex.value >= 0 ? pageIndex.value : 0;
    const end =
        props.showLength + pageIndex.value < props.data.length
            ? props.showLength + pageIndex.value
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

// const onAdd = () => {
//     emit('add');
// };
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