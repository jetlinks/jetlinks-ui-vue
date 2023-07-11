<template>
    <j-modal
        :width="1000"
        :visible="true"
        title="编辑标签"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <j-table
            rowKey="id"
            :columns="columns"
            :data-source="dataSource"
            bordered
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <div style="width: 280px">
                    <template v-if="['key', 'name'].includes(column.dataIndex)">
                        <Ellipsis>{{ text }}</Ellipsis>
                    </template>
                    <template v-else>
                        <ValueItem
                            v-model:modelValue="record.value"
                            :itemType="record.type"
                            :options="
                                record.type === 'enum'
                                    ? (record?.dataType?.elements || []).map(
                                          (item) => {
                                              return {
                                                  label: item.text,
                                                  value: item.value,
                                              };
                                          },
                                      )
                                    : record.type === 'boolean'
                                    ? [
                                          { label: record?.dataType?.trueText, value: record?.dataType?.trueValue },
                                          { label: record?.dataType?.falseText, value: record?.dataType?.falseValue },
                                      ]
                                    : undefined
                            "
                        />
                    </template>
                </div>
            </template>
        </j-table>
    </j-modal>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import _ from 'lodash';
import { saveTags, delTags } from '@/api/device/instance'
import { onlyMessage } from '@/utils/comm';

const emit = defineEmits(['close', 'save']);

const columns = [
    {
        title: 'ID',
        dataIndex: 'key',
        with: '33%',
    },
    {
        title: '名称',
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: '值',
        dataIndex: 'value',
        with: '34%',
    },
];
const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);

watchEffect(() => {
    const arr = instanceStore.current?.tags || [];
    dataSource.value = _.cloneDeep(arr);
});

const handleOk = async () => {
    if (dataSource.value.length) {
        const list = (dataSource.value || [])
            .filter((item: any) => item?.key && item?.value)
            .map((i: any) => {
                const { dataType, ...extra } = i;
                return { ...extra };
            });
        if (list.length) {
            // 填值
            const resp = await saveTags(instanceStore.current?.id || '', list);
            if (resp.status === 200) {
                onlyMessage('操作成功！');
            }
          }
          const _list = (dataSource.value || []).filter((item: any) => item?.key && !item?.value);
          if (_list.length) {
            // 删除值
            _list.map(async (item: any) => {
              if (item.id) {
                await delTags(instanceStore.current?.id || '', item.id);
              }
            });
          }
          emit('save');
    } else {
        emit('close');
    }
};

const handleCancel = () => {
    emit('close');
};
</script>