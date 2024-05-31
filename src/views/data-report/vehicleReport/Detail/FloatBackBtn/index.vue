<template>
    <transition name="move">
        <div v-if="backIsShow" class="back-btn" @click="backVehicleCenterClick">
            <a-button type="primary" shape="circle" size="large">
                <template #icon>
                    <AIcon type="RollbackOutlined" />
                </template>
            </a-button>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useMenuStore } from 'store/menu';
import { useScroll, useThrottleFn } from '@vueuse/core';

const menuStore = useMenuStore();
// 控制返回按钮是否显示
const backIsShow = ref(false);
// 屏幕上一次滚动位置
const prevPosition = ref(0);

const backVehicleCenterClick = () => {
    menuStore.jumpPage(`data-report/vehicleReport`);
};

onMounted(() => {
    // 获取到滚动位置
    const { y } = useScroll(window);

    // 创建一个节流处理函数，这里假设我们对滚动事件处理函数进行节流，延迟时间为100毫秒
    const throttleHandleScroll = useThrottleFn(() => {
        // 如果滚动位置大于上一次滚动位置，则说明是向下滚动，处理显示返回按钮
        if (y.value > prevPosition.value) {
            if (y.value > 200) {
                backIsShow.value = true;
            }
        } else {
            // 如果滚动位置小于上一次滚动位置，则说明是向上滚动，处理隐藏返回按钮
            if (y.value < 200) {
                backIsShow.value = false;
            }
        }
        prevPosition.value = y.value;
    }, 100);

    // 监听滚动位置的变化
    watch(y, (newValue, oldValue) => {
        // 调用防抖后的处理函数
        throttleHandleScroll();
    });
});
</script>

<style scoped lang="less">
.back-btn {
    position: fixed;
    right: 30px;
    bottom: 30px;
    .ant-btn {
        box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
            0 3px 6px -4px rgba(0, 0, 0, 0.12),
            0 9px 28px 8px rgba(0, 0, 0, 0.05);
    }
    .ant-btn-circle {
        min-width: 48px;
        min-height: 48px;
    }
}

.move-enter-active,
.move-leave-active {
    bottom: 30px;
    transition: bottom 0.5s ease;
}

.move-enter-from,
.move-leave-to {
    bottom: -60px;
}
</style>
