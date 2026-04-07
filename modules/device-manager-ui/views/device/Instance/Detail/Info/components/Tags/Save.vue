<template>
    <a-modal
        :title="$t('Tags.Save.446332-0')"
        :width="1000"
        :open="true"
        :confirmLoading="loading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <div style="max-height: 500px; overflow-y: auto">
          <a-table
              rowKey="id"
              :columns="columns"
              :data-source="dataSource"
              bordered
              :pagination="false"
          >
            <template #bodyCell="{ column, text, record }">
              <div style="width: 280px">
                <template v-if="['key', 'name'].includes(column.dataIndex)">
                  <j-ellipsis>{{ text }}</j-ellipsis>
                </template>
                <template v-else>
                  <SelectAMap
                      v-if="record.type === 'geoPoint'"
                      v-model:point="record.value"
                  />
                  <template v-else>
                    <j-value-item
                        v-model:modelValue="record.value"
                        :itemType="record.type === 'array' ? 'object' : (record.type === 'file' ? 'string' : record.type)"
                        :action="FileStaticPath()"
                        style="width: 100%"
                        :headers="getUploadHeaders()"
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
                </template>
              </div>
            </template>
          </a-table>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@device-manager-ui/store/instance';
import { cloneDeep } from 'lodash-es';
import { saveTags, delTags } from '@device-manager-ui/api/instance';
import {getToken, onlyMessage} from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';
import {FileStaticPath} from "@jetlinks-web-core/api/comm";
import {TOKEN_KEY} from "@jetlinks-web/constants";
import dayjs from "dayjs";
import { getUploadHeaders } from '@jetlinks-web-core/utils'

const { t: $t } = useI18n();
const emit = defineEmits(['close', 'save']);

const columns = [
    {
        title: 'ID',
        dataIndex: 'key',
        with: '33%',
    },
    {
        title: $t('Product.index.660348-28'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('Properties.OtherSetting.237457-26'),
        dataIndex: 'value',
        with: '34%',
    },
];
const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const loading = ref(false)

onMounted(() => {
  const arr = instanceStore.current?.tags || [];
  dataSource.value = cloneDeep(arr).map((i: any) => {
    if(i.type === 'date' && i.value){
      return {
        ...i,
        value: dayjs(i.value)
      }
    }
    return i
  });
})

const handleOk = async () => {
    if (dataSource.value.length) {
        loading.value = true
        const list = (dataSource.value || [])
            .filter((item: any) => item?.key && (item?.value !== undefined && item?.value !== null && item.value !== ''))
            .map((i: any) => {
                const { dataType, ...extra } = i;
                return {
                  ...extra,
                  value: i.type === 'date' ? dayjs(i.value).format('YYYY-MM-DD HH:mm:ss') : i.value
                };
            });
        if (list.length) {
            // 填值
            const resp = await saveTags(instanceStore.current?.id || '', list).finally(()=>{
                loading.value = false
            });
            if (resp.status === 200) {
                onlyMessage($t('Product.index.660348-18'));
            }
        }
        const _list = (dataSource.value || []).filter((item: any) => item?.key && (item?.value === undefined || item?.value === null || item.value === ''));
        if (_list.length) {
            // 删除值
            _list.map(async (item: any) => {
                if (item.id) {
                    await delTags(instanceStore.current?.id || '', item.id).catch(()=>{
                        loading.value = false
                    });
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
