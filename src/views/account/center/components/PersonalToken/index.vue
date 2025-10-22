<template>
  <div class="personal-token">
    <div class="personal-token-header">
      <div style="display: flex; gap: 24px; align-items: center">
        <div>
          <img src="@/assets/personal-token/add.png" alt="" />
        </div>
        <div style="color: #1A1A1A">{{ $t('PersonalToken.index.061384-0') }}</div>
      </div>
      <a-button type="primary" @click="handleAdd">
        {{ $t('PersonalToken.index.061384-1') }}
      </a-button>
    </div>

    <div v-if="tokenList.length === 0" class="empty-state">
      <div class="empty-content">
        <j-empty />
      </div>
    </div>

    <div v-else class="token-list">
      <TokenCard
        v-for="token in tokenList"
        :key="token.id"
        :token="token"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <TokenDialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :mode="dialogMode"
      :token="selectedToken"
      @save="handleDialogOk"
      @close="dialogVisible = false"
    />

<!--    <a-modal-->
<!--      v-model:open="deleteVisible"-->
<!--      title="删除令牌"-->
<!--      @ok="confirmDelete"-->
<!--      @cancel="deleteVisible = false"-->
<!--    >-->
<!--      <p>确定要删除该令牌吗？删除后将无法恢复。</p>-->
<!--    </a-modal>-->
  </div>
</template>

<script setup>
import { onlyMessage } from '@jetlinks-web/utils'
import TokenCard from './components/TokenCard.vue'
import TokenDialog from './components/TokenDialog.vue'
import { getCreatedPersonalTokens_api, deletePersonalToken_api } from '@/api/account/center'
import { useRequest } from '@jetlinks-web/hooks'

const tokenList = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('add')
const selectedToken = ref(null)
const deleteVisible = ref(false)
const tokenToDelete = ref(null)

const { run,reload } = useRequest(getCreatedPersonalTokens_api, {
  defaultParams: {
    sorts: [
      { name: 'createTime', order: 'desc' }
    ],
    pageSize: 10000,
    pageIndex: 0
  },
  onSuccess: (res) => {
    tokenList.value = res.result.data || []
  }
})

const handleAdd = () => {
  selectedToken.value = null
  dialogMode.value = 'add'
  dialogVisible.value = true
}

const handleView = (token) => {
  selectedToken.value = token
  dialogMode.value = 'view'
  dialogVisible.value = true
}

const handleEdit = (token) => {
  selectedToken.value = token
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

const handleDelete = async (token) => {
  const res = await deletePersonalToken_api(token.id)
  if (res.success) {
    reload()
    onlyMessage('操作成功')
  }
}

const confirmDelete = async () => {
  // try {
  //   await deleteToken(tokenToDelete.value.id)
  //
  //   tokenList.value = tokenList.value.filter(item => item.id !== tokenToDelete.value.id)
  //   message.success('删除成功')
  //   deleteVisible.value = false
  //   tokenToDelete.value = null
  // } catch (error) {
  //   console.error('删除失败:', error)
  //   message.error('删除失败')
  // }
}

const handleDialogOk = async (data) => {
  reload()
  onlyMessage('操作成功')
  dialogVisible.value = false
  // try {
  //   if (dialogMode.value === 'add') {
  //     const response = await createToken(data)
  //     if (response.status === 200) {
  //       await loadTokenList()
  //       message.success('新增成功')
  //     }
  //   } else if (dialogMode.value === 'edit') {
  //     const response = await updateToken(selectedToken.value.id, data)
  //     if (response.status === 200) {
  //       await loadTokenList()
  //       message.success('编辑成功')
  //     }
  //   }
  //   dialogVisible.value = false
  // } catch (error) {
  //   console.error('操作失败:', error)
  //   message.error(dialogMode.value === 'add' ? '新增失败' : '编辑失败')
  // }
}

</script>

<style lang="less" scoped>
.personal-token {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background-color: #F7F8FA;
    padding: 12px;
    border-radius: 6px;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.token-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto;
}
</style>
