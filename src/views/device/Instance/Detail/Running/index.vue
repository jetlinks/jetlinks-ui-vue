<template>
    <div class="property-box">
        <div class="property-box-left">
            <j-input-search
                v-model:value="value"
                placeholder="请输入事件名称"
                style="width: 200px; margin-bottom: 10px"
                @search="onSearch"
                :allowClear="true"
            />
            <j-tabs
                tab-position="left"
                style="height: 600px"
                v-if="tabList.length"
                v-model:activeKey="activeKey"
                :tabBarStyle="{ width: '200px' }"
                @change="tabChange"
            >
                <j-tab-pane v-for="i in tabList" :key="i.key" :tab="i.tab" />
            </j-tabs>
            <JEmpty v-else style="margin: 180px 0" />
        </div>
        <div class="property-box-right">
            <Event v-if="type === 'event'" :data="data" />
            <Property v-else-if="type === 'property'" :data="properties" />
            <JEmpty v-else style="margin: 220px 0" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import _ from 'lodash';
import Event from './Event/index.vue';
import Property from './Property/index.vue';

const activeKey = ref<string>('property');
const tabList = ref<{ key: string; tab: string; type: 'property' | 'event' }[]>(
    [
        {
            key: 'property',
            tab: '属性',
            type: 'property',
        },
    ],
);
const type = ref<string>('property');
const data = ref<Record<string, any>>({});
const value = ref<string>('');
const instanceStore = useInstanceStore();
const metadata = JSON.parse(instanceStore.current?.metadata || '{}');
const properties = metadata.properties;
const events = metadata.events;

watch(
    () => events,
    (newVal) => {
        if (events && newVal.length) {
            newVal.map((item: any) => {
                tabList.value.push({
                    ...item,
                    key: item.id,
                    tab: item.name,
                    type: 'event',
                });
            });
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

const onSearch = () => {
    const arr = [
        {
            key: 'property',
            tab: '属性',
            type: 'property',
        },
        ...events.map((item: any) => {
            return {
                ...item,
                key: item.id,
                tab: item.name,
                type: 'event',
            };
        }),
    ];
    if (value.value) {
        const li = arr.filter((i: any) => {
            return i?.tab.indexOf(value.value) !== -1;
        });
        tabList.value = _.cloneDeep(li);
    } else {
        tabList.value = _.cloneDeep(arr);
    }
    const dt = tabList.value?.[0];
    if (dt) {
        data.value = dt;
        type.value = dt.type;
    } else {
        type.value = '';
    }
};
const tabChange = (key: string) => {
    const dt = tabList.value.find((i) => i.key === key);
    if (dt) {
        data.value = dt;
        type.value = dt.type;
    }
};
</script>

<style lang="less" scoped>
.property-box {
    display: flex;
    overflow: hidden;
    .property-box-left {
        width: 200px;
    }
    .property-box-right {
        flex: 1;
    }
}
</style>