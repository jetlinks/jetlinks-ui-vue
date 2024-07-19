<template>
    <div class="position">
        <div class="position-title">
            <div>
                {{ result?.name }}
            </div>
            <div>
                <div>
                    <span>{{ result?.orgName }}</span>
                    <span>{{ result?.vehicleType }}</span>
                </div>
                <div>
                    <span>{{ result?.typeN }}</span>
                    <span>{{ result?.speed || 0 }}km/h</span>
                </div>
                <div>
                    <span>{{ result?.positionTime }}</span>
                </div>
            </div>
        </div>
        <j-button @click="close">关闭</j-button>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref } from 'vue';
// 定义 props 类型
const props = defineProps({
    locationName: String, // 字符串类型的 prop1
    result: Object,
    closeApp: {
        type: Function,
        required: true,
    },
});
const close = () => {
    props.closeApp();
};
</script>

<style lang="less" scoped>
.position {
    width: 300px;
    border-radius: 10px;
    background-color: #636e72;
    opacity: 0.8;
    padding: 10px;
    display: flex;
    color: #fff;

    &-title {
        width: 0;
        flex: 1;
    }

    :last-child {
        cursor: pointer;
    }
}

.position::before {
    content: '';
    position: absolute;
    bottom: -10px; /* 倒三角的位置 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 10px solid #636e72; /* 气泡的颜色 */
}
</style>
