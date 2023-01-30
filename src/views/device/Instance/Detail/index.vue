<template>
    <page-container :tabList="list" @back="onBack" :tabActiveKey="instanceStore.active" @tabChange="onTabChange">
        <template #subTitle><div>{{instanceStore.current.name}}</div></template>
        <component :is="instanceStore.tabActiveKey" />
    </page-container>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Info from './Info/index.vue';
import Metadata from '../../components/Metadata/index.vue';
const route = useRoute();
const instanceStore = useInstanceStore()

const list = [
    {
        key: 'Info',
        tab: '实例信息'
    },
    {
        key: 'Metadata',
        tab: '物模型'
    }
]

const tabs = {
  Info,
  Metadata
}

watch(
    () => route.params.id,
    (newId) => {
        if(newId){
            instanceStore.tabActiveKey = 'Info'
            instanceStore.refresh(newId as string)
        }
    },
    {immediate: true, deep: true}
);

const onBack = () => {

}

const onTabChange = (e: string) => {
    instanceStore.tabActiveKey = e
}
</script>