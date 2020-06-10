<template>
  <a-card :loading="loading" :body-style="{ padding: '20px 24px 8px' }" :bordered="false">
    <div class="gauge-card-header">
      <div class="meta">
        <span class="gauge-card-title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
        <span class="gauge-card-action">
          <slot name="action"></slot>
        </span>
      </div>
    </div>
    <div class="gauge-card-content">
      <div class="content-fix">
        <slot></slot>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'GaugeCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
  .gauge-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;

    .meta {
      position: relative;
      overflow: hidden;
      width: 100%;
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
      line-height: 22px;
    }
  }

  .gauge-card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .gauge-card-content {
    margin-bottom: 12px;
    position: relative;
    height: 120px;
    width: 100%;

    .content-fix {
      position: absolute;
      left: -32px;
      bottom: -124px;
      width: 100%;
    }
  }
</style>
