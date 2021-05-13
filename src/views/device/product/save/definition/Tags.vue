<template>
  <div>
    <a-form :form="form">
      <a-form-item label="标签标识">
        <a-input
          placeholder="请输入标签标识"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入标签标识' },
              { max: 64, message: '标签标识不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '标签标识只能由数字、字母、下划线、中划线组成' }
            ],
            initialValue: DrawerData.id ? DrawerData.id: undefined
          }]"
        />
      </a-form-item>
      <a-form-item label="标签名称">
        <a-input
          placeholder="请输入标签名称"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入标签名称' },
              { max: 200, message: '标签名称不超过200个字符' }
            ],
            initialValue: DrawerData.name ? DrawerData.name: undefined
          }]"
        />
      </a-form-item>
      <a-form-item label="数据类型">
        <a-select
          style="width: 100%"
          placeholder="请选择参数"
          v-decorator="['valueType.type', {
            rules: [
              { required: true, message: '请选择' }
            ],
            initialValue:DrawerData.valueType?DrawerData.valueType.type : undefined
          }]"
          @change="handleChangeType"
        >
          <a-select-opt-group>
            <span slot="label">基本类型</span>
            <a-select-option value="int">int(整数型)</a-select-option>
            <a-select-option value="long">long(长整数型)</a-select-option>
            <a-select-option value="float">float(单精度浮点型)</a-select-option>
            <a-select-option value="double">double(双精度浮点数)</a-select-option>
            <a-select-option value="string">text(字符串)</a-select-option>
            <a-select-option value="boolean">bool(布尔型)</a-select-option>
            <a-select-option value="date">date(时间型)</a-select-option>
          </a-select-opt-group>
          <a-select-opt-group>
            <span slot="label">其他类型</span>
            <a-select-option value="enum">enum(枚举)</a-select-option>
            <a-select-option value="array">array(数组)</a-select-option>
            <a-select-option value="object">object(结构体)</a-select-option>
            <a-select-option value="file">file(文件)</a-select-option>
            <a-select-option value="password">password(密码)</a-select-option>
            <a-select-option value="geoPoint">geoPoint(地理位置)</a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <value-type
        ref="types"
        v-if="showTypes"
        :type="valueType"
        :typeData="valueTypeData"
      ></value-type>
      <a-form-item label="是否只读">
        <a-radio-group
          v-decorator="[
            'expands.readOnly',
            {
              rules: [
                { required: true },
              ],
              initialValue: DrawerData.expands ? DrawerData.expands.readOnly: undefined
            },
          ]"
        >
          <a-radio value="true">
            是
          </a-radio>
          <a-radio value="false">
            否
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea
          placeholder="请输入描述"
          rows="4"
          v-decorator="['description', {
            rules: [
              { required: false }
            ],
            initialValue: DrawerData.description ? DrawerData.description: undefined
          }]"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import pyhModelMixin from '@/core/mixins/pyhModelMixin'
  export default {
    name: 'DefineTags',
    mixins: [pyhModelMixin],
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineTagsForm' }),
        showJsonDrawer: false,
        JsonData: [],
        paramsData: {},
        paramsPos: 0
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
