<script setup name="Detail">
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const activeKey = ref('basic')

const formModel = reactive({
  name: undefined,

})

</script>

<template>
  <j-page-container>
    <div class="menu-detail-container">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="basic" :tab="$t('Detail.index.765389-0')">
          <a-form ref="formRef" :model="formModel" layout="vertical">
            <a-row>
              <a-col :span="12">
                <a-form-item label="名称">
                  <a-input v-model:value="formModel.name" :placeholder="$t('Detail.index.765389-2')" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="所属组织">
                  <a-input v-model:value="formModel.name" :placeholder="$t('Detail.index.765389-2')" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="角色">
                  <a-input v-model:value="formModel.name" :placeholder="$t('Detail.index.765389-2')" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="上级职位">
                  <a-input v-model:value="formModel.name" :placeholder="$t('Detail.index.765389-2')" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="user" :tab="$t('Detail.index.765389-1')">

        </a-tab-pane>
      </a-tabs>
    </div>
  </j-page-container>
</template>

<style scoped lang="less">

</style>
