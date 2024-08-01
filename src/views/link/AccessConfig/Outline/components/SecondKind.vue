<template>
    <div>
        <TitleComponent data="插件" v-if="plugin"> </TitleComponent>
        <AccessCard v-if="plugin" :data="{ ...plugin, type: 'plugin' }">
            <template #other>
                <div class="plugin-other">
                    <div class="plugin-id">
                        <div class="plugin-text">插件ID：</div>
                        <div class="other-content">
                            <j-ellipsis>
                                {{ plugin.id }}
                            </j-ellipsis>
                        </div>
                    </div>
                    <div class="plugin-version">
                        <div class="plugin-text">版本号：</div>
                        <div class="other-content">
                            <j-ellipsis>
                                {{ plugin.version }}
                            </j-ellipsis>
                        </div>
                    </div>
                </div>
            </template>
        </AccessCard>
        <TitleComponent data="通用配置" style="margin-top: 20px" v-if="configuration.length">
        </TitleComponent>
        <a-descriptions bordered :column="1" v-if="configuration.length">
          <a-descriptions-item v-for="i in configuration" :label="i.name">{{ i.value }}</a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script setup>
import {
    getPluginList,
    getPluginConfig,
    detail,
} from '@/api/link/accessConfig';
import AccessCard from '../../components/AccessCard/index.vue';
const props = defineProps({
    data: {
        type: Object,
    },
});
const plugin = ref();
const config = ref();
const configuration = ref([]);
const configurationMap = new Map();
const queryPlugin = () => {
    getPluginList({
        terms: [
            {
                terms: [
                    {
                        column: 'type',
                        value:
                            props.data.provider === 'media-plugin'
                                ? 'media'
                                : 'deviceGateway',
                        termType: 'eq',
                    },
                ],
            },
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
        paging: false,
    }).then((res) => {
        if (res.success) {
            plugin.value = res.result.find((i) => {
                return i.id === props.data?.channelId;
            });
        }
    });
};

const queryPluginConfig = async () => {
    const res = await getPluginConfig(props.data.channelId);
    if (res.success) {
        const properties = res.result?.others?.configMetadata?.properties || [];
        config.value = properties.forEach((item) => {
            configurationMap.set(item.property, item.name);
        });
    }
};
const queryDetail = async () => {
    const res = await detail(props.data.id);
    if (res.success) {
        Object.keys(res.result?.configuration || {}).forEach((i)=>{
          if(configurationMap.has(i)){
            configuration.value.push({
              name: configurationMap.get(i),
              value: res.result.configuration[i]
            })
          }
        })
    }
};
onMounted(() => {
    queryPlugin();
    queryPluginConfig();
    queryDetail();
});
</script>
<style lang="less" scoped>
.other {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.plugin-other {
    display: flex;
    gap: 16px;
    .plugin-id,
    .plugin-version {
        color: rgba(0, 0, 0, 0.85);
        opacity: 0.45;
        display: flex;

        .plugin-text {
            white-space: nowrap;
        }
    }

    .plugin-id {
        width: 50%;
        // .other-content {
        //   display: flex;
        //   width: 0;
        //   flex-grow: 1;
        // }
    }
}
</style>
