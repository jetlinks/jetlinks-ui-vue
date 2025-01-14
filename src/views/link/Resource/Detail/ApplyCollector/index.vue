<template>
    <a-modal
        title="应用资源"
        visible
        :centered="true"
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
    >
        <div class="content">
            <div class="header">
                <a-space :size="12">
                    <AIcon type="AppstoreOutlined" style="font-size: 16px" />
                    <span style="font-size: 18px">数采</span>
                    <span @click="handleClick"
                        >受影响的采集器:
                        <span style="color: #1890ff">{{
                            _dataSource.length
                        }}</span></span
                    >
                </a-space>
            </div>
            <div class="items" v-if="_dataSource.length">
                <div v-for="item in _dataSource" class="item">
                    <a-space :size="24">
                        <div class="item-img">
                            <img
                                :src="
                                    item.img ||
                                    getImage('/device/instance/device-card.png')
                                "
                            />
                        </div>
                        <div class="item-text">{{ item.name }}</div>
                        <div class="item-version">{{ item.version }}</div>
                    </a-space>
                </div>
            </div>
            <a-empty v-else></a-empty>
            <div class="footer">
                提示：此操作会为您将数采插件替换为资源库中新版本数采，可能会影响已创建的采集器，请谨慎操作
            </div>
        </div>
        <Collector v-if="visible" @close="visible = false" />
    </a-modal>
</template>

<script setup name="ApplyCollector">
import Collector from './Collector.vue';
import { getImage } from '@/utils/comm';
import { _queryCollector } from '@/api/link/resource';

const emits = defineEmits(['close']);

const props = defineProps({
    data: {
        type: Object,
    },
});
const visible = ref(false);
const _dataSource = ref([]);
const handleClick = () => {
    visible.value = true;
};

const getCollector = async () => {
    const res = await _queryCollector(props.data.id, {});
    if(res.success){
        _dataSource.value = res.result || []
    }
};

onMounted(() => {
    getCollector();
});
</script>

<style lang="less" scoped>
.content {
    height: 70vh;
    .items {
        max-height: 60vh;
        padding: 12px;
        border-radius: 6px;
        background-color: #eee;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 12px 0;

        .item {
            background-color: #fff;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            .item-img {
                height: 56px;
                width: 56px;
                img {
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
}
</style>
