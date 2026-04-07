<template>
  <pro-search
      :columns="columns"
      :target="'firmware-search-select-device' + props.type"
      @search="handleSearch"
      style="padding: 0"
  />
  <div style="flex: 1; min-height: 0">
    <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :columns="columns"
        :request="(e) => queryDetailList(e, {permission: 'save'})"
        :defaultParams="defaultParams"
        :params="params"
        :bodyStyle="{padding: 0}"
        :rowSelection="type=== 'Self' ? {
          selectedRowKeys: _selectedRowKeys,
          onSelect: onSelectChange,
          onSelectAll: onSelectAllChange,
          onChange: onChange,
      } : false"
    >
      <template #productId="slotProps">
        <span>{{ slotProps.productName }}</span>
      </template>
      <template #state="slotProps">
        <a-badge
            :text="slotProps.state?.text"
            :status="statusMap.get(slotProps.state?.value)"
        />
      </template>
      <template #version="slotProps">
        <span>{{ slotProps.firmwareInfo?.version || '--' }}</span>
      </template>
      <template #registerTime="slotProps">
        <span>{{slotProps.registerTime ? dayjs(slotProps.registerTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</span>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import { queryDetailList } from '@device-manager-ui/api/firmware';
import {useI18n} from 'vue-i18n';
import dayjs from "dayjs";
import {onlyMessage} from "@jetlinks-web/utils";
import {useRouteQuery} from "@vueuse/router/index";

const {t: $t} = useI18n();
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
  type: {
    type: String,
    default: 'Self'
  },
  data: {
    type: Object,
    default: () => ({})
  },
  productId: {
    type: String,
    default: '',
  },
});

const params = ref({});
const _selectedRowKeys = ref([]);
const tableRef = ref()
const search = useRouteQuery('q')
const searchTarget = useRouteQuery('target')

const defaultParams = {
  // context: {
  //   includeTags: false,
  //   includeBind: false,
  //   includeRelations: false,
  // },
  terms: props.productId ? [
    {
      terms: [
        {
          column: 'productId',
          value: props.productId,
        },
      ],
      type: 'and',
    },
  ] : [],
  sorts: [{name: 'createTime', order: 'desc'}],
};

const statusMap = new Map();
statusMap.set('online', 'processing');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const columns = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    fixed: 'left',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Save.SelectDevices.386303-5'),
    key: 'name',
    dataIndex: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Save.SelectDevices.386303-6'),
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    search: {
      type: 'string',
    },
    scopedSlots: true,
  },
  {
    title: $t('Save.SelectDevices.386303-7'),
    key: 'registerTime',
    dataIndex: 'registerTime',
    search: {
      type: 'date',
      rename: 'registryTime',
    },
    width: 200,
    scopedSlots: true,
  },
  {
    title: $t('Save.SelectDevices.386303-8'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Save.SelectDevices.386303-9'), value: 'online'},
        {label: $t('Save.SelectDevices.386303-10'), value: 'offline'},
        {label: $t('Save.SelectDevices.386303-11'), value: 'notActive'},
      ],
    },
    width: 150,
  },
];

const getSelectedRowsKey = (selectedRows) => {
  return selectedRows.map((item) => item?.id).filter((i) => !!i);
}

const getSetRowKey = (selectedRows) => {
  return new Set([..._selectedRowKeys.value, ...getSelectedRowsKey(selectedRows)])
};
const onSelectChange = (record, selected, selectedRows) => {
  if(selected) {
    _selectedRowKeys.value = [...getSetRowKey(selectedRows)]
  } else {
    _selectedRowKeys.value = _selectedRowKeys.value.filter((item) => item !== record?.id);
  }
};

const onSelectAllChange = (selected, selectedRows, changeRows) => {
  const unRowsKeys = getSelectedRowsKey(changeRows);
  _selectedRowKeys.value = selected
      ? [...getSetRowKey(selectedRows)]
      : _selectedRowKeys.value
          .concat(unRowsKeys)
          .filter((item) => !unRowsKeys.includes(item));
};


const onChange = (selectedRowKeys) => {
  if (selectedRowKeys.length === 0) {
    _selectedRowKeys.value = [];
  }
};

const handleSearch = (e) => {
  const newParams = (e?.terms)?.map((item1) => {
    item1.terms = item1.terms.map((item2) => {
      if (item2.column === 'version') {
        return {
          column: 'id$dev-firmware',
          value: [item2],
        };
      }
      return item2;
    });
    return item1;
  });
  params.value = {terms: newParams || []};
};

watch(
    () => props.data,
    (val) => {
      if(val.length){
        if(val?.[0]?.column === 'id'){
          _selectedRowKeys.value = val?.[0]?.value || []
        } else {
          // 加到搜索中
          search.value = encodeURI(JSON.stringify({val}))
          searchTarget.value = 'firmware-search-select-device' + props.type
        }
      }
    },
    {
      immediate: true,
      deep: true,
    }
);

const onSave = () => {
  return new Promise((resolve) => {
    // 判断设备数据，并返回
    if(props.type === 'Self' && _selectedRowKeys.value.length > 0) {
      resolve(_selectedRowKeys.value)
    } else if(props.type === 'All' && tableRef.value?.dataSource?.length > 0) {
      resolve(params.value)
    } else {
      onlyMessage($t('Save.SelectDevices.386303-19'), 'error')
      resolve(false)
    }
  });
};

defineExpose({ onSave })
</script>

<style lang="less" scoped>
</style>
