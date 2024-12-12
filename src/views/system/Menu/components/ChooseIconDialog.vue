<template>
    <a-modal
        visible
        :title="$t('components.ChooseIconDialog.390527-0')"
        width="800px"
        @cancel="emits('close')"
        @ok="confirm"
    >
        <a-radio-group v-model:value="selected" class="radio">
            <a-radio-button
                v-for="typeStr in iconKeys"
                :value="typeStr"
                :key="typeStr"
                :class="{ active: selected === typeStr }"
            >
                <AIcon :type="typeStr" />
            </a-radio-button>
        </a-radio-group>
    </a-modal>
</template>

<script setup lang="ts">
import iconKeys from './fields';

const emits = defineEmits(['save', 'close']);

const confirm = () => {
    emits('save', selected.value);
};

const selected = ref<string>('');
</script>

<style lang="less" scoped>
.radio {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    max-height: 500px;
    overflow-y: auto;

    .ant-radio-button-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-size: 40px;
        border: 2px solid #efefef;
        border-radius: 2px;
        cursor: pointer;

        &.active {
            color: #415ed1;
            border-color: #415ed1;
        }
    }
}
</style>
