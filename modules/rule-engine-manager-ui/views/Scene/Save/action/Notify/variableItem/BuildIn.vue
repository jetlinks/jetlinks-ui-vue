<template>
    <a-input-group compact>
        <a-select
            style="width: 120px"
            :value="value?.source"
            @change="sourceChange"
        >
            <a-select-option value="fixed">{{ $t('variableItem.BuildIn.352749-0') }}</a-select-option>
            <a-select-option value="upper">
                <span style="margin-right: 4px;">{{ $t('variableItem.BuildIn.352749-1') }}</span>
                <a-tooltip>
                    <template #title>{{ $t('variableItem.BuildIn.352749-2') }}</template>
                    <AIcon type="QuestionCircleOutlined"></AIcon>
                </a-tooltip>
            </a-select-option>
        </a-select>
        <template v-if="source === 'upper'">
            <a-tree-select
                v-model:value="upperKey"
                :treeData="builtInList"
                :placeholder="$t('variableItem.BuildIn.352749-3')"
                style="width: calc(100% - 120px)"
                :fieldNames="{ label: 'name', value: 'id' }"
                @change="
                    (val, label, extra) =>
                        itemOnChange(undefined, val, label, extra)
                "
            >
                <template #title="{ fullName, description }">
                    <a-space>
                        {{ fullName }}
                        <span style="color: grey; margin-left: 5px">{{
                            description
                        }}</span>
                    </a-space>
                </template>
            </a-tree-select>
        </template>
        <template v-else>
            <a-date-picker
                :value="value.value"
                allowClear
                valueFormat="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: calc(100% - 120px)"
                v-if="item.type === 'date'"
                @change="(_, dateString) => itemOnChange(dateString)"
            />
            <a-input-number
                :value="value.value"
                allowClear
                style="width: calc(100% - 120px)"
                v-else-if="item.type === 'number'"
                :placeholder="$t('variableItem.BuildIn.352749-4', [item.name])"
                @change="itemOnChange"
            />
            <a-input
                :value="value.value"
                allowClear
                style="width: calc(100% - 120px)"
                v-else
                :placeholder="$t('variableItem.BuildIn.352749-4', [item.name])"
                @change="(e) => itemOnChange(e.target.value)"
            />
        </template>
    </a-input-group>
</template>

<script lang="ts" setup name="NotifyBuildIn">
import { queryBuiltInParams } from '@rule-engine-manager-ui/api/scene';
import { useSceneStore } from '@rule-engine-manager-ui/store/scene';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n'
import {ACTION_DATA} from "@rule-engine-manager-ui/views/Scene/Save/util";

const { t: $t } = useI18n()
const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const props = defineProps({
    value: {
        type: Object,
        default: () => {
            return {
                source: 'fixed',
                value: undefined,
                upperKey: undefined,
            };
        },
    },
    item: {
        type: Object,
        default: () => {},
    },
    branchesName: {
      type: Number,
      default: 0,
    },
    branchesGroup: {
      type: Number,
      default: 0,
    },
    name: {
      type: Number,
      default: 0,
    },
    thenName: {
      type: Number,
      default: 0,
    },
});

const emit = defineEmits(['update:value', 'change']);
const action_data = inject(ACTION_DATA)
const source = computed(() => {
    return props.value?.source || 'fixed';
});

const builtInList = ref<any[]>([]);
const upperKey = ref(props.value?.upperKey);

const sourceChange = (val: any) => {
    emit('update:value', {
        ...props.value,
        source: val,
        value: undefined,
    });
};

const itemOnChange = (
    val: any,
    _upperKey?: string,
    label?: any,
    extra?: any,
) => {
    const item = extra?.triggerNode?.props;
    let othersColumns = '';
    if (item && item.metadata) {
        othersColumns = item.column;
    }

    emit('update:value', {
        ...props.value,
        value: val,
        upperKey: _upperKey,
    });

    emit(
        'change',
        {
            sendTo: label?.[0] || val,
        },
        othersColumns,
    );
};

const treeDataFilter = (arr: any[], type: string) => {
    if (Array.isArray(arr) && arr.length) {
        const list: any[] = [];
        arr.map((item: any) => {
            if (item.children) {
                const children = treeDataFilter(item.children, type);
                if (children.length) {
                    list.push({
                        ...item,
                        title: item.name,
                        value: item.id,
                        disabled: true,
                        children,
                    });
                }
            } else {
                if (
                    item.type === type ||
                    (type === 'double' &&
                        ['int', 'float', 'double', 'long'].includes(item.type))
                ) {
                    list.push(item);
                }
            }
        });
        return list;
    } else {
        return [];
    }
};

watch(
    () => source.value,
    (newVal) => {
        const v = newVal;
        if (v === 'upper') {
          const params: Record<string, Number> = {
            branch: (action_data?.branchIndex || 0),
            branchGroup: props.thenName,
            action: props.name, // action
          }
            // const lastIndex = props.name - 1
            // if (lastIndex >= 0) { // 没有action，接口报错
            //   params.action = props.name - 1
            // }

            queryBuiltInParams(unref(data), params).then((resp) => {
                if (resp.status === 200) {
                    builtInList.value = treeDataFilter(
                      resp.result as any[],
                      props.item.expands?.businessType || props.item?.type,
                    );
                }
            });
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.value.upperKey,
    (newVal) => {
        upperKey.value = newVal;
    },
    { immediate: true },
);
</script>

<style lang="less" scoped></style>
