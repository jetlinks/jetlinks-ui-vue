<template>
    <j-modal
        :title="$t('Tags.Save.735511-0')"
        :width="1000"
        :visible="true"
        :confirmLoading="loading"
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
import _ from 'lodash-es';
import { saveTags, delTags } from '@/api/device/instance'
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emit = defineEmits(['close', 'save']);

const columns = [
    {
        title: 'ID',
        dataIndex: 'key',
        with: '33%',
    },
    {
        title: $t('Tags.Save.735511-1'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('Tags.Save.735511-2'),
        dataIndex: 'value',
        with: '34%',
    },
];
const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const loading = ref(false)

watchEffect(() => {
    const arr = instanceStore.current?.tags || [];
    dataSource.value = _.cloneDeep(arr);
});

const handleOk = async () => {
    if (dataSource.value.length) {
        loading.value = true
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
                onlyMessage($t('Tags.Save.735511-3'));
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
          setTimeout(() => {
            loading.value = false
            emit('save');
          }, 1000)
    } else {
        emit('close');
    }
};

const handleCancel = () => {
    emit('close');
};
</script>
