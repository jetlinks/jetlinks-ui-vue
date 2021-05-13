<template>
  <div
    :class="[
      'tagSelect',
      expandable ? 'hasExpandTag': '',
      expand ? 'expanded': ''
    ]"
    :style="styles"
  >
    <a-checkable-tag key="tag-select-__all__">
      {{ actionsText.selectAllText }}
    </a-checkable-tag>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'NoticeTagSelect',
    props: {
      expandable: {
        type: Boolean,
        default: false
      },
      expand: {
        type: Boolean,
        default: false
      },
      styles: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        actionsText: {
          expandText: '展开',
          collapseText: '收起',
          selectAllText: '全部'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
@import './index.less';
</style>
