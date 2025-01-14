<template>
    <a-modal
        title="检查更新"
        visible
        @cancel="emits('close')"
        :maskClosable="false"
        :width="600"
        :footer="null"
        @ok="emits('close')"
    >
    <div class="ht_40">
        <div v-if="showUpdata" class="content">
            <div class="title">
                <div><a-badge status="success" />检测到有新版本</div>
                <a-button type="primary" @click="onUpdate">更新</a-button>
            </div>
            <div class="log">
                <h3>新版本 {{ info.version }}</h3>
                <p>{{ info.describe }}</p>
            </div>
        </div>
        <div class="noUpdate" v-else><a-badge status="success" />当前已是最新版本</div>
    </div>
    </a-modal>
</template>

<script setup name="Update">
import { checkUpdate,_latest,installResource } from '@/api/link/resource';
import { onlyMessage } from '@/utils/comm';

const emits = defineEmits(['close']);

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const showUpdata = ref(false);
const info = ref({});
const getUpdate = async () => {
    const res = await checkUpdate(props.data.id);
    if(res.success){
        showUpdata.value = res.result;
        if(res.result){
            const resp = await _latest(props.data.id);
            if(resp.success){
                info.value = resp.result
            }
        }
    }
};

const onUpdate = async() => {
    const res = await installResource({
        type: 'cloud',
        resourceDetails:[{
            releaseDetail: info.value
        }]
    });
    if(res.success){
        onlyMessage('操作成功')
        emits('close')
    }
};

onMounted(() => {
    getUpdate();
});

</script>

<style lang="less" scoped>
.ht_40{
    min-height: 40vh;
}
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
.noUpdate{
    background-color: #eee;
    padding: 12px;
    border-radius: 6px;
}
</style>
