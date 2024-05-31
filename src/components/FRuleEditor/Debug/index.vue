<template>
    <div class="debug-container">
        <div class="top">
            <div class="header">
                <j-tabs v-model:activeKey="headerType">
                    <j-tab-pane key="property">
                        <template #tab>
                            <span class="title">
                                属性赋值
                            </span>
                        </template>
                    </j-tab-pane>
                    <j-tab-pane key="tag">
                        <template #tab>
                            <span class="title">
                                标签赋值
                            </span>
                        </template>
                    </j-tab-pane>
                </j-tabs>
                <!-- <div>
                    <j-dropdown>
                        <div class="title" @click.prevent>
                            {{
                                headerType === 'property'
                                    ? '属性赋值'
                                    : '标签赋值'
                            }}
                            <div class="description">
                                {{
                                    `请对上方规则使用的${
                                        headerType === 'property'
                                            ? '属性'
                                            : '标签'
                                    }进行赋值`
                                }}
                            </div>
                        </div>
                        <template #overlay>
                            <j-menu>
                                <j-menu-item>
                                    <a
                                        href="javascript:;"
                                        @click="headerType = 'property'"
                                        >属性赋值</a
                                    >
                                </j-menu-item>
                                <j-menu-item>
                                    <a
                                        href="javascript:;"
                                        @click="headerType = 'tag'"
                                        >标签赋值</a
                                    >
                                </j-menu-item>
                            </j-menu>
                        </template>
                    </j-dropdown>
                </div> -->
            </div>
            <div class="description">
                {{
                    `请对上方规则使用的${
                        headerType === 'property' ? '属性' : '标签'
                    }进行赋值`
                }}
            </div>
            <div class="top-bottom" v-if="headerType === 'property'">
                <j-table
                    :columns="columns"
                    :data-source="property"
                    :pagination="false"
                    bordered
                    size="small"
                    :scroll="{ y: 200 }"
                >
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'id'">
                            <j-select
                                showSearch
                                :options="options"
                                v-model:value="record.id"
                                :getPopupContainer="(node) => tableWrapperRef || node"
                                size="small"
                                style="width: 100%; z-index: 1400 !important"
                            />
                        </template>
                        <template v-if="column.key === 'current'">
                            <j-input
                                v-model:value="record.current"
                                size="small"
                            ></j-input>
                        </template>
                        <template v-if="column.key === 'last'">
                            <j-input
                                v-model:value="record.last"
                                size="small"
                            ></j-input>
                        </template>
                        <template v-if="column.key === 'action'">
                            <AIcon
                                type="DeleteOutlined"
                                @click="deleteItem(index)"
                            />
                        </template>
                    </template>
                </j-table>
                <j-button
                    type="dashed"
                    block
                    style="margin-top: 5px"
                    @click="addItem"
                >
                    <template #icon>
                        <AIcon type="PlusOutlined" />
                    </template>
                    添加条目
                </j-button>
            </div>
            <div class="top-bottom" v-if="headerType === 'tag'">
                <j-table
                    :columns="tagColumns"
                    :data-source="tag"
                    :pagination="false"
                    bordered
                    size="small"
                    :scroll="{ y: 200 }"
                >
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'id'">
                            <j-select
                                showSearch
                                :options="tagOptions"
                                v-model:value="record.id"
                                size="small"
                                style="width: 100%; z-index: 1400 !important"
                                :getPopupContainer="(node) => tableWrapperRef || node"
                            />
                        </template>
                        <template v-if="column.key === 'current'">
                            <j-input
                                v-model:value="record.current"
                                size="small"
                            ></j-input>
                        </template>
                        <template v-if="column.key === 'action'">
                            <AIcon
                                type="DeleteOutlined"
                                @click="deleteTagItem(index)"
                            />
                        </template>
                    </template>
                </j-table>
                <j-button
                    type="dashed"
                    block
                    style="margin-top: 5px"
                    @click="addTagItem"
                >
                    <template #icon>
                        <AIcon type="PlusOutlined" />
                    </template>
                    添加条目
                </j-button>
            </div>
        </div>
        <div class="bottom">
            <div class="header">
                <div class="title">
                    <div>运行结果</div>
                    <div v-if="virtualRule?.script && !isBeginning">
                        正在运行......
                    </div>
                </div>
                <div class="action">
                    <div
                        v-if="!isBeginning && virtualRule?.type === 'window'"
                        class="action"
                        @click="runScriptAgain"
                    >
                        <a style="margin-left: 75px">发送数据</a>
                    </div>
                    <div v-if="virtualRule?.script">
                        <a v-if="isBeginning" @click="beginAction">
                            开始运行
                        </a>
                        <a v-else @click="stopAction"> 停止运行 </a>
                    </div>
                    <div>
                        <a @click="clearAction"> 清空 </a>
                    </div>
                </div>
            </div>
            <div class="log">
                <j-descriptions>
                    <j-descriptions-item
                        v-for="(item, index) in ruleEditorStore.state.log"
                        :key="item.time"
                        :span="3"
                    >
                        <template #label>
                            <template
                                v-if="!!runningState(index + 1, item._time)"
                            >
                                {{ runningState(index + 1, item._time) }}
                            </template>
                            <template v-else>{{
                                moment(item.time).format('HH:mm:ss')
                            }}</template>
                        </template>
                        <div v-if="!!runningState(index + 1, item._time)">
                            {{ moment(item.time).format('HH:mm:ss') }}
                        </div>
                        <j-tooltip placement="top" :title="item.content">
                            {{ item.content }}
                        </j-tooltip>
                    </j-descriptions-item>
                </j-descriptions>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" name="Debug">
