<template>
    <div>
        <template v-for="(item, index) in tagList" :key="item.id">
            <a-row :gutter="24" style="margin-bottom: 12px">
                <a-col :span="4">
                    <span
                      v-if="index === 0" class="tagName">
                      {{ $t('device.Tag.9667829-0') }}
                    </span>
                    <a-select
                        :options="[
                            { label: $t('device.Tag.9667829-1'), value: 'and' },
                            { label: $t('device.Tag.9667829-2'), value: 'or' },
                        ]"
                        v-else
                        :value="item?.type"
                        style="width: 100%"
                        @select="(key) => onTypeSelect(key, index)"
                    />
                </a-col>
                <a-col :span="16">
                    <a-row :gutter="24">
                        <a-col flex="120px">
                            <a-select
                                style="width: 120px"
                                :value="item.id"
                                :placeholder="$t('device.Tag.9667829-3')"
                                :options="options"
                                @select="
                                    (_, _data) => onTagSelect(_data, index)
                                "
                            />
                        </a-col>
                        <a-col flex="auto">
                            <j-value-item
                                v-model:modelValue="item.value"
                                :itemType="item.valueType === 'file' ? 'string' : item.valueType"
                                style="width: 100%"
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
                                              { label: $t('device.Tag.9667829-4'), value: true },
                                              { label: $t('device.Tag.9667829-5'), value: false },
                                          ]
                                        : undefined
                                "
                            />
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="4">
                    <a-space>
                        <a-button style="padding: 0 8px" @click="addItem">
                            <AIcon type="PlusOutlined" />
                        </a-button>
                        <a-button
                            danger
                            v-if="tagList.length > 1"
                            style="padding: 0 8px"
                            @click="deleteItem(index)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
        </template>
    </div>
</template>

<script lang="ts" setup name="DeviceTag">
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
    onValueChange()
};

const onTypeSelect = (key: any, _index: number) => {
    const indexItem = tagList.value[_index];
    indexItem.type = key;
    tagList.value[_index] = indexItem;
    onValueChange()
};

const onTagSelect = (_data: any, _index: number) => {
    const indexType = tagList.value[_index].type;
    const _item = handleItem({ ..._data, value: undefined, type: indexType })
    tagList.value[_index] = _item
    onValueChange()
};

const onValueChange = () => {
    // const _data = tagList.value.filter((item) => item?.value !== undefined);
    const newValue = tagList.value.map((item: any) => {
        return {
            column: item.id,
            type: item?.type,
            value: item?.value,
        };
    });
    emits('update:value', [{ value: newValue, name: $t('device.Tag.9667829-6') }]);
    emits('change', [{ value: newValue, name: $t('device.Tag.9667829-6') }], tagList.value);
};

watch(
    () => [props.tagData, props.value],
    ([newTag, newVal]) => {
        options.value = newTag.map((item: any) => {
            return { label: item.name, value: item.id, ...item };
        });

      // const names: string[] = [];
      const newTagList = newVal[0]?.value.map((valueItem: any) => {
          const oldItem = newTag.find(
            (item: any) => item.id === valueItem.column,
          );
          if (oldItem) {
            // names.push(oldItem.name);
            return {
              ...handleItem(oldItem),
              value: valueItem?.value,
              type: valueItem?.type,
            };
          }
          return valueItem;
        }) || [{}];

      tagList.value = newTagList;

        // if (newVal && newVal[0] && newVal[0]?.name && newTag && newTag.length) {
        //
        //     tagList.value = newTagList;
        // } else {
        //     tagList.value = [{}];
        // }
    },
    {
        immediate: true,
        deep: true,
    },
);

onMounted(() => {
    if(props.value?.[0]?.value){
        const arr: any[] = []
        props.value?.[0]?.value.map((item: any) => {
            const _item = props.tagData.find(i => i.id === item.column)
            if(_item){
                arr.push({
                    ..._item,
                    ...item,
                })
            }
        })
        emits('change', props.value, arr);
    }
})
</script>

<style lang="less" scoped>
.tagName {
  display: inline-block;
  height: 100%;
  line-height: 32px;

  &::before {
    position: relative;
    left: 72px;
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
}

</style>
