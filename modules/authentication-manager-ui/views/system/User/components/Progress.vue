<template>
    <div class="progress-container">
        <div class="value" :style="valueStyle"></div>
        <div
            class="split"
            v-for="leftValue in valueArr"
            :style="{ left: leftValue + '%' }"
        ></div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        steps?: number;
        strokeColor?:
            | {
                  from: string;
                  to: string;
              }
            | string;
        percent: number;
    }>(),
    {
        steps: 1,
        strokeColor: '#108ee9',
    },
);

const valueStyle = computed(() => {
    let background = '';
    if (typeof props.strokeColor === 'string') {
        background = props.strokeColor;
    } else {
        background = `-webkit-linear-gradient(
            left,
            ${props.strokeColor.from},
            ${props.strokeColor.to}
        )`;
    }

    return {
        background,
        'clip-path': `polygon(0px 0px, ${props.percent}% 0px, ${props.percent}% 100%, 0px 100%)`,
    };
});

const valueArr = computed(() => {
    const result = [];
    for (let i = 1; i < props.steps; i++) result.push((100 / props.steps) * i);
    return result;
});
</script>

<style lang="less" scoped>
.progress-container {
    width: 100%;
    position: relative;
    background-color: #e0e0e0;
    height: 8px;
    margin: 3px 0;

    .split {
        position: absolute;
        top: 0;
        width: 1px;
        height: 100%;
        background-color: #fff;
    }
    .value {
        transition: all 0.35s ease-in-out 0s;
        height: 100%;
        position: relative;
    }
}
</style>
