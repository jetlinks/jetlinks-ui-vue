<template>
    <a-dropdown
        class="scene-select-value"
        trigger="click"
        v-model:open="visible"
        @openChange="visibleChange"
    >
        <div @click.prevent="visible = true">
            <slot :label="label">
                <div class="dropdown-button value">
                    <AIcon v-if="!!icon" :type="icon" />
                    <j-ellipsis style="max-width: 220px">
                        {{ label }}
                    </j-ellipsis>
                </div>
            </slot>
        </div>
        <template #overlay>
            <div class="scene-select-content" style="min-width: 220px;">
                <a-tabs @change="tabsChange" v-model:activeKey="mySource">
                    <a-tab-pane
                        v-for="item in tabsOptions"
                        :key="item.key"
                    >                        <!-- <j-value-item :placeholder="$t('actions.WriteProperty.9667836-3')" v-model:modelValue="myValue" itemType="object" @change="onSelect"/> -->
                        <template #tab>
                            {{ item.label }}
                            <a-tooltip v-if="(item.key === 'fixed' || item.key === 'manual') && item.component !== 'enum'" :title="$t('ParamsDropdown.Array.9093538-0')">
                                <AIcon type="QuestionCircleOutlined"/>
                            </a-tooltip>
                        </template>
                        <template v-if="item.key === 'fixed' || item.key === 'manual'">
                            <j-value-item
                                v-if="item.component === 'enum'"
                                v-model:modelValue="myValue"
                                itemType="enum"
                                mode="multiple"
                                :options="options"
                                :extra="props"
                                :extraProps="{
                                    fieldNames: {label: 'name', value: 'id'}
                                }"
                                style="width: 100%"
                                @change="(val) => {
                                    onChange(item.component, val.map(i => i.id))
                                }"
                            />  
                            <a-select
                                v-else
                                style="width: 100%"
                                :placeholder="$t('ParamsDropdown.Array.9093538-0')"
                                :value="myValue"
                                mode="tags"
                                max-tag-count="responsive"
                                @change="
                                    (val) =>
                                        onChange(
                                            item.component,
                                            val,
                                        )
                                "
                            />
                        </template>
                        <template
                            v-else-if="item.key === 'upper' && item.component === 'tree'"
                        >
                            <a-tree
                                v-model:selectedKeys="myValue"
                                v-model:expandedKeys="treeOpenKeys"
                                :treeData="metricOptions"
                                :virtual="true"
                                multiple
                                :fieldNames="{ key: treeKey }"
                                style="height: 350px;overflow: auto"
                                @select="treeSelect"
                                >
                                <template #title="{ name, description }">
                                    <a-space>
                                    <div class="no-warp">{{ name }}</div>
                                    <div
                                        v-if="description"
                                        class="tree-title-description no-warp"
                                    >
                                        {{ description }}
                                    </div>
                                    </a-space>
                                </template>
                            </a-tree>
                        </template>
                        
                    </a-tab-pane>
                </a-tabs>
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts" setup name="ArrayParamsDropdown">
import type { ValueType } from './typings';
import { defaultSetting } from './typings';
import { useI18n } from 'vue-i18n'
import {onlyMessage} from "@jetlinks-web/utils";
import { isNil } from "lodash-es";

const { t: $t } = useI18n()
type Emit = {
    (e: 'update:value', data: Array<ValueType>): void;
    (e: 'update:source', data: string): void;
    (
        e: 'select',
        data: any,
        label?: string,
        labelObj?: Record<number, any>,
        option?: any,
    ): void;
    (e: 'tabChange', data: any): void;
};

const props = defineProps({
    ...defaultSetting,
});

const emit = defineEmits<Emit>();
const myValue = ref<string>();
const mySource = ref<string>(props.source);
const label = ref<any>('[]');
const visible = ref(false);
const treeOpenKeys = ref([])
const tabsChange = (e: string) => {
    emit('update:value', [])
    mySource.value = e;
    emit('update:source', mySource.value);
};

//查找树节点
const findTreeNode = (targetValues: any[], treeData: any[]): string[] => {
    const result: string[] = [];
    
    const traverse = (nodes: any[]) => {
        for (const node of nodes) {
            // 检查当前节点的值是否在目标数组中
            if (targetValues.includes(node[props.treeKey] || node.value)) {
                // 优先使用fullName，如果没有则使用name或label
                const displayName = node.fullName || node.name || node.label || node[props.treeKey] || node.value;
                result.push(displayName);
            }
            
            // 递归遍历子节点
            if (node.children && node.children.length > 0) {
                traverse(node.children);
            }
        }
    };
    
    traverse(treeData);
    return result;
};