import { PropType, Ref } from 'vue';
import { useProductStore } from '@/store/product';
import { useRuleEditorStore } from '@/store/ruleEditor';
import moment from 'moment';
import { getWebSocket } from '@/utils/websocket';
import {useTableWrapper} from "@/components/Metadata/Table/utils";
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    virtualRule: Object as PropType<Record<any, any>>,
    id: String,
});
const emits = defineEmits(['success']);

const isBeginning = ref(true);

type propertyType = {
    id?: string;
    current?: string;
    last?: string;
};
const property = ref<propertyType[]>([]);
const tag = ref<Array<any>>([]);
const tableWrapperRef = useTableWrapper()

const headerOptions = [
    {
        key: 'property',
        label: '属性赋值',
        title: '属性赋值',
    },
    {
        key: 'tag',
        label: '标签赋值',
        title: '标签赋值',
    },
];
const columns = [
    {
        title: '属性名称',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '当前值',
        dataIndex: 'current',
        key: 'current',
    },
    {
        title: '上一值',
        dataIndex: 'last',
        key: 'last',
    },
    {
        title: '操作',
        key: 'action',
        width: 50,
    },
];

const tagColumns = [
    {
        title: '属性名称',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '当前值',
        dataIndex: 'current',
        key: 'current',
    },
    {
        title: '操作',
        key: 'action',
        width: 50,
    },
];
const headerType = ref('property');
const addItem = () => {
    property.value.push({});
};
const addTagItem = () => {
    tag.value.push({});
};
const deleteItem = (index: number) => {
    property.value.splice(index, 1);
};
const deleteTagItem = (index: number) => {
    tag.value.splice(index, 1);
};

const ws = ref();

const virtualIdRef = ref(new Date().getTime());
const medataSource = inject<Ref<any[]>>('_dataSource');
const tagsSource = inject<Ref<any[]>>('_tagsDataSource');
const productStore = useProductStore();
const ruleEditorStore = useRuleEditorStore();

const time = ref<number>(0);
const timer = ref<any>(null);

const runScript = () => {
    const metadata = productStore.current.metadata || '{}';
    const propertiesList = JSON.parse(metadata).properties || [];
    const _properties = property.value.map((item: any) => {
        const _item = propertiesList.find((i: any) => i.id === item.id);
        return { ...item, type: _item?.valueType?.type };
    });
    let _tags = {};
    tag.value.forEach((item) => {
        _tags[item.id] = item.current;
    });
    if (ws.value) {
        ws.value.unsubscribe?.();
    }
    if (!props.virtualRule?.script) {
        isBeginning.value = true;
        onlyMessage('请编辑规则', 'warning');
        return;
    }

    ws.value = getWebSocket(
        `virtual-property-debug-${props.id}-${new Date().getTime()}`,
        '/virtual-property-debug',
        {
            virtualId: `${virtualIdRef.value}-virtual-id`,
            property: props.id,
            virtualRule: {
                ...props.virtualRule,
            },
            properties: _properties || [],
            tags: _tags,
        },
    ).subscribe((data: any) => {
        ruleEditorStore.state.log.push({
            time: new Date().getTime(),
            content: JSON.stringify(data.payload),
            _time: unref(time.value),
        });
        emits('success', false);
        if (props.virtualRule?.type !== 'window') {
            stopAction();
        }
    }, () => {}, () => {
      ruleEditorStore.state.log.push({
        time: new Date().getTime(),
        content: '运行结束',
        _time: unref(time.value),
      });
      stopAction()
    });
};

