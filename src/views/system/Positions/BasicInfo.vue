<script src="../../../../vite.config.ts"></script>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const formData = reactive({

})
</script>

<template>
  <div class="basic-info-container">
    <div class="card">
      <TitleComponent :data="$t('BasicInfo.index.966110-0')" />
      <a-form
        ref="formRef"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label=""
              name=""
              :rules="[]"
            >
              <a-input placeholder="请输入" v-model:value="formData"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label=""
              name=""
              :rules="[]"
            >
              <a-input placeholder="请输入" v-model:value="formData"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
