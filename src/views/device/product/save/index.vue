<template>
  <div>
    <a-card
      style="width:100%;padding:10px"
    >
      <a-tabs default-active-key="info" @change="callback">
        <a-tab-pane key="info" tab="产品信息">
          <a-descriptions bordered>
            <template v-slot:title>
              产品信息
              <a-button
                icon="edit"
                :style="{ marginLeft: 20 }"
                type="link"
                @click="editProduct"
              >编辑
              </a-button>
            </template>
            <a-descriptions-item label="产品ID" :span="1">
              {{ baseInfo.id }}
            </a-descriptions-item>
            <a-descriptions-item label="所属品类" :span="1">
              {{ baseInfo.classifiedName }}
            </a-descriptions-item>
            <a-descriptions-item label="所属机构" :span="1">
              {{ baseInfo.orgName }}
            </a-descriptions-item>
            <a-descriptions-item label="消息协议" :span="1">
              {{ baseInfo.protocolName || baseInfo.protocolId }}
            </a-descriptions-item>
            <a-descriptions-item label="链接协议" :span="1">
              {{ baseInfo.transportProtocol }}
            </a-descriptions-item>
            <a-descriptions-item label="设备类型" :span="1">
              {{ (baseInfo.deviceType || {}).text }}
              <!-- <a-badge status="processing" text="Running" /> -->
            </a-descriptions-item>
            <a-descriptions-item label="说明" :span="2">
              {{ baseInfo.describe }}
            </a-descriptions-item>
          </a-descriptions>
          <template v-if="configurationInfo.length">
            <a-descriptions>
              <template v-slot:title>
                配置
                <a-button icon="edit" :style="{ marginLeft: 20 }" type="link">编辑
                </a-button>
              </template>
            </a-descriptions>
            <div v-for="(item, index) in configurationInfo" :key="'configurationInfo' + index">
              <h3>{{ item.name }}</h3>
              <a-descriptions bordered :column="2">
                <a-descriptions-item
                  v-for="(ele, inx) in item.properties"
                  :key="ele.name + inx"
                  :span="1"
                >
                  <template v-slot:label>
                    <div>
                      <span :style="{ marginRight: '20px' }">{{ ele.name }}</span>
                      <a-tooltip :title="ele.description">
                        <a-icon type="question-circle-o" />
                      </a-tooltip>
                    </div>
                  </template>
                </a-descriptions-item>

              </a-descriptions>
            </div>
          </template>
        </a-tab-pane>
        <a-tab-pane key="phyModel" tab="物模型">
          <pro-pyh-model></pro-pyh-model>
        </a-tab-pane>
        <a-tab-pane key="warnSetting" tab="告警设置">
          <device-alarm :target="'product'"></device-alarm>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <com-drawer :width="'500px'" :title="title" :visible="showDrawer" @onClose="onCloseDrawer">
      <pro-base-info :form="form" :showIcon="true"></pro-base-info>
    </com-drawer>
  </div>
</template>

<script>
  import ComDrawer from '@/components/Drawer'
  import ProBaseInfo from '../components/ProBaseInfo'
  import ProPyhModel from './ProPyhModel'
  import DeviceAlarm from '@/views/device/alarm'
  import { mapGetters } from 'vuex'
  import apis from '@/api'
  export default {
    name: 'ProductDetail',
    props: {
      id: {
        type: [ String || Number ],
        default: 0
      }
    },
    components: {
      ComDrawer,
      ProBaseInfo,
      ProPyhModel,
      DeviceAlarm
    },
    data () {
      return {
        baseInfo: {},
        configurationInfo: [],
        title: '',
        showDrawer: false,
        form: this.$form.createForm(this, { name: 'ProductDetailTable' })
      }
    },
    mounted () {
      this.GetData()
    },
    watch: {
      productAllList: {
        handler (newVal) {
          if (newVal) {
            this.GetData()
          }
        }
      }
    },
    computed: {
      ...mapGetters('device', ['productDetailData', 'productAllList'])
    },
    methods: {
      GetData () {
        if (!this.productDetailData(this.id).length) {
          return
        }
        this.baseInfo = this.productDetailData(this.id)[0]
        const { id } = this.baseInfo
        apis.deviceProduct.GetConfiguration(id)
          .then(res => {
            if (res.status === 200) {
              this.configurationInfo = res.result
            }
          }).catch()
      },
      callback (key) {
        // console.log('key', key)
      },
      editProduct () {
        this.title = '编辑产品'
        this.showDrawer = true
      },
      onCloseDrawer () {
        this.title = ''
        this.showDrawer = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