//展开选中节点的父节点
const expandParentNodes = (targetValues: any[], treeData: any[]): string[] => {
    const parentKeys: string[] = [];
    
    const findParents = (nodes: any[], parentKey?: string) => {
        for (const node of nodes) {
            const nodeKey = node[props.treeKey] || node.value;
            
            // 如果当前节点是目标节点之一，将其所有父节点添加到展开列表
            if (targetValues.includes(nodeKey) && parentKey) {
                parentKeys.push(parentKey);
            }
            
            // 递归遍历子节点
            if (node.children && node.children.length > 0) {
                findParents(node.children, nodeKey);
                
                // 如果子节点中有目标节点，当前节点也需要展开
                const hasTargetInChildren = node.children.some((child: any) => 
                    targetValues.includes(child[props.treeKey] || child.value) ||
                    (child.children && hasTargetDescendant(child.children, targetValues))
                );
                
                if (hasTargetInChildren) {
                    parentKeys.push(nodeKey);
                }
            }
        }
    };
    
    // 辅助函数：检查是否有目标后代节点
    const hasTargetDescendant = (nodes: any[], targets: any[]): boolean => {
        for (const node of nodes) {
            if (targets.includes(node[props.treeKey] || node.value)) {
                return true;
            }
            if (node.children && hasTargetDescendant(node.children, targets)) {
                return true;
            }
        }
        return false;
    };
    
    findParents(treeData);
    return [...new Set(parentKeys)]; // 去重
};

const onSelect = () => {
    if(myValue.value) {
        try {
            const _value = JSON.parse(myValue.value);

            if (!Array.isArray(_value)) {
              throw new Error('must array')
            }
            emit('update:value', _value);
            label.value = JSON.stringify(_value)
            emit('select', _value, myValue.value, label.value);
        } catch (e) {
            onlyMessage('请输入正确格式的数据', 'error')
        }
    } else {
        emit('update:value', undefined);
        emit('select', '', undefined, undefined);
    }
};

const treeSelect = (v: any, option: any) => {
    const selectedNodes = option.selectedNodes;
    emit('update:value', myValue.value)
    label.value = selectedNodes.map(item => item.fullName).join(',') || '[]';
}

const visibleChange = (v: boolean) => {
    visible.value = v;
};

const onChange = (
    dataType,
    _value?: any[],
) => {
    if(dataType === 'array') {
        try {
            emit('update:value', _value?.map(item => item && JSON.parse(item)));
        } catch (e) {
            onlyMessage('请输入正确格式的数据', 'error')
        }
    } else if (['float', 'double', 'int'].includes(dataType)) {
        emit('update:value', _value?.map(item => Number(item)));
    } else {
        emit('update:value', _value);
    }
    emit('select', _value, myValue.value, label.value);
};

watch(() => [props.value, props.metricOptions], (val) => {
    console.log(mySource.value)
    if (!val?.[0]) {
      myValue.value = undefined
      label.value = '[]'
    } else {
      if (Array.isArray(val?.[0])) {
        // myValue.value = JSON.stringify(val)
        if(props.tabsOptions?.[0].component === 'array') {
            myValue.value = val?.[0].map(item => JSON.stringify(item))
        } else {
            myValue.value = val?.[0]
        }
        console.log(myValue.value)
        if(mySource.value === 'fixed') {
            label.value = props.options?.length ? myValue.value?.map(item => props.options.find(i => i.id === item)?.name)?.join(',') || '[]' : !myValue.value?.length ? '[]' : myValue.value
        } else {
            // 遍历props.metricOptions树结构，把存在于myValue数组中的值的fullName写入label.value
            const foundNames = findTreeNode(val?.[0], props.metricOptions);
            label.value = foundNames.length > 0 ? foundNames.join(',') : (val?.[0].every(item => isNil(item)) ? '[]' : JSON.stringify(val?.[0]))

            //展开选中节点的父节点
            const parentKeys = expandParentNodes(val?.[0], val?.[1]);
            treeOpenKeys.value = [...new Set([...treeOpenKeys.value, ...parentKeys])];
        }
      } else {
        myValue.value = JSON.stringify(val?.[0])
        label.value = JSON.stringify(val?.[0])
      }
    }
}, { immediate: true })
</script>

<style scoped lang="less">
@import '../DropdownButton/index.less';
.manual-time-picker {
    position: absolute;
    top: -2px;
    left: 0;
    border: none;
    visibility: hidden;
    :deep(.ant-picker-input) {
        display: none;
    }
}
</style>
