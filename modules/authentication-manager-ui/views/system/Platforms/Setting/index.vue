<template>
  <j-page-container>
    <div class="api-container">
      <Api mode="api">
        <template #top>
          <p>
            <AIcon
                type="ExclamationCircleOutlined"
                style="margin-right: 12px; font-size: 14px"
            />
            {{ $t('Platforms.index.366248-0') }}
          </p>
        </template>
      </Api>
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="Api">
import Api from '../Api/index.vue';
</script>

<style lang="less" scoped>
.api-container {
  background-color: #fff;
  padding: 24px;
}

</style>