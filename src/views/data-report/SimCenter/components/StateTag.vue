<template>
    <a-tag>{{ text }}</a-tag>
</template>

<script setup lang="ts">
interface IProps {
    text: string;
    type: 'success' | 'processing' | 'error' | 'warning' | 'default';
}
const props = withDefaults(defineProps<IProps>(), {
    text: '标签',
    type: 'default',
});
const types = reactive([
    'success',
    'processing',
    'error',
    'warning',
    'default',
]);
const foregroundColor = reactive([
    '#0FCE8C60',
    '#287AF560',
    '#F5282860',
    '#FF7A0060',
    '#6B6F7F60',
]);
const backgroundColor = reactive([
    '#0FCE8C10',
    '#287AF510',
    '#F5282810',
    '#FF7A0010',
    '#6B6F7F10',
]);
const fontColor = reactive([
    '#0FCE8C',
    '#287AF5',
    '#F52828',
    '#FF7A00',
    '#6B6F7F',
]);
const curFtColor = fontColor[types.indexOf(props.type)];
const curBgColor = backgroundColor[types.indexOf(props.type)];
const curFgColor = foregroundColor[types.indexOf(props.type)];
</script>

<style scoped lang="less">
.ant-tag {
    background-color: v-bind(curBgColor);
    color: v-bind(curFtColor);
    border-color: v-bind(curFgColor);
    font-family: 'HarmonyOS_Sans_SC';
    font-size: 14px;
    font-weight: normal;
    line-height: 18px;
    padding: 3px 8px;
    border-width: 1px;
    border-radius: 3px;
}
</style>
