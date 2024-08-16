<template>
    <div class="operator-box">
        <div class="left">
            <j-input-search
                @search="search"
                allow-clear
                :placeholder="$t('Operator.index.43487113-0')"
            />
            <div class="tree">
                <j-scrollbar>
                    <j-tree
                        @select="selectTree"
                        :field-names="{ title: 'name', key: 'id' }"
                        auto-expand-parent
                        :tree-data="data"
                        :showLine="{ showLeafIcon: false }"
                        :show-icon="true"
                    >
                        <template #title="node">
                            <div class="node">
                                <div style="max-width: 160px">
                                    <Ellipsis>{{ node.name }}</Ellipsis>
                                </div>
                                <div
                                    :class="
                                        !node.isLeaf
                                            ? 'parent'
                                            : 'add'
                                    "
                                >
                                    <j-popover
                                        v-if="node.type === 'property'"
                                        :overlayStyle="{
                                            zIndex: 1200,
                                        }"
                                        placement="right"
                                        :title="$t('Operator.index.43487113-1')"
                                        :getPopupContainer="getPopupContainer"
                                    >
                                        <template #content>
                                            <j-space direction="vertical">
                                                <j-tooltip
                                                    placement="right"
                                                    :title="$t('Operator.index.43487113-2')"
                                                >
                                                    <j-button
                                                        type="text"
                                                        @click="
                                                            recentClick(node)
                                                        "
                                                    >
                                                        {{ $t('Operator.index.43487113-3') }}
                                                    </j-button>
                                                </j-tooltip>
                                                <j-tooltip
                                                    placement="right"
                                                    :title="$t('Operator.index.43487113-4')"
                                                >
                                                    <j-button
                                                        @click="lastClick(node)"
                                                        type="text"
                                                    >
                                                        {{ $t('Operator.index.43487113-5') }}
                                                    </j-button>
                                                </j-tooltip>
                                            </j-space>
                                        </template>
                                        <a class="has-property">{{ $t('Operator.index.43487113-6') }}</a>
                                    </j-popover>
                                    <j-popover
                                        v-else-if="node.type === 'tags'"
                                        :overlayStyle="{
                                            zIndex: 1200,
                                        }"
                                        placement="right"
                                        :title="$t('Operator.index.43487113-1')"
                                        :getPopupContainer="getPopupContainer"
                                    >
                                        <template #content>
                                            <j-space direction="vertical">
                                                <j-tooltip
                                                    placement="right"
                                                    :title="$t('Operator.index.43487113-2')"
                                                >
                                                    <j-button
                                                        type="text"
                                                        @click="
                                                            recentTagsClick(node)
                                                        "
                                                    >
                                                        {{ $t('Operator.index.43487113-7') }}
                                                    </j-button>
                                                </j-tooltip>
                                            </j-space>
                                        </template>
                                        <a class="has-property">{{ $t('Operator.index.43487113-6') }}</a>
                                    </j-popover>
                                    <a
                                        class="no-property"
                                        v-else
                                        @click.stop="addClick(node)"
                                    >
                                        {{ $t('Operator.index.43487113-6') }}
                                    </a>
                                </div>
                            </div>
                        </template>
                    </j-tree>
                </j-scrollbar>
            </div>
        </div>
        <div class="right">
            <Markdown :source="item?.description || ''"></Markdown>
        </div>
    </div>
</template>
<script setup lang="ts" name="Operator">
import { useProductStore } from '@/store/product';
import type { OperatorItem } from './typings';
import { treeFilter } from '@/utils/tree';
import { PropertyMetadata } from '@/views/device/Product/typings';
import { getOperator } from '@/api/device/product';
import { inject } from 'vue';
import {useTableWrapper, useTableFullScreen} from "@/components/Metadata/Table/context";
import Markdown from '@/components/Markdown'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    id: String,
    propertiesOptions: Array,
});

interface Emits {
    (e: 'addOperatorValue', data: string): void;
}
const emit = defineEmits<Emits>();

const item = ref<Partial<OperatorItem>>();
const data = ref<OperatorItem[]>([]);
const dataRef = ref<OperatorItem[]>([]);
const tagsMetadata: any = inject('_tagsDataSource');
const tableWrapperRef = useTableWrapper()
const fullScreen = useTableFullScreen()
const search = (value: string) => {
    if (value) {
        const nodes = treeFilter(
            dataRef.value,
            value,
            'name',
        ) as OperatorItem[];
        data.value = nodes;
    } else {
        data.value = dataRef.value;
    }
};

const selectTree = (k: any, info: any) => {
    item.value = info.node as unknown as OperatorItem;
};

const recentTagsClick = (node:OperatorItem) =>{
    emit('addOperatorValue',`tag("${node.id}")`)
}
const recentClick = (node: OperatorItem) => {
    emit('addOperatorValue', `$recent("${node.id}")`);
};
const lastClick = (node: OperatorItem) => {
    emit('addOperatorValue', `$lastState("${node.id}")`);
};
const addClick = (node: OperatorItem) => {
    emit('addOperatorValue', node.code);
};

const productStore = useProductStore();

const getData = async (id?: string) => {
    // const metadata = productStore.current.metadata || '{}';
    const _properties = props.propertiesOptions as PropertyMetadata[];
    const properties = {
        id: 'property',
        name: $t('Operator.index.43487113-8'),
        description: '',
        code: '',
        isLeaf: false,
        children: _properties
            .filter((p: PropertyMetadata) => p.id !== id)
            .map((p: PropertyMetadata) => {
              const readOnly = p.expands.type.length === 1 && p.expands.type[0] === 'read' ? $t('Operator.index.43487113-9') : $t('Operator.index.43487113-10')

              return {
                id: p.id,
                name: p.name,
                isLeaf: true,
                description: `### ${p.name}
                \n ${$t('Operator.index.43487113-11')} ${p.id}
                \n ${$t('Operator.index.43487113-12')} ${p.valueType?.type}
                \n ${$t('Operator.index.43487113-13')} ${readOnly}
                \n ${$t('Operator.index.43487113-14')} `,
                type: 'property',
              }
            }),
    };
    const tags = {
        id: 'tags',
        name: $t('Operator.index.43487113-15'),
        Description: '',
        code: '',
        isLeaf: false,
        children: tagsMetadata.value.map((i: any) => ({
            id: i.id,
            name: i.name,
          isLeaf: true,
            description: `### ${i.name}
            \n ${$t('Operator.index.43487113-11')} ${i.id}
            \n ${$t('Operator.index.43487113-12')} ${i.valueType?.type}
            \n ${$t('Operator.index.43487113-14')} `,
            type: 'tags',
        })),
    };
    const response = await getOperator();
    if (response.status === 200) {
        data.value = [
            properties as OperatorItem,
            tags as any,
            ...response.result,
        ];
        dataRef.value = [
            properties as OperatorItem,
            tags as any,
            ...response.result,
        ];
    }
};

const getPopupContainer = (node: any) => {
  if (fullScreen.value) {
    return tableWrapperRef.value || node
  }

  return document.body
}

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
        //width: 50%;
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