const runningState = (_index: number, _time: number) => {
    if (props.virtualRule?.windowType === 'time') {
        return `已运行${_time}秒`;
    }
    if (props.virtualRule?.windowType === 'num') {
        return `第${_index}次运行`;
    }
    return false;
};

const wsAgain = ref<any>();
const runScriptAgain = async () => {
    if (wsAgain.value) {
        wsAgain.value.unsubscribe?.();
    }
    const metadata = productStore.current.metadata || '{}';
    const propertiesList = JSON.parse(metadata).properties || [];
    const _properties = property.value.map((item: any) => {
        const _item = propertiesList.find((i: any) => i.id === item.id);
        return { ...item, type: _item?.valueType?.type };
    });

    wsAgain.value = getWebSocket(
        `virtual-property-debug-${props.id}-${new Date().getTime()}`,
        '/virtual-property-debug',
        {
            virtualId: `${virtualIdRef.value}-virtual-id`,
            property: props.id,
            virtualRule: {
                ...props.virtualRule,
            },
            properties: _properties || [],
        },
    ).subscribe((data: any) => {});
};

const getTime = () => {
    time.value = 0;
    timer.value = setInterval(() => {
        time.value += 1;
    }, 1000);
};

const beginAction = () => {
    isBeginning.value = false;
    runScript();
    getTime();
};
const stopAction = () => {
    isBeginning.value = true;
    if (ws.value) {
        ws.value.unsubscribe?.();
    }
    window.clearInterval(timer.value);
    timer.value = null;
};
const clearAction = () => {
    ruleEditorStore.set('log', []);
};

onUnmounted(() => {
    if (ws.value) {
        ws.value.unsubscribe?.();
    }
    clearAction();
    window.clearInterval(timer.value);
    timer.value = null;
});

const options = computed(() => {
    return (medataSource.value || [])
        .filter((p) => p.id !== props.id)
        .map((item) => ({
            label: item.name,
            value: item.id,
        }));
});

const tagOptions = computed(() => {
    return (tagsSource.value || []).map((item) => ({
        label: item.name,
        value: item.id,
    }));
});

// const getProperty = () => {
//     // const metadata = productStore.current.metadata || '{}';
//     // const _p: PropertyMetadata[] = JSON.parse(metadata).properties || [];
//   console.log(medataSource.value)
//     options.value =
// };
// getProperty();
</script>
<style lang="less" scoped>
.debug-container {
    // display: flex;
    // width: 100%;
    // height: 340px;
    // margin-top: 20px;

    .top {
        // min-width: 0;
        // max-width: 550px;
        // overflow-y: auto;
        height: 350px;
        border: 1px solid lightgray;
        margin-bottom: 10px;

        .header {
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            border-bottom: 1px solid lightgray;
            //justify-content: space-around;

            div {
                display: flex;
                //width: 100%;
                align-items: center;
                justify-content: flex-start;
                height: 100%;

                .title {
                    margin: 0 10px;
                    font-weight: 600;
                    font-size: 16px;
                }

                .description {
                    margin-left: 10px;
                    color: lightgray;
                    font-size: 12px;
                }
            }

            .action {
                width: 150px;
                font-size: 14px;
            }
        }

        .top-bottom {
            padding: 10px;
        }
    }

    .bottom {
        border: 1px solid lightgray;
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 40px;
            border-bottom: 1px solid lightgray;

            .title {
                display: flex;

                div {
                    margin: 0 10px;
                }
            }

            .action {
                display: flex;

                div {
                    margin: 0 10px;
                }
            }
        }

        .log {
            height: 300px;
            padding: 5px;
            overflow: auto;
        }
    }
}
</style>
