<template>
    <a-modal
        title="检查更新"
        visible
        @cancel="emits('close')"
        :maskClosable="false"
        :width="600"
    >
        <div v-if="showUpate" class="content">
            <div class="title">
                <div><a-badge status="success" />检测到有新版本</div>
                <a-button type="primary" @click="onUpdate">更新</a-button>
            </div>
            <div class="log">
                <h3>更新日志</h3>
                <p>{{ version }}</p>
            </div>
        </div>
        <div v-else><a-badge status="success" />当前已是最新版本</div>
    </a-modal>
</template>

<script setup lang="ts" name="Update">
import { checkUpdate,_latest } from '@/api/link/resource';

const emits = defineEmits(['close']);

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const showUpate = ref(false);
const version = ref();
const getUpdate = async () => {
    const res = await checkUpdate(props.data.id);
    if(res.success){
        showUpate.value = res.result;
        if(res.result){
            const resp = await _latest(props.data.id);
            if(resp.success){
                version.value = resp.result
            }
        }
    }
};

const onUpdate = async() => {

};

onMounted(() => {
    getUpdate();
});

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
