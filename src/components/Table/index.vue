<template>
  <div>
    <a-table :loading="loading" :columns="attributeColumns" :data-source="showData">
      <template slot="operation">
        <template v-for="(item, index) in actions">
          <a-button :key="'tableColoumns'+index" type="link" style="padding: 0;" @click="setAlarmActiveKey(item)">{{ item.name }}</a-button>
          <a-divider :key="'divider'+index" type="vertical" v-if="index!==actions.length-1"/>
        </template>
      </template>
    </a-table>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'ComTable',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      attributeColumns: {
        type: Array,
        default: () => []
      },
      showData: {
        type: Array,
        default: () => []
      },
      actions: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
      }
    },
    methods: {
      setAlarmActiveKey (item) {
        this.$emit('setAlarmActiveKey', item)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
