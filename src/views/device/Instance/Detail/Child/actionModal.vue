<template>
    <a-modal visible :title="title" width="600px" @cancel="emits('close')">
        <template v-if="result.length === 0 && !loading">
            <div style="margin-bottom: 12px">
                {{
                    batch
                        ? typeMap.get(type).batchLabel
                        : typeMap.get(type).label
                }}
            </div>

            <a-form
                v-if="type !== 'unbind'"
                layout="vertical"
                :model="form"
                ref="formRef"
            >
                <a-form-item
                   
                    name="way"
                    :rules="{ required: true, message: '请选择方式' }"
                >
                    <template #label> {{ title }}方式 </template>
                    <j-card-select
                        :showImage="false"
                        v-model:value="form.way"
                        :column="2"
                        :options="options"
                    >
                        <!-- <template #image="{ image }">
                            <img :src="image" />
                        </template> -->
                    </j-card-select>
                </a-form-item>
            </a-form>
        </template>
        <div v-else-if="loading">
            <div class="loading">
                <a-spin />
                {{ title }}中...
            </div>
        </div>
        <template v-else>
            <div class="result">
                <div class="result-header">
                    <img :src="getImage('/diagnose/success.png')" />
                    <div>{{ title }}完成</div>
                </div>
                <a-space :size="24">
                    <div>云端</div>
                    <div>{{ title }}成功：{{ cloud.successCount }} 条</div>
                    <div style="width: 200px">
                        <span>
                            {{ title }}失败：{{
                                cloud.errorMessage.length
                            }}
                            条</span
                        >
                        <span style="width: 50px">
                            <a-tooltip v-if="cloud.errorMessage.length">
                                <template #title>
                                    <div v-for="item in cloud.errorMessage">
                                        <div>{{ item }}</div>
                                    </div>
                                </template>
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="
                                        color: red;
                                        font-size: 16px;
                                        margin-left: 12px;
                                    "
                                />
                            </a-tooltip>
                        </span>
                    </div>
                </a-space>
                <a-space
                    v-if="form.way[0] === 'edge'"
                    :size="24"
                    style="margin-top: 6px"
                >
                    <div>边端</div>
                    <div>{{ title }}成功：{{ edge.successCount }} 条</div>
                    <div style="width: 200px">
                        <span>
                            {{ title }}失败：{{
                                edge.errorMessage.length
                            }}
                            条</span
                        >
                        <span style="width: 50px">
                            <a-tooltip v-if="edge.errorMessage.length">
                                <template #title>
                                    <div v-for="item in edge.errorMessage">
                                        <div>{{ item }}</div>
                                    </div>
                                </template>
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="
                                        color: red;
                                        font-size: 16px;
                                        margin-left: 12px;
                                    "
                                />
                            </a-tooltip>
                        </span>
                    </div>
                </a-space>
            </div>
        </template>

        <template #footer>
            <a-space v-if="result.length === 0">
                <a-button @click="emits('close')">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSave">{{
                    title
                }}</a-button>
            </a-space>
            <a-button v-else type="primary" @click="emits('close')"
                >完成</a-button
            >
        </template>
    </a-modal>
</template>

<script setup name="Save">
import {
    _undeployCloud,
    _deployCloud,
    _unbindCloud,
    _deleteCloud,
    _delete,
    _deploy,
    _undeploy,
} from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { onlyMessage, getImage } from '@/utils/comm';

const emits = defineEmits(['close']);
const props = defineProps({
    type: {
        type: String,
        default: 'unbind',
    },

    rows: {
        type: Array,
        default: [],
    },
    batch: {
        type: Boolean,
        default: false,
    },
});
const instanceStore = useInstanceStore();
const typeMap = new Map();
typeMap.set('unbind', {
    title: '解绑',
    label: '确认解绑？若存在映射关系，将会删除该设备在边端的绑定关系',
    batchLabel:
        '确认解绑选中的设备？若存在映射关系，将会删除该设备在边端的绑定关系',
});
typeMap.set('undeploy', {
    title: '禁用',
    label: '确认禁用？',
    batchLabel: '确认禁用选中的设备？',
});
typeMap.set('deploy', {
    title: '启用',
    label: '确认启用？',
    batchLabel: '确认启用选中的设备？',
});
typeMap.set('delete', {
    title: '删除',
    label: '确认删除？',
    batchLabel: '确认删除选中的设备？',
});

