<template>
    <div>
        <template v-for="(item, index) in tagList" :key="item.id">
            <j-row :gutter="24" style="margin-bottom: 12px">
                <j-col :span="4">
                    <span v-if="index === 0" class="tagName">标签选择</span>
                    <j-select
                        :options="[
                            { label: '并且', value: 'and' },
                            { label: '或者', value: 'or' },
                        ]"
                        v-else
                        :value="item?.type"
                        style="width: 100%"
                        @select="(key) => onTypeSelect(key, index)"
                    />
                </j-col>
                <j-col :span="16">
                    <j-row :gutter="24">
                        <j-col flex="120px">
                            <j-select
                                style="width: 120px"
                                :value="item.id"
                                placeholder="请选择标签"
                                :options="options"
                                @select="
                                    (_, _data) => onTagSelect(_data, index)
                                "
                            />
                        </j-col>
                        <j-col flex="auto">
                            <ValueItem
                                v-model:modelValue="item.value"
                                :itemType="item.valueType"
                                @change="onValueChange"
                                :options="
                                    item.valueType === 'enum'
                                        ? (item?.dataType?.elements || []).map(
                                              (i) => {
                                                  return {
                                                      label: i.text,
                                                      value: i.value,
                                                  };
                                              },
                                          )
                                        : item.valueType === 'boolean'
                                        ? [
                                              { label: '是', value: true },
                                              { label: '否', value: false },
                                          ]
                                        : undefined
                                "
                            />
                        </j-col>
                    </j-row>
                </j-col>
                <j-col :span="4">
                    <j-space>
                        <j-button style="padding: 0 8px" @click="addItem">
                            <AIcon type="PlusOutlined" />
                        </j-button>
                        <j-button
                            danger
                            v-if="tagList.length > 1"
                            style="padding: 0 8px"
                            @click="deleteItem(index)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </j-button>
                    </j-space>
                </j-col>
            </j-row>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

const props = defineProps({
    value: {
        type: Array as PropType<any>,
        default: () => [],
    },
    tagData: {
        type: Array as PropType<any[]>,
        default: () => [],
    },
});

const emits = defineEmits(['update:value', 'change']);

const options = ref<any[]>([]);
const tagList = ref<any[]>([]);

const handleItem = (data: any) => {
    return {
        ...data,
        valueType: data.valueType ? data.valueType.type : '-',
        format: data.valueType ? data.valueType.format : undefined,
        options: data.valueType ? data.valueType.elements : undefined,
        value: data?.value,
    };
};

const addItem = () => {
    tagList.value.push({ type: 'and' });
};

const deleteItem = (_index: number) => {
    tagList.value.splice(_index, 1);
    onValueChange();
};

const onTypeSelect = (key: any, _index: number) => {
    const indexItem = tagList[_index];
    indexItem.type = key;
    tagList.value[_index] = indexItem;
};

const onTagSelect = (_data: any, _index: number) => {
    const newList = [...unref(tagList)];
    const indexType = newList[_index].type;
    newList.splice(
        _index,
        1,
        handleItem({ ..._data, value: undefined, type: indexType }),
    );
    tagList.value = newList;
};

watch(
    () => [props.tagData, props.value],
    ([newTag, newVal]) => {
        options.value = newTag.map((item: any) => {
            return { label: item.name, value: item.id, ...item };
        });
        if (newVal && newVal[0] && newVal[0]?.name && newTag && newTag.length) {
            const names: string[] = [];
            const newTagList = newVal[0]?.value
                .filter((valueItem: any) => {
                    return newTag.some(
                        (item: any) => valueItem.column === item.id,
                    );
                })
                .map((valueItem: any) => {
                    const oldItem = newTag.find(
                        (item: any) => item.id === valueItem.column,
                    );
                    if (oldItem) {
                        names.push(oldItem.name);
                        return {
                            ...handleItem(oldItem),
                            value: valueItem?.value,
                            type: valueItem?.type,
                        };
                    }
                    return valueItem;
                });
            tagList.value = newTagList;
        } else {
            tagList.value = [{}];
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

const onValueChange = () => {
    const _data = tagList.value.filter((item) => !!item?.value);
    const newValue = _data.map((item: any) => {
        return {
            column: item.id,
            type: item?.type,
            value: item?.value,
        };
    });
    emits('update:value', [{ value: newValue, name: '标签' }]);
    emits('change', [{ value: newValue, name: '标签' }], _data);
};
</script>

<style lang="less" scoped>
.tagName::before {
    position: relative;
    left: 70px;
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
}
</style>