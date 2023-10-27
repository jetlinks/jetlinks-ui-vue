<template>
  <j-modal
      :confirmLoading="loading"
      class="edit-dialog-container"
      title="集成菜单"
      visible
      width="600px"
      @cancel="cancel"
      @ok="handleOk"
  >
    <p>
      当前集成菜单
    </p>
    <j-tree
        v-if="menuTree.length"
        v-model:checkedKeys="menuState.checkedMenu"
        v-model:expandedKeys="menuState.expandedKeys"
        :fieldNames="{ key: 'code', title: 'name' }"
        :height="300"
        :tree-data="menuTree"
        checkable
    />
    <j-empty
      v-else
    />
  </j-modal>
</template>

<script name="ThirdMenu" setup>
import {getMenuTree_api, queryOwnThree} from '@/api/system/menu';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import { useRequest } from '@/hook'
import {filterTree, getCheckByTree} from "@/views/system/Apply/componenets/util";
import {
  saveOwnerMenu_api,
  updateApp_api,
} from '@/api/system/apply';

const props = defineProps({
  mode: {
    type: String,
    default: 'add'
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const menuStory = useMenuStore();
const loading = ref(false)
const emit = defineEmits(['ok', 'cancel']);
const menuState = reactive({
  checkedMenu: [],
  expandedKeys: [],
  menuTree: ''
})

const menuTree = computed(() => {
  try {
    return JSON.parse(menuState.menuTree || '[]')
  } catch (e) {
    return []
  }
})

useRequest(queryOwnThree,
    {
      defaultParams: { terms: [{ column: 'owner', termType: 'isnull', value: 0 }]},
      onSuccess(res) {
        menuState.menuTree = JSON.stringify(res.result)
        return res
      }
    }
)

const { run } = useRequest(getMenuTree_api, {
  immediate: false,
  onSuccess(res) {
    menuState.checkedMenu = getCheckByTree(res.result)
    return res
  }
}) // 获取应用绑定的菜单

const cancel = () => {
  if (props.mode === 'add') {
    menuStory.jumpPage('system/Apply/Save', {}, { id: props.data?.id })
  }
  emit('cancel')
}

const handleOk = async () => {
  if (!menuState.checkedMenu.length) {
    onlyMessage('请勾选配置菜单', 'warning')
    return
  }
  const id = props.data.id
  const cloneData = JSON.parse(menuState.menuTree)
  const filterData = filterTree(cloneData, menuState.checkedMenu)

  loading.value = true

  try {
    const resp = await saveOwnerMenu_api('iot', id, filterData)
    await updateApp_api(id, {
      ...props.data,
      integrationModes: props.data?.integrationModes?.map((item) => item?.value || item),
      page: {
        ...props.data?.page,
        configuration: {
          checkedSystem: props.data?.page?.configuration?.checkedSystem
        }
      }
    })

    if (resp.success) {
      // 保存集成菜单
      onlyMessage('操作成功');
      emit('ok')
    }
    loading.value = false
  } catch (e) {
    console.log(e)
    loading.value = false
  }
}

const getBindMenuData = () => {
  const id = props.data.id

  run({
    terms: [
      {
        column: 'appId',
        value: id,
      },
    ],
  })
}

if (props.data?.id) {
  getBindMenuData()
}

</script>

<style scoped>

</style>
