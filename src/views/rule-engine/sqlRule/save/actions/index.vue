<template>
  <div :style="{paddingBottom: '5px'}">
    <a-card :bordered="false" :style="{backgroundColor: '#F5F5F6'}">
      <a-row :style="{marginLeft: '-2px'}">
        <span>执行动作: {{ 1 }}</span>
        <a-popconfirm
          title="确认删除此执行动作？"
          cancel-text="取消"
          ok-text="确定"
        >
          <a :style="{paddingLeft: '30px'}">删除</a>
        </a-popconfirm>
      </a-row>

      <a-row :gutter="16" key="1" :style="{paddingLeft: 10}">
        <a-col :span="4">
          <a-select placeholder="选择动作类型" key="trigger">
            <a-select-option value="notifier">消息通知</a-select-option>
            <a-select-option value="device-message-sender">设备输出</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
  export default {
    name: 'SaveAction'
  }
</script>

<style lang="scss" scoped>

</style>
