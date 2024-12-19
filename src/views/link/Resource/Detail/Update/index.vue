<template>
    <a-modal
        title="检查更新"
        visible
        @cancel="emits('close')"
        :maskClosable="false"
        :width="600"
    >
        <div v-if="!showUpate" class="content">
            <div class="title">
                <div><a-badge status="success" />检测到有新版本</div>
                <a-button type="primary">更新</a-button>
            </div>
            <div class="log">
                <h3>更新日志</h3>
                <p>1.添加了xxx</p>
            </div>
        </div>
        <div v-else><a-badge status="success" />当前已是最新版本</div>
    </a-modal>
</template>

<script setup lang="ts" name="Update">
const emits = defineEmits(['close']);

const porps = defineProps({
    data: {
        type: Object,
    },
});
const showUpate = ref(false);
</script>

<style lang="less" scoped>
.content {
    background-color: #eee;
    padding: 12px;
    border-radius: 6px;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .log {
        margin-top: 12px;
    }
}
</style>
