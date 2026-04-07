<template>
    <div>
        <a-steps :current="current">
            <a-step disabled :key="0" :title="$t('Plugin.index.626239-0')" />
            <a-step disabled :key="1" :title="$t('Plugin.index.626239-1')" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="search">
                    <a-input-search
                        allowClear
                        :placeholder="$t('Plugin.index.626239-2')"
                        style="width: 300px"
                        @search="pluginSearch"
                    />
                    <j-permission-button
                        v-if="showAddBtn"
                        type="primary"
                        @click="addPlugin"
                        hasPermission="link/plugin:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Plugin.index.626239-3') }}
                    </j-permission-button>
                </div>
                <j-scrollbar height="480">
                    <a-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="pluginList.length > 0"
                    >
                        <a-col
                            :span="8"
                            v-for="item in pluginList"
                            :key="item.id"
                        >
                            <AccessCard
                                @checkedChange="AccessChange"
                                :checked="AccessCurrent"
                                :disabled="!showAddBtn"
                                :data="{ ...item, type: 'plugin' }"
                            >
                                <template #other>
                                    <div class="plugin-other">
                                        <div class="plugin-id">
                                            <div class="plugin-text">
                                                {{ $t('Plugin.index.626239-4') }}
                                            </div>
                                            <div class="other-content">
                                                <j-ellipsis>
                                                    {{ item.id }}
                                                </j-ellipsis>
                                            </div>
                                        </div>
                                        <div class="plugin-version">
                                            <div class="plugin-text">
                                                {{ $t('Plugin.index.626239-5') }}
                                            </div>
                                            <div class="other-content">
                                                <j-ellipsis>
                                                    {{ item.version }}
                                                </j-ellipsis>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </AccessCard>
                        </a-col>
                    </a-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        :description="$t('Plugin.index.626239-6')"
                    />
                </j-scrollbar>
            </div>
            <div class="steps-box" v-else-if="current === 1">
                <div
                    class="card-last"
                    :style="`max-height:${
                        clientHeight > 900 ? 750 : clientHeight * 0.7
                    }px`"
                >
                    <a-row :gutter="[24, 24]">
                        <a-col :span="16">
                            <title-component :data="$t('Plugin.index.626239-7')" />
                            <a-form
                                ref="formRef"
                                :model="formData"
                                layout="vertical"
                            >
                                <a-form-item
                                    :label="$t('Plugin.index.626239-8')"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Plugin.index.626239-9'),
                                            trigger: 'blur',
                                        },
                                        {
                                            max: 64,
                                            message: $t('Plugin.index.626239-10'),
                                        },
                                    ]"
                                    name="name"
                                >
                                    <a-input
                                        v-model:value="formData.name"
                                        allowClear
                                        :placeholder="$t('Plugin.index.626239-9')"
                                    />
                                </a-form-item>
                                <a-form-item
                                    :label="$t('Plugin.index.626239-11')"
                                    :rules="[
                                        {
                                            max: 200,
                                            message: $t('Plugin.index.626239-12'),
                                        },
                                    ]"
                                    name="description"
                                >
                                    <a-textarea
                                        :placeholder="$t('Plugin.index.626239-13')"
                                        :rows="4"
                                        v-model:value="formData.description"
                                        show-count
                                        :maxlength="200"
                                    />
                                </a-form-item>
                                <template v-if="config.length">
                                    <title-component :data="$t('Plugin.index.626239-14')" />
                                    <a-form-item
                                        v-for="item in config"
                                        :key="item.name"
                                        :name="['configuration', item.name]"
                                        :label="item.label"
                                        :rules="item.rules"
                                        :required="
                                            !!item.type?.expands?.required
                                        "
                                    >
                                        <j-value-item
                                            v-model:modelValue="
                                                formData.configuration[
                                                    item.name
                                                ]
                                            "
                                            :itemType="item.type"
                                            :options="item.options"
                                        />
                                    </a-form-item>
                                </template>
                            </a-form>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="steps-action">
            <a-button
                v-if="current > 0"
                @click="prev"
                style="margin-right: 8px"
            >
                {{ $t('Plugin.index.626239-15') }}
            </a-button>

            <j-permission-button
                v-if="current === 1 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
            >
                {{ $t('Plugin.index.626239-16') }}
            </j-permission-button>
            <a-button v-if="current === 0" type="primary" @click="next">
                {{ $t('Plugin.index.626239-17') }}
            </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessConfigPlugin">
import {
    save,
    update,
    getPluginList,
    getPluginConfig,
} from '../../../../../api/link/accessConfig';
import AccessCard from '../AccessCard/index.vue';
import { useMenuStore } from '@jetlinks-web-core/store/menu';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { CreteRuleByType } from '../../../components/Form/rules';
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
    bindProduct: {
        type: Boolean,
        default: false,
    },
});

const route = useRoute();
const menuStory = useMenuStore();

const current = ref(0);
const pluginList = ref([]);
const AccessCurrent = ref(props.data.channelId);
const paramsId = route.params.id as string;
const view = route.query.view as string;
const clientHeight = document.body.clientHeight;
const loading = ref(false);

const formData = reactive({
    name: undefined,
    description: undefined,
    configuration: {},
});
const formRef = ref();

const config = ref<any>([]);
const { onBack } = useTabSaveSuccessBack()

const queryPlugin = (params = {}) => {
    getPluginList({
        terms: [
            {
                terms: [
                    {
                        column: 'type',
                        value: props.provider.id === 'media-plugin' ? 'media' : 'deviceGateway',
                        termType: 'eq',
                    },
                ],
            },
            params,
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
        paging: false,
    }).then((res) => {
        pluginList.value = [];
        if (res.success) {
            pluginList.value = res.result || [];
        }
    });
};

const showAddBtn = computed(() => {
    return route.query.view === 'false' && !props.bindProduct;
});

const getRules = (item: any) => {
    let typeName = $t('Plugin.index.626239-18');
    let rules: any[] = [];

    if (['select', 'date'].includes(item.type?.type || 'string')) {
        typeName = $t('Plugin.index.626239-19');
    }

    if (item.type?.expands?.required) {
        rules.push({
            required: true,
            message: $t('Plugin.index.626239-20', [typeName,item.name]),
        });
    }

    const typeRules = CreteRuleByType(item.type?.type);
    rules = [...rules, ...typeRules];
    return rules;
};

const handleOptions = (record) => {
  const type = record.type
  const options = []

  if (type === 'boolean') {
    options.push({
      label: record.falseText,
      value: record.falseValue,
    },{
      label: record.trueText,
      value: record.trueValue,
    });
  }

  if (type === 'enum') {
    record.elements.forEach(element => {
      options.push({
        label: element.text,
        value: element.value,
      })
    })
  }

  return options;
}

const queryPluginConfig = (id: string, update: boolean = true) => {
    getPluginConfig(id).then((res) => {
        if (res.success) {
            const properties =
                res.result?.others?.configMetadata?.properties || [];
            config.value = properties.map((item: any) => {
                if (update) {
                    formData.configuration[item.property] = undefined;
                }
                return {
                    label: item.name,
                    name: item.property,
                    type: item.type?.type || 'string',
                    rules: getRules(item),
                    options: handleOptions(item.type)
                };
            });
        }
    });
};

const pluginSearch = (val: string) => {
    queryPlugin({
        terms: [
            {
                column: 'name',
                termType: 'like',
                value: `%${val}%`,
            },
        ],
        type: 'and',
    });
};

const AccessChange = (id: string) => {
    AccessCurrent.value = id;
};

const addPlugin = () => {
    const url = menuStory.getMenu('link/plugin')?.path;
    const wd: any = window.open(
        `${window.location.origin + window.location.pathname}#${url}?save=true`,
    );
    wd.onTabSaveSuccess = (value: any) => {
        if (value.success) {
            AccessCurrent.value = value.result?.id;
            pluginList.value.unshift(value.result as any);
        }
    };
};

