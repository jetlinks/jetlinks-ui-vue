<template>
  <div class="container">
    <div v-if="!accessConfig">
      <div class="tips">
        <div>您已进入高级模式，可自定义接入配置</div>
        <a-button type="link" @click="quitAdvanceMode"
        >退出高级模式
        </a-button
        >
      </div>
      <div style="margin-bottom: 16px">请选择接入方式</div>
      <a-row :gutter="[12, 12]">
        <a-col :span="12" v-for="i in accessList">
          <div class="accessCard card" @click="() => selectAccess(i)">
            <img :src="BackMap.get(i?.provider)" alt=""/>
            <div style="margin-left: 20px">
              <div class="cardName">
                {{ providers.get(i?.provider)?.name }}
              </div>
              <div class="cardDes">
                {{ providers?.get(i?.provider)?.description }}
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-else>
      <div>
        <div class="accessInfo">
          <img :src="BackMap.get(accessConfig?.provider)" alt=""/>
          <div style="margin-left: 20px">
            <div class="cardName">
              {{ providers.get(accessConfig.provider)?.name }}
            </div>
            <div class="cardDes">
              {{ providers?.get(accessConfig?.provider)?.description }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
            v-if="
                        ['network', 'OneNet', 'Ctwing','child-device'].includes(
                            accessConfig.channel,
                        )
                    "
        >
          <div
              v-if="
                            !['OneNet', 'Ctwing','child-device'].includes(accessConfig.channel)
                        "
          >
            <TitleComponent data="网络组件">
              <template #extra>
                <a-button
                    type="link"
                    @click="visibleAddNetwork = true"
                >选择
                </a-button
                >
              </template>
            </TitleComponent>
            <a-row :gutter="[12, 12]">
              <a-col :span="8" v-if="network">
                <div
                    :class="{
                                        card: true,
                                        protocolCard: true,
                                        selected: true,
                                    }"
                    style="margin-bottom: 10px"
                >
                  <img
                      :src="link.network"
                      alt=""
                  />
                  <div style="margin-left: 20px">
                    <div class="cardName">
                      {{ network.name }}
                    </div>
                    <div class="address">
                      <a-tooltip
                          placement="top"
                          :title="getDetails(network)"
                      >
                        {{ getDetails(network) }}
                      </a-tooltip>
                    </div>
                    <div class="cardDes">
                      <j-ellipsis>
                        {{ network.description }}
                      </j-ellipsis>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="24" v-else>
                <div
                    class="noNetWork"
                    @click="visibleAddNetwork = true"
                >
                  请选择网络组件
                </div>
              </a-col>
            </a-row>
          </div>
          <div
              v-if="
                            ![
                                'agent-media-device-gateway',
                                'agent-device-gateway',
                            ].includes(accessConfig.provider)
                        "
          >
            <TitleComponent data="协议">
              <template #extra>
                <a-button
                    type="link"
                    @click="visibleAddProtocol = true"
                >选择
                </a-button
                >
              </template>
            </TitleComponent>
            <a-row :gutter="[12, 12]">
              <template v-if="protocolList.length">
                <a-col :span="8" v-for="i in protocolList">
                  <div
                      :class="{
                                            card: true,
                                            protocolCard: true,
                                            selected:
                                                i.id === protocol?.id ||
                                                i.id === selectedProtocolID,
                                        }"
                      @click="() => selectResourceProtocol(i)"
                  >
                    <img
                        :src="link.protocol"
                        alt=""
                    />
                    <div style="margin-left: 20px">
                      <div class="cardName">
                        {{ i.name }}
                      </div>
                      <div v-if="i.version" style="margin-top: 20px">
                        <a-tag>{{'v' + i.version}}</a-tag>
                      </div>
                    </div>
                  </div>
                </a-col>
              </template>
              <a-col :span="24" v-else>
                <div
                    class="noNetWork"
                    @click="visibleAddProtocol = true"
                >
                  请选择协议
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div v-if="accessConfig.channel === 'plugin'">
          <TitleComponent data="插件">
            <template #extra>
              <a-button
                  type="link"
                  @click="visibleAddPlugin = true"
              >选择
              </a-button
              >
            </template>
          </TitleComponent>
          <a-row :gutter="[12, 12]">
            <a-col :span="8" v-for="i in pluginList">
              <div
                  :class="{
                                    card: true,
                                    protocolCard: true,
                                    selected:
                                        i.id === plugin?.id ||
                                        i.id === selectedPluginID,
                                }"
                  @click="() => selectResourcePlugin(i)"
              >
                <img :src="link.plugin" alt=""/>
                <div style="margin-left: 20px">
                  <div class="cardName">
                    {{ i.name }}
                  </div>
                  <div v-if="i.version" style="margin-top: 20px">
                    <a-tag>{{'v' + i.version}}</a-tag>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="operation">
        <a-space>
          <a-button @click="quitAdvanceMode">取消</a-button>
          <a-button type="primary" @click="submitDada">确定</a-button>
        </a-space>
      </div>
    </div>
  </div>
  <Network
      v-if="visibleAddNetwork"
      :type="accessConfig?.provider"
      :data="network"
      @selectedNetWork="selectedNetWork"
      @close="visibleAddNetwork = false"
  />
  <Protocol
      v-if="visibleAddProtocol"
      :type="accessConfig?.provider"
      :data="protocol"
      @selectedProtocol="selectedProtocol"
      @close="visibleAddProtocol = false"
  />
  <Plugin
      v-if="visibleAddPlugin"
      :type="accessConfig?.provider"
      :data="plugin"
      @selectedPlugin="selectedPlugin"
      @close="visibleAddPlugin = false"
  />
