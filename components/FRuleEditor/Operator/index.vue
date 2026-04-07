<template>
    <div class="operator-box">
        <div class="left">
            <a-input-search
                @search="search"
                allow-clear
                :placeholder="$t('Operator.index.745665-0')"
            />
            <div class="tree">
                <j-scrollbar>
                    <a-tree
                        :field-names="{ title: 'name', key: 'id' }"
                        :tree-data="data"
                        :showLine="{ showLeafIcon: false }"
                        :show-icon="true"
                        v-model:expandedKeys="expandedKeys"
                        @select="selectTree"
                    >
                        <template #title="node">
                            <div class="node">
                                <div style="max-width: 160px">
                                    <j-ellipsis>{{ node.name }}</j-ellipsis>
                                </div>
                                <div
                                    :class="
                                        !node.isLeaf
                                            ? 'parent'
                                            : 'add'
                                    "
                                >
                                    <a-popover
                                        v-if="node.type === 'property'"
                                        :overlayStyle="{
                                            zIndex: 1200,
                                        }"
                                        placement="right"
                                        :title="$t('Operator.index.745665-1')"
                                        :getPopupContainer="getPopupContainer"
                                    >
                                        <template #content>
                                            <a-space direction="vertical">
                                                <a-tooltip
                                                    placement="right"
                                                    :title="$t('Operator.index.745665-2')"
                                                >
                                                    <a-button
                                                        type="text"
                                                        @click="
                                                            recentClick(node)
                                                        "
                                                    >
                                                        {{ $t('Operator.index.745665-3') }}
                                                    </a-button>
                                                </a-tooltip>
                                                <a-tooltip
                                                    placement="right"
                                                    :title="$t('Operator.index.745665-4')"
                                                >
                                                    <a-button
                                                        @click="lastClick(node)"
                                                        type="text"
                                                    >
                                                        {{ $t('Operator.index.745665-5') }}
                                                    </a-button>
                                                </a-tooltip>
                                            </a-space>
                                        </template>
                                        <a class="has-property">{{ $t('Operator.index.745665-6') }}</a>
                                    </a-popover>
                                    <a-popover
                                        v-else-if="node.type === 'tags'"
                                        :overlayStyle="{
                                            zIndex: 1200,
                                        }"
                                        placement="right"
                                        :title="$t('Operator.index.745665-1')"
                                        :getPopupContainer="getPopupContainer"
                                    >
                                        <template #content>
                                            <a-space direction="vertical">
                                                <a-tooltip
                                                    placement="right"
                                                    :title="$t('Operator.index.745665-2')"
                                                >
                                                    <a-button
                                                        type="text"
                                                        @click="
                                                            recentTagsClick(node)
                                                        "
                                                    >
                                                        {{ $t('Operator.index.745665-7') }}
                                                    </a-button>
                                                </a-tooltip>
                                            </a-space>
                                        </template>
                                        <a class="has-property">{{ $t('Operator.index.745665-6') }}</a>
                                    </a-popover>
                                    <a
                                        class="no-property"
                                        v-else
                                        @click.stop="addClick(node)"
                                    >
                                        {{ $t('Operator.index.745665-6') }}
                                    </a>
                                </div>
                            </div>
                        </template>
                    </a-tree>
                </j-scrollbar>
            </div>
        </div>
        <div class="right">
            <j-markdown :source="item?.description || ''"></j-markdown>
        </div>
    </div>
</template>
<script setup lang="ts" name="Operator">
import { useProductStore } from '../../../store/product';
import type { OperatorItem } from './typings';
import { treeFilter } from '../utils';
import { PropertyMetadata } from '../../../views/device/Product/typings';
import { getOperator } from '../../../api/product';
import { inject } from 'vue';
import {useTableWrapper, useTableFullScreen} from "../../../components/Metadata/context";
import { useI18n } from 'vue-i18n';
import {langKey} from "@jetlinks-web-core/utils/consts";
import { cloneDeep } from 'lodash-es'

const {t: $t} = useI18n();

const props = defineProps({
    id: String,
    propertiesOptions: Array,
});

interface Emits {
    (e: 'addOperatorValue', data: string): void;
}
const emit = defineEmits<Emits>();
//获取浏览器语言
const language = (navigator.language || 'en').toLocaleLowerCase()
const localLanguage = localStorage.getItem(langKey) || language.split('-')[0] || 'en'
const item = ref<Partial<OperatorItem>>();
const data = ref<OperatorItem[]>([]);
const dataRef = ref<OperatorItem[]>([]);
const tagsMetadata: any = inject('_tagsDataSource');
const tableWrapperRef = useTableWrapper();
const fullScreen = useTableFullScreen();
const expandedKeys = ref([]);
const search = (value: string) => {
    if (value) {
        const nodes = treeFilter(
            dataRef.value,
            value,
            'name',
        ) as OperatorItem[];
        data.value = [];
        data.value = nodes;
        expandedKeys.value = [];
        dealExpand(data.value);
    } else {
        data.value = dataRef.value;
    }
};

