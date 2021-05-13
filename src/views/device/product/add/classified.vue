
<template>
  <a-drawer
    :visible="visiable"
    title="选择品类"
    width="40%"
    @close="() => $emit('close')"
    :closable="true"
  >
    <a-spin :spinning="spinning">
      <div :style="{paddingBottom: '20px'}">
        <a-select :style="{width: '43%'}" defaultValue="all" @change="setCategory">
          <a-select-option value="all">
            全部领域
          </a-select-option>
          <a-select-option v-for="(item, index) in categoryList" :value="item" :key="'Classfieditem'+index">
            {{ item }}
          </a-select-option>
        </a-select>
        <a-input-search
          allowClear
          placeholder="请输入品类名称或者所属场景"
          enterButton
          :style="{width: '43%', paddingLeft: '20px'}"
          @search="searchCategory"
        />
      </div>
      <div class="StandardTable">
        <a-table :columns="columns" :data-source="categoryListData" :pagination="{ pageSize: 8 }">
        </a-table>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script>
  import apis from '@/api'
  import { HandleCategoryList, HandleCategoryListData } from '../service'
  export default {
    name: 'ProductAddClassfied',
    props: {
      visiable: {
        type: Boolean,
        default: false
      },
      chooseData: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      const columns = [
        {
          title: '品类名称',
          dataIndex: 'name'
        },
        {
          title: '所属场景',
          dataIndex: 'parentName'
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          customRender: (record) => (
            <div>
              {this.chooseData !== undefined && this.chooseData.id === record.id ? (
                <span>
                  已选择
                </span>
              ) : (
                <a onClick={() => this.select(record)}>
                  选择
                </a>
              )}
            </div>
          )
        }
      ]
      return {
        CategoryData: [],
        category: '',
        spinning: false,
        AllListData: [],
        categoryListData: [],
        columns
      }
    },
    watch: {
      visiable: {
        handler (newVal, oldVal) {
          if (newVal === true) {
            this.getCategoryList()
          }
        }
      }
    },
    computed: {
      categoryList () {
        return this.CategoryData.map(item => item.name)
      }
    },
    methods: {
      async getCategoryList () {
        const result = await apis.deviceProduct.GetCategoryList()
        this.CategoryData = HandleCategoryList(result)
        this.AllListData = HandleCategoryListData(result)
        this.handleCategoryListData()
      },
      setCategory (value) {
        this.category = value
        this.handleCategoryListData(value)
      },
      searchCategory (value) {
        this.handleCategoryListData(this.category, value)
      },
      handleCategoryListData (category = '', searchParams) {
        if (searchParams) {
          if (this.category === '' || this.category === 'all') {
            this.categoryListData = this.AllListData.filter(item => item.name.includes(searchParams) || item.parentName.includes(searchParams))
          } else {
            this.categoryListData = this.AllListData.filter(item => item.name.includes(searchParams) || item.parentName.includes(searchParams))
                                                    .filter(item => item.superParentName === this.category)
          }
          return
        }
        if (category === '' || category === 'all') {
          this.categoryListData = this.AllListData
        } else {
          this.categoryListData = this.AllListData.filter(item => item.superParentName === this.category)
        }
      },
      select (data) {
        this.$emit('select', data)
      }
    }
  }
</script>

<style lang="less" scoped>
@import '~@/utils/table.less';
</style>
