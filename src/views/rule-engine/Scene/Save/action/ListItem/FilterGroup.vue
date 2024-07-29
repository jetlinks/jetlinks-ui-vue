<template>
    <div class="terms-params filter-group">
        <div class="terms-params-warp">
            <div v-if="!isFirst" class="term-type-warp">
                <DropdownButton
                    :options="[
                        { label: '并且', value: 'and' },
                        { label: '或者', value: 'or' },
                    ]"
                    type="type"
                    v-model:value="
                        formModel.branches[branchName].then[thenName].actions[
                            actionName
                        ].terms[name].type
                    "
                    @select="typeChange"
                />
            </div>
            <div
                class="terms-params-content"
                @mouseover="mouseover"
                @mouseout="mouseout"
            >
                <ConfirmModal
                    title="确认删除？"
                    :onConfirm="onDelete"
                    :show="showDelete"
                    className="terms-params-delete"
                >
                    <AIcon type="CloseOutlined" />
                </ConfirmModal>
                <j-form-item
                    v-for="(item, index) in termsOptions"
                    :key="item.key"
                    :name="[
                        'branches',
                        branchName,
                        'then',
                        thenName,
                        'actions',
                        actionName,
                        'terms',
                        name,
                        'terms',
                        index,
                    ]"
                    :rules="rules"
                >
                  <CheckFilterItem
                    v-model:value="
                            formModel.branches[branchName].then[thenName]
                                .actions[actionName].terms[name].terms[index]
                        "
                    :name="index"
                    :termsName="name"
                    :actionName="actionName"
                    :thenName="thenName"
                    :branchName="branchName"
                  >
                    <FilterItem
                      v-model:value="
                            formModel.branches[branchName].then[thenName]
                                .actions[actionName].terms[name].terms[index]
                        "
                      :isFirst="index === 0"
                      :isLast="index === termsOptions.length - 1"
                      :showDeleteBtn="termsOptions.length !== 1"
                      :name="index"
                      :termsName="name"
                      :actionName="actionName"
                      :thenName="thenName"
                      :branchName="branchName"
                    />
                  </CheckFilterItem>

                </j-form-item>
            </div>
            <div v-if="isLast" class="terms-group-add" @click="addTerms">
                <div class="terms-content">
                    <AIcon
                        type="PlusOutlined"
                        style="font-size: 12px; padding-right: 4px"
                    />
                    <span>分组</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="FilterGroup">
import { storeToRefs } from 'pinia';
import { useSceneStore } from 'store/scene';
import DropdownButton from '../../components/DropdownButton';
import FilterItem from './FilterCondition.vue';
import { flattenDeep, isArray } from 'lodash-es';
import { provide } from 'vue';
import { randomString } from '@/utils/utils';
import {
    getParams,
    EventEmitter,
    EventSubscribeKeys,
} from '@/views/rule-engine/Scene/Save/util';
import { handleParamsData } from '@/views/rule-engine/Scene/Save/components/Terms/util';
import {filterTermsValidator} from "@/views/rule-engine/Scene/Save/action/ListItem/util";
import CheckFilterItem from './CheckFilterItem.vue'

const sceneStore = useSceneStore();
const { data: formModel } = storeToRefs(sceneStore);

const props = defineProps({
    isFirst: {
        type: Boolean,
        default: true,
    },
    isLast: {
        type: Boolean,
        default: true,
    },
    showDeleteBtn: {
        type: Boolean,
        default: true,
    },
    name: {
        type: Number,
        default: 0,
    },
    branchName: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    actionName: {
        type: Number,
        default: 0,
    },
});

const columnOptions = ref<any[]>([]);

const onKeys: string[] = EventSubscribeKeys({
    branch: props.branchName,
    branchGroup: props.thenName,
    action: props.actionName,
});

const handleRequest = (e: any) => {
    const hasDelete = 'isDelete' in e;
    if (!hasDelete) {
        columnRequest();
    }
};

EventEmitter.subscribe(onKeys, handleRequest);

provide('filter-params', columnOptions);

const columnRequest = () => {
    const param = {
        branch: props.branchName,
        branchGroup: props.thenName,
        action: props.actionName,
    };
    getParams(param, formModel.value).then((res) => {
        columnOptions.value = handleParamsData(res, 'id');
    });
};

const termsOptions = computed(() => {
    return formModel.value.branches![props.branchName].then[props.thenName]
        .actions[props.actionName].terms?.[props.name].terms;
});

const showDelete = ref(false);

const mouseover = () => {
    showDelete.value = true;
};

const mouseout = () => {
    showDelete.value = false;
};

const handleOptionsColumnsValue = (termsColumns: any[], _options: any) => {
    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.name
    ].options!.termsColumns = termsColumns;
    const flatten = new Set(flattenDeep(termsColumns));
    let newColumns = [...flatten.values()];
    if (_options?.otherColumns) {
        newColumns = [..._options?.otherColumns, ...newColumns];
    }
    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.name
    ].options!.columns = newColumns;
};

const addTerms = () => {
    const item: any = {
        type: 'and',
        key: randomString(),
        terms: [
            {
                column: undefined,
                value: {
                    type: 'fixed',
                    value: undefined,
                },
                termType: undefined,
                type: 'and',
                key: randomString(),
            },
        ],
    };

    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.actionName
    ].terms?.push(item);

    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.actionName
    ].options!.terms.push({
        terms: [['', 'eq', '', 'and']],
        termType: '并且',
    });
};

const typeChange = (e: any) => {
    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.actionName
    ].options!.terms[props.name].termType = e.label;
};

const onDelete = () => {
    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.actionName
    ].terms?.splice(props.name, 1);

    const _options =
        formModel.value.branches![props.branchName].then[props.thenName]
            .actions[props.actionName].options;
    const termsColumns = _options?.termsColumns || [];
    if (_options?.termsColumns) {
        termsColumns.splice(props.name, 1);
        handleOptionsColumnsValue(termsColumns, _options);
    }

    formModel.value.branches![props.branchName].then[props.thenName].actions[
        props.actionName
    ].options!.terms.splice(props.name, 1);
};

const rules = [
    {
        validator(_: any, v?: Record<string, any>) {
            if (v !== undefined && !v.error) {
                if (!Object.keys(v).length) {
                    return Promise.reject(
                        new Error('该数据已发生变更，请重新配置'),
                    );
                }

              return filterTermsValidator(v)
            } else {
                if (v?.error) {
                    // 数据发生变化
                    return Promise.reject(
                        new Error('该数据已发生变更，请重新配置'),
                    );
                }
                return Promise.reject(new Error('请选择参数'));
            }
        },
    },
];

nextTick(() => {
    columnRequest();
});

onUnmounted(() => {
    EventEmitter.unSubscribe(onKeys, handleRequest);
});
</script>

<style scoped></style>