const dealExpand = (data: any) => {
    data.forEach((item: any) => {
        expandedKeys.value.push(item.id);
        if (item.children) {
            dealExpand(item.children);
        }
    });
    console.log(expandedKeys.value,'expandedKeys')
};

const selectTree = (k: any, info: any) => {
    item.value = info.node as unknown as OperatorItem;
};

const recentTagsClick = (node:OperatorItem) =>{
    emit('addOperatorValue',`tag("${node.code}")`)
}
const recentClick = (node: OperatorItem) => {
    emit('addOperatorValue', `$recent("${node.code}")`);
};
const lastClick = (node: OperatorItem) => {
    emit('addOperatorValue', `$lastState("${node.code}")`);
};
const addClick = (node: OperatorItem) => {
    emit('addOperatorValue', node.code);
};

const productStore = useProductStore();

const dealOperator = (data:any, keys: string[]) =>{
  return data.filter(item => {

    if(item.i18nMessages){
      item.name = item.i18nMessages.name[localLanguage];
      item.description = item.i18nMessages.description[localLanguage];
    }

    if (keys.includes(item.id)) {
      return true;
    } else if (item.children?.length) {
      item.children = dealOperator(item.children, keys)

      if (item.children.length) {
        return true
      }
    }

    return false;
  })
}


const getData = async (id?: string) => {
    // const metadata = productStore.current.metadata || '{}';
    const _properties = props.propertiesOptions as PropertyMetadata[];
    const properties = {
        id: 'property',
        name: $t('Operator.index.745665-8'),
        description: '',
        code: '',
        isLeaf: false,
        children: _properties
            .filter((p: PropertyMetadata) => p.id !== id)
            .map((p: PropertyMetadata) => {
                const readOnly =
                    p.expands.type.length === 1 && p.expands.type[0] === 'read'
                        ? $t('Operator.index.745665-9')
                        : $t('Operator.index.745665-10');

                return {
                    id: 'property' + p.id,
                    code: p.id,
                    name: p.name,
                    isLeaf: true,
                    description: `### ${p.name}
                \n ${$t('Operator.index.745665-16')}: ${p.id}
                \n ${$t('Operator.index.745665-17')}: ${p.valueType?.type}
                \n ${$t('Operator.index.745665-18')}: ${readOnly}`,
                    // \n ${$t('Operator.index.745665-19')}:
                    type: 'property',
                };
            }),
    };
    const tags = {
        id: 'tags',
        name: $t('Operator.index.745665-15'),
        Description: '',
        code: '',
        isLeaf: false,
        children: tagsMetadata.value.map((i: any) => ({
            id: 'tags' + i.id,
            code: i.id,
            name: i.name,
            isLeaf: true,
            description: `### ${i.name}
            \n ${$t('Operator.index.745665-16')}: ${i.id}
            \n ${$t('Operator.index.745665-17')}: ${i.valueType?.type}
            \n ${$t('Operator.index.745665-19')}: `,
            type: 'tags',
        })),
    };
    const response = await getOperator();

    if (response.status === 200) {
        const operator = dealOperator(response.result, ['in-function'])

        data.value = [
            properties as OperatorItem,
            tags as any,
            ...operator,
        ];
        dataRef.value = [
            properties as OperatorItem,
            tags as any,
            ...operator,
        ];
    }
};

const getPopupContainer = (node: any) => {
    if (fullScreen.value) {
        return tableWrapperRef.value || node;
    }

    return document.body;
};

watch(
    () => props.id,
    (val) => {
        getData(val);
    },
    { immediate: true },
);
</script>
<style lang="less" scoped>
.border {
    margin-top: 10px;
    padding: 10px;
    border-top: 1px solid lightgray;
}

.operator-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;

    .left,
    .right {
        width: 270px;
        //height: 350px;
        height: calc(50% - 7px);
        border: 1px solid lightgray;
    }

    .left {
        padding: 10px;
        //margin-right: 10px;
        .tree {
            height: 300px;
            //overflow-y: auto;

            .node {
                display: flex;
                justify-content: space-between;
                width: 190px;

                .parent {
                    display: none;
                }
            }
        }
    }

    .right {
        padding: 20px;
    }
}
</style>
<style>
.rule-popover {
    z-index: 1200;
}
</style>
