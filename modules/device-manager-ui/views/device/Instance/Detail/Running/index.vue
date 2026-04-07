<template>
    <div class="property-box">
        <div class="property-box-left">
            <a-input-search
                v-model:value="value"
                :placeholder="$t('Running.index.376017-0')"
                style="width: 200px; margin-bottom: 10px"
                @search="onSearch"
                :allowClear="true"
            />
            <a-tabs
                tab-position="left"
                style="height: calc(100% - 32px)"
                v-if="tabList.length"
                v-model:activeKey="activeKey"
                :tabBarStyle="{ width: '200px' }"
                @change="tabChange"
            >
                <a-tab-pane v-for="i in tabList" :key="i.key">
                    <template #tab>
                        <a-tooltip>
                            <template #title>
                                {{ i.tab }}
                            </template>
                            <div style="max-width: 150px" class="tabTitle">
                                {{ i.tab }}
                            </div>
                        </a-tooltip>
                    </template>
                </a-tab-pane>
            </a-tabs>
            <JEmpty v-else style="margin: 180px 0" />
        </div>
        <div class="property-box-right">
            <Event v-if="type === 'event'" :data="data" :key="activeKey"/>
            <Property v-else-if="type === 'property'" :data="properties" />
            <JEmpty v-else style="margin: 220px 0" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '../../../../../store/instance';
import { cloneDeep } from 'lodash-es';
import Event from './Event/index.vue';
import Property from './Property/index.vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const activeKey = ref<string>('property');
const tabList = ref<{ key: string; tab: string; type: 'property' | 'event' }[]>(
    [
        {
            key: 'property',
            tab: $t('Running.index.376017-1'),
            type: 'property',
        },
    ],
);
const type = ref<string>('property');
const data = ref<Record<string, any>>({});
const value = ref<string>('');
const instanceStore = useInstanceStore();
const { current } = storeToRefs(instanceStore);

const properties: any = ref(undefined);
const events: any = ref(undefined);

watch(
    () => current.value,
    (value) => {
        tabList.value = [{
            key: 'property',
            tab: $t('Running.index.376017-1'),
            type: 'property',
        }]
        const metadata = JSON.parse(value?.metadata || '{}');
        properties.value = metadata.properties;
        events.value = metadata.events;
        if (events.value && events.value.length) {
            events.value.map((item: any) => {
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
        immediate: true,
        deep: true,
    },
);
// watch(
//     () => events.value,
//     (newVal) => {
//         console.log(events.value,'test')
//         if (events.value && newVal.length) {
//             newVal.map((item: any) => {
//                 tabList.value.push({
//                     ...item,
//                     key: item.id,
//                     tab: item.name,
//                     type: 'event',
//                 });
//             });
//         }
//     },
//     {
//         deep: true,
//         immediate: true,
//     },
// );

const onSearch = () => {
    const arr = [
        {
            key: 'property',
            tab: $t('Running.index.376017-1'),
            type: 'property',
        },
        ...events.value.map((item: any) => {
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
        tabList.value = cloneDeep(li);
    } else {
        tabList.value = cloneDeep(arr);
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
    height: 100%;

    .property-box-left {
        width: 200px;
      height: 100%;
    }
    .property-box-right {
        flex: 1;
        min-width: 0;
        height: 100%;
      :deep(.ant-spin-nested-loading) {
        height: 100%;
        .ant-spin-container {
          height: 100%;
        }
      }
    }
}
.tabTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