</template>

<script setup>
import {BackMap} from '@device-manager-ui/views/link/AccessConfig/data';
import Network from './NetWork/index.vue';
import Protocol from './Protocol/index.vue';
import Plugin from './Plugin/index.vue';
import {onlyMessage} from '@jetlinks-web/utils';
import {cloneDeep, omit} from 'lodash-es';
import {link} from '@device-manager-ui/assets/link/index.ts'
import TitleComponent from '@device-manager-ui/components/TitleComponent/index.vue'
import {handlePluginData, queryExistProtocol} from "../data";

const props = defineProps({
  accessList: {
    type: Array,
    default: [],
  },
  providers: {
    type: Object,
    default: () => {
    },
  },
  randomString: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['quit', 'submit']);
const accessConfig = ref();
const network = ref();
const protocol = ref();
const plugin = ref();
const visibleAddNetwork = ref(false);
const visibleAddProtocol = ref(false);
const visibleAddPlugin = ref(false);
//资源库选中插件id
const selectedPluginID = ref();
//资源库选中协议id
const selectedProtocolID = ref();
const protocolList = computed(() => {
  const resource = accessConfig.value.bindInfo.some((i) => {
    return i.id === protocol.value?.id;
  });
  return (resource || !protocol.value?.id)
      ? accessConfig.value.bindInfo
      : [protocol.value];
});
const pluginList = computed(() => {
  const resource = accessConfig.value.bindInfo.some((i) => {
    return i.id === plugin.value?.id;
  });
  return resource || !plugin.value?.id
      ? accessConfig.value.bindInfo
      : [plugin.value];
});

const selectAccess = (data) => {
  accessConfig.value = data;
};

const selectedNetWork = (data) => {
  network.value = data;
  visibleAddNetwork.value = false;
};

const selectedProtocol = (data) => {
  protocol.value = data;
  visibleAddProtocol.value = false;
  selectedProtocolID.value = '';
};

const selectedPlugin = (data) => {
  plugin.value = data;
  visibleAddPlugin.value = false;
  selectedPluginID.value = '';
};

const selectResourceProtocol = async(data) => {
  protocol.value = data
  selectedProtocolID.value = data.id;
};


const selectResourcePlugin = (data) => {
  plugin.value = data
  selectedPluginID.value = data.id;
};

const quitAdvanceMode = () => {
  emits('quit');
};

//获取网络组件地址
const getDetails = (slotProps) => {
  const {typeObject, shareCluster, configuration, cluster} = slotProps;
  let headers =
      typeObject.name.replace(/[^j-zA-Z]/g, '').toLowerCase() + '://';
  const flag = slotProps.configuration?.secure || cluster?.[0]?.configuration?.secure
  if(['MQTT_CLIENT', 'MQTT_SERVER'].includes(typeObject.value) && flag){
    headers = 'mqtts://'
  }
  const content = !!shareCluster
      ? (configuration.publicHost || configuration.remoteHost) +
      ':' +
      (configuration.publicPort || configuration.remotePort)
      : (cluster[0].configuration.publicHost ||
          cluster[0].configuration.remoteHost) +
      ':' +
      (cluster[0].configuration.publicPort ||
          cluster[0].configuration.remotePort);
  let head = '远程:';
  if (!!shareCluster) {
    !!configuration.publicHost && (head = '公网:');
  } else {
    !!cluster[0].configuration.publicHost && (head = '公网:');
  }
  if (!shareCluster && cluster.length > 1) {
    const contentItem2 =
        (cluster[0].configuration.publicHost ||
            cluster[0].configuration.remoteHost) +
        ':' +
        (cluster[0].configuration.publicPort ||
            cluster[0].configuration.remotePort);
    let headItme2 = '远程';
    !!cluster[0].configuration.publicHost && (headItme2 = '公网:');
    if (cluster.length > 2) {
      return (
          head +
          headers +
          content +
          ' ' +
          headItme2 +
          headers +
          contentItem2 +
          '。。。'
      );
    }
    return (
        head + headers + content + ' ' + headItme2 + headers + contentItem2
    );
  }
  return head + headers + content;
};

const getProtocol = async () => {
  let _protocol = cloneDeep(protocol.value)
  if(selectedProtocolID.value){
    const protocolData = await queryExistProtocol(accessConfig.value?.provider, protocol.value)
    if(protocolData){
      _protocol = protocolData
    } else {
      _protocol = {
        ...omit(protocol.value, 'id'),
        type: 'jar',
        configuration: {
          location: protocol.value.url,
          sourceId: protocol.value.id,
          version: protocol.value.version,
        },
      };
    }
  }
  return _protocol
}

const submitDada = async() => {
  let data;
  const accessName = props.providers?.get(accessConfig.value.provider)?.name;
  const gateway = {
    name:
        accessConfig.value.provider?.split('-')?.[0] +
        '网关' +
        props.randomString,
    ...omit(accessConfig.value, ['bindInfo', 'defaultAccess']),
    gatewayType: accessConfig.value.provider,
  };

  if (accessConfig.value.channel === 'plugin') {
    if (!plugin.value) {
      onlyMessage('请选择插件', 'error');
      return;
    }
    let _plugin = cloneDeep(plugin.value)
    if(selectedPluginID.value){
      _plugin = await handlePluginData(accessConfig.value, plugin.value)
    }
    data = {
      gateway,
      plugin: _plugin
    };
  } else if (accessConfig.value.channel === 'network') {
    if (!network.value) {
      onlyMessage('请选择网络组件', 'error');
      return;
    }
    // 只需要选择网络组件
    if (['agent-media-device-gateway', 'agent-device-gateway'].includes(accessConfig.value.provider)) {
      data = {
        gateway,
        network: network.value,
      };
    } else {
      if (!protocol.value) {
        onlyMessage('请选择协议', 'error');
        return;
      }
      const protocolData = await getProtocol()
      data = {
        network: network.value,
        gateway,
        protocol: protocolData
      };
    }
  } else if (['OneNet', 'Ctwing','child-device'].includes(accessConfig.value.channel)) {
    if (!protocol.value) {
      onlyMessage('请选择协议', 'error');
      return;
    }
    const protocolData = await getProtocol()
    data = {
      protocol: protocolData,
      gateway,
    };
  } else {
    // 'fixed-media', 'onvif', 'collector-gateway',
    data = {
      gateway,
    };
  }

  emits('submit', data, accessName);
};

</script>
<style lang="less" scoped>
.container {
  border: 1px solid #bebfbf;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9fafc;

  .accessInfo {
    display: flex;
  }

  .accessCard {
    cursor: pointer;
  }

  .cardName {
    font-size: 16px;
    font-weight: 600;
  }

  .cardDes {
    margin-top: 20px;
  }

  .card {
    display: flex;
    border: 1px solid #949494;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
  }

  .protocolCard {
    cursor: pointer;
  }

  .selected {
    border-color: #2f54eb;
  }

  .operation {
    margin-top: 16px;
    text-align: right;
  }

  .noNetWork {
    border: 1px dashed #949494;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    font-size: 18px;
    color: #7f7f7f;
    margin-bottom: 12px;
  }
}

.tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
</style>
