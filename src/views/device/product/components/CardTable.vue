<template>
  <a-card
    :title="title"
    style="width:100%;padding:10px"
  >
    <a-button slot="extra" type="primary" @click="addData">添加</a-button>
    <a-table rowKey="id" :columns="attributeColumns" :data-source="showData">
      <!-- <template slot="operation">
        <a-button type="link" style="padding: 0;">编辑</a-button>
        <a-divider type="vertical" />
        <a-button type="link" style="padding: 0;">删除</a-button>
      </template> -->
    </a-table>
    <a-drawer
      :width="'500px'"
      :title="title"
      :visible="showDrawer"
      @close="onCloseDrawer"
    >
      <template v-if="tabKey==='1'">
        <define-attribute
          ref="attribute"
          :tabKey="tabKey"
          :edititem="edititem"
          @onEditItem="onEditItem"
        ></define-attribute>
      </template>
      <template v-if="tabKey==='2'">
        <define-function
          ref="funcs"
          :tabKey="tabKey"
          :edititem="edititem"
          @onEditItem="onEditItem"
        ></define-function>
      </template>
      <template v-if="tabKey==='3'">
        <define-event
          ref="events"
          :tabKey="tabKey"
          :edititem="edititem"
          @onEditItem="onEditItem"
        ></define-event>
      </template>
      <template v-if="tabKey==='4'">
        <define-tags
          ref="tags"
          :tabKey="tabKey"
          :edititem="edititem"
          @onEditItem="onEditItem"
        ></define-tags>
      </template>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onCloseDrawer">
          关闭
        </a-button>
        <a-button type="primary" @click="submitData">
          保存
        </a-button>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import ComDrawer from '@/components/Drawer'
  import DefineAttribute from '../save/definition/attribute.vue'
  import DefineFunction from '../save/definition/Functions.vue'
  import DefineEvent from '../save/definition/Events.vue'
  import DefineTags from '../save/definition/Tags.vue'

  export default {
    name: 'CardTable',
    components: {
      ComDrawer,
      DefineAttribute,
      DefineFunction,
      DefineEvent,
      DefineTags
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      tabKey: {
        type: String,
        default: '1'
      },
      attributeColumns: {
        type: Array,
        default: () => []
      },
      showData: {
        type: Array,
        default: () => []
      },
      edititem: {
        type: Object,
        default: () => {}
      },
      showDrawer: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'CardTableForm' })
      }
    },
    methods: {
      addData () {
        this.$emit('addData')
      },
      onCloseDrawer () {
        this.$emit('close')
      },
      onEditItem (metadata) {
        this.$emit('onEditItem', metadata)
      },
      submitData () {
        if (this.tabKey === '1') {
          this.$refs.attribute.submitData()
        } else if (this.tabKey === '2') {
          this.$refs.funcs.submitData()
        } else if (this.tabKey === '3') {
          this.$refs.events.submitData()
        } else if (this.tabKey === '4') {
          this.$refs.tags.submitData()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