const title = computed(() =>
    props.batch
        ? `批量${typeMap.get(props.type).title}`
        : typeMap.get(props.type).title,
);

const options = computed(() => [
    {
        label: `仅${title.value}平台设备`,
        value: 'cloud',
    },
    {
        label: `同步${title.value}边端设备`,
        value: 'edge',
    },
]);

const edgeId = instanceStore.detail.id;
const form = reactive({
    way: ['cloud'],
});
const formRef = ref();
const result = ref([]);
const loading = ref(false);
const cloud = reactive({
    successCount: 0,
    errorMessage: [],
});
const edge = reactive({
    successCount: 0,
    errorMessage: [],
});
const handleResult = (arr) => {
    arr.forEach((item) => {
        if (item.type === 'cloud') {
            if (item.success) {
                cloud.successCount = item.successCount;
            } else {
                cloud.errorMessage.push(item.errorMessage);
            }
        } else {
            if (item.success) {
                edge.successCount = item.successCount;
            } else {
                edge.errorMessage.push(item.errorMessage);
            }
        }
    });
};

const _unbind = async () => {
    const res = await _unbindCloud(edgeId, props.rows).finally(() => {
        loading.value = false;
    });
    if (res.success) {
        if (props.batch) {
            result.value = res.result;
            handleResult(res.result);
        } else {
            onlyMessage('操作成功');
            emits('close');
        }
    }
};
const onUndeploy = async () => {
    const res =
        form.way[0] === 'cloud'
            ? props.batch
                ? await _undeployCloud(edgeId, props.rows, {
                      syncEdge: false,
                  }).finally(() => {
                      loading.value = false;
                  })
                : await _undeploy(props.rows?.[0]).finally(() => {
                      loading.value = false;
                  })
            : await _undeployCloud(edgeId, props.rows).finally(() => {
                  loading.value = false;
              });
    if (res.success) {
        if (props.batch) {
            result.value = res.result;
            handleResult(res.result);
        } else {
            onlyMessage('操作成功');
            emits('close');
        }
    }
};
const onDelete = async () => {
    const res =
        form.way[0] === 'cloud'
            ? // ? props.batch
              //     ? await _deleteCloud(edgeId, props.rows, {
              //           syncEdge: false,
              //       }).finally(() => {
              //           loading.value = false;
              //       })
              //     : await _delete(props.rows?.[0]).finally(() => {
              //           loading.value = false;
              //       })
              await _deleteCloud(edgeId, props.rows, {
                  syncEdge: false,
              }).finally(() => {
                  loading.value = false;
              })
            : await _deleteCloud(edgeId, props.rows).finally(() => {
                  loading.value = false;
              });
    if (res.success) {
        if (props.batch) {
            result.value = res.result;
            handleResult(res.result);
        } else {
            onlyMessage('操作成功');
            emits('close');
        }
    }
};

const onDeploy = async () => {
    const res =
        form.way[0] === 'cloud'
            ? props.batch
                ? await _deployCloud(edgeId, props.rows, {
                      syncEdge: false,
                  }).finally(() => {
                      loading.value = false;
                  })
                : await _deploy(props.rows?.[0]).finally(() => {
                      loading.value = false;
                  })
            : await _deployCloud(edgeId, props.rows).finally(() => {
                  loading.value = false;
              });
    if (res.success) {
        if (props.batch) {
            result.value = res.result;
            handleResult(res.result);
        } else {
            onlyMessage('操作成功');
            emits('close');
        }
    }
};

const onSave = async () => {
    loading.value = true;
    if (props.type === 'unbind') {
        _unbind();
    } else if (props.type === 'undeploy') {
        onUndeploy();
    } else if (props.type === 'deploy') {
        onDeploy();
    } else {
        onDelete();
    }
};

watch(
    () => form.way,
    () => {
        console.log('form.way====', form.way);
    },
);
</script>

<style lang="less" scoped>
.result {
    display: flex;
    flex-direction: column;
    align-items: center;
    .result-header {
        margin-bottom: 12px;
    }
}
.loading {
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
