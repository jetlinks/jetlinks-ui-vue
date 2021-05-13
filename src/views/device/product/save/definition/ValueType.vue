<template>
  <div>
    <!-- int long -->
    <template v-if="type === 'int' || type === 'long' || type === 'float'">
      <a-form-item label="取值范围" :style="{height: '69px'}">
        <a-col :span="11">
          <a-form-item>
            <a-input-number
              :style="{width:'100%'}"
              placeholder="最小值"
              v-decorator="['valueType.min',{
                initialValue:typeData.min?typeData.min : undefined
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="2" :style="{textAlign:'center'}">~</a-col>
        <a-col :span="11">
          <a-form-item>
            <a-input-number
              :style="{width:'100%'}"
              placeholder="最大值"
              v-decorator="['valueType.max',{
                initialValue:typeData.max?typeData.max : undefined
              }]"
            />
          </a-form-item>
        </a-col>
      </a-form-item>
      <a-form-item label="步长">
        <a-input-number
          :style="{width:'100%'}"
          placeholder="请输入步长"
          v-decorator="['valueType.step',{
            initialValue:typeData.step?typeData.step : undefined
          }]"
        />
      </a-form-item>
      <a-form-item label="精度" v-if="type === 'double' || type === 'float'">
        <a-input-number
          :style="{width:'100%'}"
          placeholder="请输入精度"
          v-decorator="['valueType.scale',{
            initialValue:typeData.scale?typeData.scale : undefined
          }]"
        />
      </a-form-item>
    </template>
    <!-- boolean -->
    <template v-if="type === 'boolean' ">
      <a-form-item label="布尔值" :style="{height: '69px'}">
        <a-col :span="11">
          <a-form-item >
            <a-input
              :style="{width:'100%'}"
              placeholder="trueText"
              v-decorator="['valueType.trueText']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="2" :style="{textAlign:'center'}">~</a-col>
        <a-col :span="11">
          <a-form-item>
            <a-input
              :style="{width:'100%'}"
              placeholder="trueValue"
              v-decorator="['valueType.trueValue']"
            />
          </a-form-item>
        </a-col>
      </a-form-item>
      <a-form-item :style="{height: '69px'}">
        <a-col :span="11">
          <a-form-item >
            <a-input
              :style="{width:'100%'}"
              placeholder="falseText"
              v-decorator="['valueType.falseText']"
            />
          </a-form-item>
        </a-col>
        <a-col :span="2" :style="{textAlign:'center'}">~</a-col>
        <a-col :span="11">
          <a-form-item>
            <a-input
              :style="{width:'100%'}"
              placeholder="falseValue"
              v-decorator="['valueType.falseValue']"
            />
          </a-form-item>
        </a-col>
      </a-form-item>
    </template>
    <!-- date -->
    <template v-if="type === 'date' ">
      <a-form-item label="时间格式">
        <a-auto-complete
          :data-source="dateSource"
          :dropdownMatchSelectWidth="false"
          :dropdownStyle="{width: 300}"
          :style="{width: '100%'}"
          optionLabelProp="value"
          v-decorator="['valueType.format']"
        >
          <a-input
            placeholder="请选择时间格式"
          />
        </a-auto-complete>
      </a-form-item>
    </template>
    <!-- 枚举项 -->
    <template v-if="type === 'enum' ">
      <a-form-item label="枚举项">
        <a-row v-for="(item,index) in arrayEnumData" :key="'arrayEnumData' + index">
          <a-col :span="10">
            <a-form-item >
              <a-input
                placeholder="编号为0"
                v-decorator="['valueType.enum.num']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="1" :style="{textAlign:'center'}">
            <a-icon type="arrow-right" />
          </a-col>
          <a-col :span="10">
            <a-form-item>
              <a-input
                placeholder="对该枚举项的描述"
                v-decorator="['valueType.enum.des']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="3" :style="{textAlign:'center'}">
            <a-row v-if="index === 0">
              <a-col :span="10">
                <a-icon type="plus-circle" @click="() => { arrayEnumData.push({}) }"/>
              </a-col>
            </a-row>
            <a-row v-if="index > 0">
              <a-col :span="10">
                <a-icon type="plus-circle" @click="() => { arrayEnumData.push({}) }"/>
              </a-col>
              <a-col :span="10" >
                <a-icon type="minus-circle" @click="() => { arrayEnumData.pop() }"/>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form-item>
    </template>
    <!-- 数组 -->
    <template v-if="type === 'array' ">
      <a-form-item label="元素类型">
        <a-radio-group :options="arrayOptions"/>
      </a-form-item>
      <a-form-item label="元素个数">
        <a-input placeholder="输入元素个数"/>
      </a-form-item>
    </template>
    <!-- object -->
    <template v-if="type === 'object' ">
      <a-form-item label="JSON对象">
        <a-list v-if="JsonData.length" bordered :data-source="JsonData">
          <a-list-item slot="renderItem" slot-scope="item,index">
            <a slot="actions" @click="editJsonData(item,index)">编辑</a>
            <a slot="actions">删除</a>
            {{ item.name }}
          </a-list-item>
        </a-list>
        <a-button type="link" @click="setJson">
          <a-icon type="plus" />
          添加参数
        </a-button>
      </a-form-item>
    </template>
    <define-paramter
      v-if="showJsonDrawer"
      :visible="showJsonDrawer"
      :paramsData="paramsData"
      :paramsPos="paramsPos"
      @close="onJsonDrawerClose"
      @editObjectDada="editObjectDada"
      @addObjectDada="addObjectDada"
    ></define-paramter>
    <!-- file -->
    <template v-if="type === 'file' ">
      <a-form-item label="文件类型">
        <a-select
          v-decorator="['valueType.fileType']"
        >
          <a-select-option value="url">URL(链接)</a-select-option>
          <a-select-option value="base64">Base64(Base64编码)</a-select-option>
          <a-select-option value="binary">Binary(二进制)</a-select-option>
        </a-select>
      </a-form-item>
    </template>
    <!-- password -->
    <template v-if="type === 'password' ">
      <a-form-item label="密码长度">
        <a-input
          v-decorator="['valueType.expands.maxLength']"
        >
          <template slot="addonAfter">
            字节
          </template>
        </a-input>
      </a-form-item>
    </template>
    <!-- 单位 -->
    <a-form-item v-if="type === 'int' || type === 'long' || type === 'double' || type === 'float' " label="单位">
      <a-auto-complete
        :dropdownMatchSelectWidth="false"
        :dropdownStyle="{width: 300}"
        :style="{width: '100%'}"
        optionLabelProp="title"
        @select="selectUnit"
        v-decorator="['valueType.unit',{
          initialValue:typeData.unit?typeData.unit : undefined
        }]"
      >
        <template slot="dataSource">
          <a-select-opt-group v-for="(item, keys,index) in unitsList" :key="keys + index" :label="keys">
            <a-select-option
              v-for="(ele) in item"
              :key="`${ele.name}/${ele.symbol}`"
              :value="ele.id"
              :title="`${ele.name}/${ele.symbol}`"
            >
              {{ `${ele.name}/${ele.symbol}` }}
            </a-select-option>
          </a-select-opt-group>
        </template>
        <a-input
          @click="setUnit"
          placeholder="请选择单位"
        />
      </a-auto-complete>
    </a-form-item>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { handleunitsData } from '../../service'
  import { cloneDeep } from 'lodash'
  import DefineParamter from './Paramter'
  export default {
    name: 'ValueType',
    props: {
      type: {
        type: String,
        default: ''
      },
      typeData: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      DefineParamter
    },
    data () {
      return {
        dateSource: [{
          text: 'String类型的UTC时间戳 (毫秒)',
          value: 'string'
        }, 'yyyy-MM-dd', 'yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd HH:mm:ss EE', 'yyyy-MM-dd HH:mm:ss zzz'],
        unitsList: [],
        arrayEnumData: [{}],
        arrayOptions: ['int32(整数型)', 'float(单精度）', 'double(双精度)', 'text(字符串)', 'object(结构体)'],
        showJsonDrawer: false,
        JsonData: [],
        paramsData: {},
        paramsPos: 0
      }
    },
    mounted () {
      this.GetData()
      this.initData()
    },
    computed: {
      ...mapGetters('device', ['unitsData'])
    },
    methods: {
      ...mapActions('device', ['getUnits']),
      GetData () {
        this.getUnits()
      },
      initData () {
        console.log('this.typeData', this.typeData)
        if (this.type === 'object' && Object.keys(this.typeData).length > 0) {
          this.JsonData = cloneDeep(this.typeData.properties)
        }
        // this.getUnits()
      },
      setUnit () {
        if (this.unitsList.length === 0) {
          this.unitsList = handleunitsData(this.unitsData)
        }
      },
      selectUnit (value) {
      },
      setJson () {
        this.showJsonDrawer = true
        // this.JsonData.push({})
      },
      editJsonData (data, index) {
        this.paramsPos = index
        this.paramsData = data
        this.showJsonDrawer = true
      },
      editObjectDada (editPos, editData) {
        this.$set(this.JsonData, editPos, editData)
        this.showJsonDrawer = false
      },
      addObjectDada (editData) {
        this.JsonData.splice(this.JsonData.length, 1, editData)
        this.showJsonDrawer = false
      },
      onJsonDrawerClose () {
        this.showJsonDrawer = false
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
