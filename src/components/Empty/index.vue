<template>
    <Empty v-bind="baseProps">
        <template v-for="item in renderArr" :key="item" #[item]="scope">
            <slot :name="item" :scope="scope"></slot>
        </template>
    </Empty>
</template>

<script lang="ts" setup name="JEmpty">
import { Empty } from 'jetlinks-ui-components';
import { useSlots } from 'vue';
import NoData from './assets/nodata.svg';
import { omit } from 'lodash-es';
import type { PropType, CSSProperties } from 'vue';
const slots = useSlots();
const renderArr = Object.keys(slots);

const props = defineProps({
    description: {
        type: String,
        default: '暂无数据',
    },
    image: {
        type: String,
        default: NoData,
    },
    imageStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => {
            return { height: '60px' };
        },
    },
});

const baseProps = omit(props, ...renderArr);
</script>

<style lang="less" scoped>
:deep(.ant-empty-description) {
    color: #b3b3b3;
    font-size: 14px;
}
</style>
