<template>
    <div class="api-test-container">
        <div class="top">
            <h5>{{ selectApi.summary }}</h5>
            <div class="input">
                <InputCard :value="selectApi.method" />
                <a-input :value="selectApi?.url" disabled />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiDetailsType } from '../index';
import InputCard from './InputCard.vue';
import { PropType } from 'vue';

const props = defineProps({
    selectApi: {
        type: Object as PropType<apiDetailsType>,
        required: true,
    },
});
const { selectApi } = toRefs(props);
</script>

<style lang="less" scoped>
.api-test-container {
    .top {
        width: 100%;

        h5 {
            font-weight: bold;
            font-size: 16px;
        }

        .input {
            display: flex;
        }
    }
}
</style>