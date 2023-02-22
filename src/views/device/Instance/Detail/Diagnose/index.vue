<template>
    <a-card>
        <div class="diagnose">
            <div class="diagnose-header" :style="{background: headerColorMap.get(topState)}">
                <div class="diagnose-top">
                    <div class="diagnose-img">
                        <div v-if="topState === 'loading'" style="width: 100%; height: 100%; position: relative">
                            <img :src="headerImgMap.get(topState)" style="height: 100%; position: absolute; z-index: 2" />
                            <img :src="getImage('/diagnose/loading-1.png')" style="height: 100%" />
                        </div>
                        <img v-else :src="headerImgMap.get(topState)" style="height: 100%" />
                    </div>
                    <div class="diagnose-text">
                        <div class="diagnose-title">{{headerTitleMap.get(topState)}}</div>
                        <div class="diagnose-desc">
                            <template v-if="topState !== 'loading'">{{headerDescMap.get(topState)}}</template>
                            <template v-else>已诊断{{count}}个</template>
                        </div>
                    </div>
                </div>
                <div class="diagnose-progress">
                    <a-progress
                        :percent="percent"
                        :showInfo="false"
                        size="small"
                        :strokeColor="progressMap.get(topState)"
                        style="width: 100%"
                    />
                </div>
                <div class="diagnose-radio">
                    <div class="diagnose-radio-item" :class="item.key === 'message' && topState !== 'success' ? 'disabled' : ''" v-for="item in tabList" :key="item.key" :style="activeKey === item.key ? {...activeStyle} : {}" @click="onTabChange(item.key)">
                        {{item.text}}
                    </div>
                </div>
            </div>
            <div>
                <Message v-show="activeKey === 'message'" />
                <Status v-show="activeKey !== 'message'" :providerType="providerType" @countChange="countChange" @percentChange="percentChange" @stateChange="stateChange" />
            </div>
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { headerImgMap, headerColorMap, headerTitleMap, headerDescMap, progressMap } from './util'
import { getImage } from '@/utils/comm';
import Status from './Status/index'
import Message from './Message/index.vue'
import { useInstanceStore } from '@/store/instance';

type TypeProps = 'network' | 'child-device' | 'media' | 'cloud' | 'channel'

const instanceStore = useInstanceStore()

const tabList = [
  { key: 'status', text: '连接状态' },
  { key: 'message', text: '消息通信' },
];

const activeStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.09)',
    borderRadius: '2px 2px 0px 0px',
    color: '#000000BF',
};

const topState = ref<'loading' | 'success' | 'error'>('loading')
const count = ref<number>(0)
const percent = ref<number>(0)
const activeKey = ref<'status' | 'message'>('status')
const providerType = ref()

provide('topState', topState) 

const onTabChange = (key: 'status' | 'message') => {
    if(topState.value === 'success'){
        activeKey.value = key
    }
}

const percentChange = (num: number) => {
    if(num === 0){
        percent.value = 0
    } else if( percent.value < 100 && !num) {
        percent.value += 20
    } else {
        percent.value = num
    }
}

const stateChange = (_type: 'loading' | 'success' | 'error') => {
    topState.value = _type
}

const countChange = (num: number) => {
    count.value = num
}

onMounted(() => {
    const provider = instanceStore.current?.accessProvider;
    if (provider === 'fixed-media' || provider === 'gb28181-2016') {
      providerType.value = 'media'
    } else if (provider === 'OneNet' || provider === 'Ctwing') {
      providerType.value = 'cloud'
    } else if (provider === 'modbus-tcp' || provider === 'opc-ua') {
      providerType.value = 'channel'
    } else if (provider === 'child-device') {
      providerType.value = 'child-device'
    } else {
      providerType.value = 'network'
    }
    topState.value = 'loading';
})
</script>

<style lang="less" scoped>
.diagnose {
  .diagnose-header {
    position: relative;
    width: 100%;
    height: 150px;
    margin-bottom: 20px;
    padding: 15px 25px;

    .diagnose-top {
      display: flex;
      width: 100%;

      .diagnose-img {
        width: 65px;
        height: 65px;
        margin-right: 20px;
      }

      .diagnose-text {
        .diagnose-title {
          color: #000c;
          font-weight: 700;
          font-size: 25px;
        }

        .diagnose-desc {
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
        }
      }
    }

    .diagnose-progress {
      width: 100%;
    }

    .diagnose-radio {
      position: absolute;
      bottom: 0;
      display: flex;

      .diagnose-radio-item {
        width: 150px;
        height: 35px;
        margin-right: 8px;
        color: #00000073;
        line-height: 35px;
        text-align: center;
        background: #f2f2f2;
        border-radius: 2px 2px 0 0;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
        }
      }
    }
  }
}

.diagnose-loading {
  animation: diagnose-loading 2s linear infinite;
}

@keyframes diagnose-loading {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

</style>