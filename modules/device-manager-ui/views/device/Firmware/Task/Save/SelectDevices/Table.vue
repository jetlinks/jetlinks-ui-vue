<template>
  <div>
    <pro-search
        :columns="columns"
        target="search-select-device"
        @search="handleSearch"
        type="simple"
    />
    <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :columns="columns"
        :request="queryDetailList"
        :defaultParams="defaultParams"
        :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelect: onSelectChange,
                onSelectAll: onSelectAllChange,
                onChange: onChange,
            }"
        :params="params"
    >
      <template #headerLeftRender>
        <a-checkbox
            v-if="checkAllData.length !== 0"
            v-model:checked="state.checkAll"
            :indeterminate="state.indeterminate"
            @change="onCheckAllChange"
            style="margin-left: 8px"
        >
          {{ $t('Save.SelectDevices.386303-4') }}
        </a-checkbox>
      </template>
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
        <span>{{ slotProps.firmwareInfo?.version || '' }}</span>
      </template>
      <template #registerTime="slotProps">
                <span>{{
                    dayjs(slotProps.registerTime).format('YYYY-MM-DD HH:mm:ss')
                  }}</span>
      </template>
    </j-pro-table>
  </div>
</template>

<script setup>
import {queryDetailList} from "@device-manager-ui/api/firmware";
import dayjs from "dayjs";
import {useI18n} from "vue-i18n";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  productId: {
    type: String,
    default: '',
  },
});

const { t: $t } = useI18n();
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
        { label: $t('Save.SelectDevices.386303-9'), value: 'online' },
        { label: $t('Save.SelectDevices.386303-10'), value: 'offline' },
        { label: $t('Save.SelectDevices.386303-11'), value: 'notActive' },
      ],
    },
    width: 150,
  },
];
const params = ref({});
const _selectedRowKeys = ref([]);

const state = reactive({
  indeterminate: false,
  checkAll: false,
  checkedList: [],
});
let checkAllData = [];
const defaultParams = {
  context: {
    includeTags: false,
    includeBind: false,
    includeRelations: false,
  },
  terms: [
    {
      terms: [
        {
          column: 'productId',
          value: props.productId,
        },
      ],
      type: 'and',
    },
  ],
  sorts: [{ name: 'createTime', order: 'desc' }],
};

const handleSearch = (e) => {
  const newParams = (e?.terms || [])?.map((item1) => {
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
  params.value = { terms: newParams || [] };
};

const onCheckAllChange = (e) => {
  Object.assign(state, {
    checkedList: e.target.checked ? checkAllData : [],
    indeterminate: false,
  });
  _selectedRowKeys.value = state.checkedList;
};

const onSelectChange = (record, selected, selectedRows) => {
  _selectedRowKeys.value = selected
      ? [...getSetRowKey(selectedRows)]
      : _selectedRowKeys.value.filter((item) => item !== record?.id);
};
const onSelectAllChange = (selected, selectedRows, changeRows) => {
  const unRowsKeys = getSelectedRowsKey(changeRows);
  _selectedRowKeys.value = selected
      ? [...getSetRowKey(selectedRows)]
      : _selectedRowKeys.value
          .concat(unRowsKeys)
          .filter((item) => !unRowsKeys.includes(item));
};

const getSelectedRowsKey = (selectedRows) =>
    selectedRows.map((item) => item?.id).filter((i) => !!i);

const getSetRowKey = (selectedRows) =>
    new Set([..._selectedRowKeys.value, ...getSelectedRowsKey(selectedRows)]);

const onChange = (selectedRowKeys) => {
  if (selectedRowKeys.length === 0) {
    _selectedRowKeys.value = [];
  }
};
</script>

<style lang="less" scoped>

</style>
