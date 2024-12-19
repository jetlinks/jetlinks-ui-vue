<template>
    <page-container :showBack="true">
        <template #title>
            <div>资源详情</div>
        </template>
        <FullPage>
            <a-space>
                <a-button @click="visibleApply = true">应用资源</a-button>
                <a-button @click="visible = true">检查更新</a-button>
                <a-button @click="visibleCollector = true">应用资源(数采)</a-button>
            </a-space>
        </FullPage>
        <Update v-if="visible" :data="data" @close="visible = false"/>
        <Apply v-if="visibleApply" :data="data" @close="visibleApply = false"/>
        <ApplyCollector v-if="visibleCollector" :data="data" @close="visibleCollector = false"/>
    </page-container>
</template>

<script setup lang="ts" name="Detail">
import  Update  from './Update/index.vue';
import Apply from './Apply/index.vue'
import ApplyCollector from './ApplyCollector/index.vue'

const props = defineProps({
    data: {
        type: Object,
    },
});

const visible = ref(false);
const visibleApply = ref(false);
const visibleCollector = ref(false);

</script>

<style lang="less" scoped></style>
