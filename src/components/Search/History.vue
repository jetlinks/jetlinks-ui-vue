<template>
  <a-dropdown-button
    type='primary'
    @click='click'
    placement='bottomLeft'
    :visible='historyVisible'
    @visibleChange='visibleChange'
  >
    搜索
    <template #overlay>
      <a-menu>
        <template v-if='!showEmpty'>
          <a-menu-item v-for='item in historyList' :key='item.id'>
            <div class='history-item'>
              <span @click.stop='itemClick(item.content)'>{{ item.name }}</span>
              <a-popconfirm
                title='确认删除吗？'
                placement='top'
                @confirm.stop='deleteHistory(item.id)'
                :okButtonProps='{
                  loading: deleteLoading
                }'
              >
                <span class='delete'>
                  <DeleteOutlined />
                </span>
              </a-popconfirm>
            </div>
          </a-menu-item>
        </template>
        <template v-else>
          <div class='history-empty'>
            <a-empty />
          </div>
        </template>
      </a-menu>
    </template>
    <template #icon>
      <SearchOutlined />
    </template>
  </a-dropdown-button>
</template>

<script setup lang='ts' name='SearchHistory'>
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { deleteSearchHistory, getSearchHistory } from '@/api/comm'
import type { SearchHistoryList } from 'components/Search/types'

type Emit = {
  (event: 'click'): void
  (event: 'itemClick', data: string): void
}
const emit = defineEmits<Emit>()

const props = defineProps({
  target: {
    type: String,
    default: '',
    required: true
  }
})

const historyList = ref<SearchHistoryList[]>([])
const historyVisible = ref(false)
const deleteLoading = ref(false)
const showEmpty = ref(false)

const visibleChange = async (visible: boolean) => {
  historyVisible.value = visible
  if (visible) {
    const resp = await getSearchHistory(props.target)
    if (resp.success && resp.result.length) {
      historyList.value = resp.result.filter(item => item.content)
      showEmpty.value = false
    } else {
      showEmpty.value = true
    }
  }
}

const click = () => {
  emit('click')
}

const itemClick = (content: string) => {
  historyVisible.value = false
  emit('itemClick', content)
}

const deleteHistory = async (id: string) => {
  deleteLoading.value = true
  const resp = await deleteSearchHistory(props.target, id)
  deleteLoading.value = false
  if (resp.success) {
    historyVisible.value = false
  }
}

</script>

<style scoped lang='less'>
.history-empty {
  width: 200px;
  background-color: #fff;
  box-shadow: @box-shadow-base;
  border-radius: 2px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 200px;
}

.history-item {
  width: 200px;
  display: flex;

  > span {
    flex: 1 1 auto;
  }

  .delete {
    padding: 0 6px;
    flex: 0 0 28px;
  }
}
</style>