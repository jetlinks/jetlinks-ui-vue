<template>
  <a-card :bordered="false" title="基本信息">
    <a-row style="margin-bottom:20px">
      <a-col :xs="2" :sm="24" :md="24" :lg="12" :xl="13">
        <pro-base-info ref="ProBaseInfoForm"></pro-base-info>
      </a-col>
      <a-col :xs="2" :sm="24" :md="24" :lg="12" :xl="11">
        <div >
          <div>图标</div>
          <div>
            <a-avatar :size="144" :src=" photoUrl ? photoUrl:require('../../../../assets/product_avater.png')" />
          </div>
          <div style="margin-top:10px;margin-left:20px">
            <a-upload
              v-bind="uploadOptions"
              @change="uploadAvatar"
            >
              <a-button> <a-icon type="upload" /> 更换图片 </a-button>
            </a-upload>
          </div>
        </div>
      </a-col>
    </a-row>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: 32,
        lineHeight: 4,
        width: '95%',
        borderTop: '1px solid #e9e9e9',
        margin: '0px 25px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button style="margin-right:8px" @click="() => { $router.push({ path:`/device/product` }) }">返回</a-button>
      <a-button type="primary" @click="SaveProduct">保存</a-button>
    </div>
  </a-card>
</template>

<script>
import ProBaseInfo from '../components/ProBaseInfo'
import { uploadMixin } from '@/core/mixins/uploadMixin'

export default {
  name: 'AddProduct',
  mixins: [uploadMixin],
  components: {
    ProBaseInfo
  },
  data () {
    return {
    }
  },
  methods: {
    SaveProduct () {
      this.$refs.ProBaseInfoForm.addProduct(this.photoUrl)
    }
  }
}
</script>

<style lang="less" scoped></style>
