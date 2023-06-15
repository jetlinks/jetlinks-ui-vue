<template>
  <ReadType />
  <j-form-item label="触发属性" required>

  </j-form-item>
  <j-form-item label="计算规则" required>
    <div class="rule-add">
      编辑规则
    </div>
  </j-form-item>
  <j-form-item label="聚合函数" required>
    <j-seltct
      :options="[
          { label: '无', value: null },
          { label: '时间窗口', value: 'time' },
          { label: '频次窗口', value: '' },
      ]"
    />
  </j-form-item>
</template>

<script setup lang="ts" name="Rule">
import { ReadType } from '../components'

</script>

<style scoped>
.rule-add {

}
</style>