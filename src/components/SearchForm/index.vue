<template>
  <div class="table-page-search-wrapper">
    <a-form
      layout="inline"
      class="antAdvancedSearchForm"
    >
      <a-row :gutter="{ md: 8, lg: 24, xl: 48 }">
        <a-col v-for="(item, index) in ColData" :key="'com-search-form-col'+index" :md="8" :sm="24" :style="{ height: '56px' }">
          <a-form-item :label="item.label">
            <a-input v-if="item.type === 'string' " v-model="queryParam.id" :placeholder="`请输入${item.label}`"/>
            <a-select v-if="item.type === 'list' " :mode="item.options.mode || 'multiple'">
              <a-select-option v-for="(ele, inx) in item.options.data" :key="ele.id || inx">{{ ele.name || ele }}</a-select-option>
            </a-select>
            <a-datePicker v-if="item.type === 'dateTime' " showTime :style="{ width: '100%' }" />
            <a-range-picker v-if="item.type === 'dateRange' || item.type === 'time'" showTime :style="{ width: '100%' }" />
            <a-range-picker
              v-if="item.type === 'dateTimeRange'"
              :showTime="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              :placeholder="['开始时间', '结束时间']"
              :style="{ width: '100%' }"
            />
            <a-input-number
              v-if="item.type === 'number'"
              :style="{ width: '100%' }"
              :placeholder="`请输入${item.label}`"
            />
            <a-tree-select
              v-if="item.type === 'treeSelect'"
              :dropdownStyle="item.options.dropdownStyle || ''"
              :allowClear="item.options.showSearch || false"
              :treeDataSimpleMode="item.options.showSearch || false"
              :showSearch="item.options.showSearch || false"
              :multiple="item.options.multiple || false"
              :placeholder="`${item.label}`"
              :treeData="item.options.data || []"
              :treeNodeFilterProp="'title'"
            />
          </a-form-item>
        </a-col>
        <div
          :style="{
            float: 'right',
            marginBottom: '24px',
            marginRight: '30px',
            marginTop: '4px'
          }"
        >
          <a-button type="primary" @click="() => this.queryParam = {}">查询</a-button>
          <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
          <a v-if="formItems.length > 2" @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? '收起' : '展开' }}
            <a-icon :type="advanced ? 'up' : 'down'"/>
          </a>
        </div>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: 'ComSearchForm',
    props: {
      formItems: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      GetFormItems (showCol) {
        return function (showCol) {
          return showCol ? this.formItems.slice(0, showCol) : this.formItems
        }
      }
    },
    mounted () {
      this.ColData = this.GetFormItems(2)
    },
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        ColData: []
      }
    },
    methods: {
      toggleAdvanced () {
        this.advanced = !this.advanced
        this.ColData = this.advanced ? this.GetFormItems() : this.GetFormItems(2)
      }
    }
  }
</script>

<style lang="less">
@import './index.less';
</style>