/**
 * 下一步
 */
const next = () => {
    if (!AccessCurrent.value) {
        return onlyMessage($t('Plugin.index.626239-21'), 'error');
    }
    current.value += 1;
};

/**
 * 上一步
 */
const prev = () => {
    current.value -= 1;
};

/**
 * 保存
 */
const saveData = () => {
    formRef.value.validate().then(async (data: any) => {
        if (data) {
            const params = {
                ...props.data,
                ...data,
                protocol:
                    props.provider.id === 'media-plugin'
                        ? props.provider.id
                        : 'plugin_gateway',
                channel: 'plugin', // 网络组件
                channelId: AccessCurrent.value,
                provider: props.provider.id,
                transport: 'plugin',
            };
            if(route.query.provider) {
                onBack({
                  ...params,
                  protocolDetail: pluginList.value.find((i: any) => i.id === AccessCurrent.value),
                })
                return
            }
            loading.value = true;
            const resp =
                paramsId === ':id'
                    ? await save(params).catch(() => {
                          success: false;
                      })
                    : await update({ ...params, id: paramsId }).catch(() => {
                          success: false;
                      });
            loading.value = false;
            if (resp.success) {
                onlyMessage($t('Plugin.index.626239-22'), 'success');
                history.back();
                onBack(resp)
            }
        }
    });
};

watchEffect(() => {
    if (current.value === 1 && AccessCurrent.value) {
        queryPluginConfig(
            AccessCurrent.value,
            AccessCurrent.value !== props.data.channelId,
        );
    }
});

onMounted(() => {
    if (paramsId !== ':id') {
        // 编辑，回显表单值
        formData.name = props.data.name;
        formData.description = props.data.description;
        formData.configuration = props.data.configuration;
    }
});

queryPlugin();
</script>

<style scoped lang="less">
.steps-content {
    margin-top: 20px;
}
.steps-box {
    min-height: 400px;
    .card-last {
        padding-right: 5px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
.steps-action {
    width: 100%;
    margin-top: 24px;
}
.alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
.search {
    display: flex;
    margin: 15px 0;
    justify-content: space-between;
}

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
