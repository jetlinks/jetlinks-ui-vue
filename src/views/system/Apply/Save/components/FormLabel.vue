<template>
    <div class="form-label-container">
        <span class="text">{{ props.text }}</span>
        <span class="required" v-show="props.required">*</span>
        <a-tooltip>
            <template #title>{{ props.tooltip }}</template>
            <AIcon type="QuestionCircleOutlined" class="icon" />
        </a-tooltip>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    text: string;
    tooltip: string;
    required?: boolean;
}>();
</script>

<style lang="less" scoped>
.form-label-container {
    display: flex;
    align-items: center;

    .required {
        display: inline-block;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
    }
    .icon {
        color: #00000073;
        cursor: inherit;
        margin-left: 4px;
    }
}
</style>
