<template>
  <div class="permission-choose-container">
    <div class="detail-controls">
      <a-input-search
          v-model:value="searchKeyword"
          allowClear
          :placeholder="$t('PersonalToken.PermissionList.061384-2')"
          @search="onSearch"
          style="width: 200px"
      />
      <a-button v-if="!disabled && mode === 'add'" @click="resetToInit" type="text">{{ $t('PersonalToken.PermissionList.061384-3') }}</a-button>
    </div>
    <a-table
        :columns="columns"
        :data-source="_sourceList"
        :pagination="false"
        :loading="loading"
        row-key="id"
        :scroll="{y: 300}"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'actions'">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div>{{ $t('PersonalToken.PermissionList.061384-4') }}</div>
            <a-space>
              <span style="font-weight: normal">{{ $t('PersonalToken.PermissionList.061384-5', [selectedCount]) }}</span>
              <template v-if="!disabled">
                <a-button v-if="!isSelectAll" type="link" size="small" @click="selectAll(true)">{{ $t('PersonalToken.PermissionList.061384-6') }}</a-button>
                <a-button v-else type="link" size="small" @click="selectAll(false)">{{ $t('PersonalToken.PermissionList.061384-7') }}</a-button>
              </template>
            </a-space>
          </div>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-checkbox
              v-model:checked="record.checkAll"
              :indeterminate="record.indeterminate"
              @change="(e) => selectAllOptions(e, record)"
              :disabled="disabled"
          >
            {{ record.name }}
          </a-checkbox>
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-checkbox-group
              v-model:value="record.checkedList"
              :options="record.options"
              @change="(val) => selectOption(record, val)"
              :disabled="disabled"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { handleData } from './data'
import { queryPermission_api } from '@authentication-manager-ui/api/system/permission'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  selectedInitType: {
    type: String,
    default: ''
  },
})

const emit = defineEmits(['update:value', 'change', 'close'])

const searchKeyword = ref('')
const _searchKeyword = ref('')
const list = ref([])
const sourceList = ref([])
const loading = ref(false)

// 计算已选择的权限数量
const selectedCount = computed(() => {
  return props.value.reduce((acc, cur) => {
    return acc + cur.actions.length
  }, 0)
  // return props.value.reduce((acc, cur) => acc + cur.checkedList.length, 0)
})

const mode = inject('mode')

const isSelectAll = computed(() => {
  return selectedCount.value === list.value.reduce((acc, cur) => {
    return acc + cur.options.length
  }, 0)
})

const columns = [
  {
    title: $t('PersonalToken.PermissionList.061384-8'),
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: $t('PersonalToken.PermissionList.061384-9'),
    dataIndex: 'actions',
    key: 'actions',
  },
]

const selectAll = (flag) => {
  if(!flag){
    emit('update:value', [])
  } else {
    if(sourceList.value.length === 0) {
      return
    }
    const arr = [];
    // 不要直接修改list.value，而是基于sourceList.value构造数据
    sourceList.value.forEach(item => {
      if(item.actions && item.actions.length > 0) {
        arr.push({
          id: item.id,
          actions: item.actions.map(action => action.action),
        })
      }
    })
    emit('update:value', arr)
  }
}
const onSearch = (e) => {
  _searchKeyword.value = e
}

// 全选/取消全选
const selectAllOptions = (e, _row) => {
  const newValue = props.value.filter(
      (item) => item.id !== _row.id,
  )
  if (e.target.checked) {
    newValue.push({
      id: _row.id,
      actions: _row.options.map((item) => item.value),
    })
  }
  emit('update:value', newValue)
}

const selectOption = (_row, newValue) => {
  const newProp = props.value.filter((item) => item.id !== _row.id)
  if (newValue.length === _row.options.length) {
    newProp.push({
      id: _row.id,
      actions: newValue,
    })
  } else if (newValue.length > 0) {
    newProp.push({
      id: _row.id,
      actions: newValue,
    })
  }
  emit('update:value', newProp)
}

const _sourceList = computed(() => {
  return list.value.filter(i => {
    return !_searchKeyword.value || i.name.includes(_searchKeyword.value)
  })
})

const handleSearch = () => {
  const params = {
    paging: false,
  }
  // if (e) {
  //   params.terms = [{ column: 'name$like', value: `%${e}%` }]
  // }
  loading.value = true;
  queryPermission_api(params).then((resp) => {
    if (resp.success) {
      sourceList.value = resp.result || []
      !props.value?.length && initializePermissions(props.selectedInitType)
    }
  }).finally(() => {
    loading.value = false;
  })
}

const initializePermissions = (type) => {
  const arr = [];
  switch (type) {
    case 'custom':
      // 自定义：不预选任何权限
      break
    case 'readonly':
      // 只读：选择所有查看权限
      sourceList.value.forEach(item => {
        if(item.actions.some(action => action.action === 'query')) {
          arr.push({
            id: item.id,
            actions: ['query'],
          })
        }
      })
      break
    case 'readwrite':
      // 读写：选择查看、编辑、启用/禁用、导入权限
      const readwriteActions = ['query', 'save', 'enable', 'disable', 'import', 'export', 'add', 'find-geo', 'save-geo', 'bind-user', 'unbind-user']
      sourceList.value.forEach(item => {
        if(item.actions.some(action => readwriteActions.includes(action.action))) {
          arr.push({
            id: item.id,
            actions: item.actions.filter(action => readwriteActions.includes(action.action)).map(action => action.action),
          })
        }
      })
      break
    case 'fullaccess':
      // 全量：选择所有权限（除了个人中心的查看和保存）
      // selectedPermissions.value = menus.flatMap(menu => menu.actions)
      sourceList.value.forEach(item => {
        arr.push({
          id: item.id,
          actions: item.actions.map(action => action.action),
        })
      })
      break
  }
  emit('update:value', arr)
}

const resetToInit = () => {
  emit('update:value', [])
  emit('close')
}

onMounted(() => {
  handleSearch()
})

watch(
    () => [props.value, sourceList.value],
    ([val1, val2]) => {
      list.value = handleData(val2, val1)
    },
    {
      deep: true,
      immediate: true
    }
)
</script>

<style lang="less" scoped>
.permission-choose-container {
  .detail-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
</style>
