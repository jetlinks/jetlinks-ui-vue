<template>
  <div class="actions-warp">
    <div v-for="item in actions">
      <div class="actions-item" v-if="item.executor === 'alarm' || show">
        <div class="item-options-warp">
          <div class="item-options-type">
<!--            <img-->
<!--              style="width: 18px"-->
<!--              :src="iconMap.get(item.executor === 'alarm' ? item.alarm.mode : item.executor)"-->
<!--            />-->
            <AIcon :type="iconMap.get(item.executor === 'alarm' ? item.alarm.mode : item.executor)"/>
          </div>
          <div class="item-options-content">
            <template v-if="item.executor === 'alarm'">
              <span>
                满足条件后将{{ item.alarm.mode === 'trigger' ? '触发' : '解除' }}当前告警
              </span>

              <a-button v-if="!showUnbindBtn" type="link" @click.stop="onBind(item)" :disabled="activeKeys.some(active => active === item.actionId)">
                <template #icon>
                  <AIcon type="icon-bangding"/>
                </template>
                {{ selectedKeys.some(selectKey => selectKey === item.actionId) ? '已关联' : '关联' }}
              </a-button>
              <a-button v-else-if="activeKeys.some(active => active === item.actionId)" type="link" @click.stop="onSelect(item)">
                <template #icon>
                  <AIcon type="icon-jiebang"/>
                </template>
                取消关联
              </a-button>
            </template>
            <template v-if="item.executor === 'notify' && show">
              <template v-if="item.notify?.notifyType === 'dingTalk'">
                <div v-if="item.options.provider === 'dingTalkRobotWebHook'">
                  通过
                  <span class="notify-text-highlight">群机器人消息</span>
                  发送
                  <span class="notify-text-highlight">
                    {{ item.notify?.templateId }}
                  </span>
                </div>
                <div v-else>
                  通过
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    >
                    钉钉
                  </span>
                  {{ (item.options?.sendTo || item.options?.orgName) ? '向' : "" }}
                  <span class="notify-text-highlight">{{ item.options?.sendTo || '' }}</span>
                  <span class="notify-text-highlight">{{ item.options?.orgName || '' }}</span>
                  发送
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item?.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'weixin'">
                <div>
                  通过
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    微信
                  </span>
                  {{ (item.options.sendTo || item.options.orgName || item.options.tagName) ? '向' : '' }}
                  <span class="notify-text-highlight">{{ item.options.sendTo || '' }}</span>
                  <span class="notify-text-highlight">{{ item.options?.orgName || '' }}</span>
                  <span class="notify-text-highlight">{{ item.options?.tagName || '' }}</span>
                  发送
                  <span class="notify-text-highlight">{{ item.options?.templateName || item?.notify?.templateId }}</span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'email'">
                <div style="display: flex;">
                  通过
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    邮件
                  </span>
                  {{ item.options?.sendTo ? '向' : '' }}
                  <span class="notify-text-highlight">
                    <Ellipsis style='max-width: 400px;'>
                      {{ item.options?.sendTo || '' }}
                    </Ellipsis>
                  </span>
                  发送
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'voice'">
                <div>
                  通过
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    语音
                  </span>
                  {{ item.options?.sendTo ? '向' : '' }}
                  <span class="notify-text-highlight">{{ item.options?.sendTo || '' }}</span>
                  发送
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'sms'">
                <div>
                  通过
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    短信
                  </span>
                  {{ item.options?.sendTo ? '向' : '' }}
                  <span class="notify-text-highlight">{{ item.options?.sendTo || '' }}</span>
                  发送
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'webhooks'">
                <div>
                  通过
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    WebHook
                  </span>
                  发送
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
            </template>
            <template v-if="item.executor === 'delay' && show">
              {{ item.options?.name }}
            </template>
            <template v-if="item.executor === 'device' && show">
              <div v-if="['fixed', 'context'].includes(item.device?.selector)"
                   style='display: flex; align-items: center;'>
                <AIcon :type="typeIconMap[item.device?.message?.messageType ||'INVOKE_FUNCTION']"/>
                <span style="padding-left: 4px">{{ item.options?.type }}</span>
                <AIcon type="icon-mubiao" style="padding:0 4px"/>
                <Ellipsis style='max-width: 120px;margin-right: 12px;'>
                  {{ item.options?.name }}
                </Ellipsis>
                <Ellipsis style='max-width: 120px;'>
                  {{ item.options?.propertiesName }}
                </Ellipsis>
                <span v-if='!isBoolean(item.options?.propertiesValue) && item.options?.propertiesValue'>为 </span>
                <Ellipsis style='max-width: 120px;'>
                  {{
                    `${
                      (
                        isBoolean(
                          item.options?.propertiesValue
                        )
                          ? true
                          : item.options?.propertiesValue
                      )
                        ? `${item.options?.propertiesValue}`
                        : ''
                    }`
                  }}
                </Ellipsis>
              </div>
              <div v-else-if="item.device?.selector === 'tag'">
                <AIcon :type="typeIconMap[item.device?.message?.messageType ||'INVOKE_FUNCTION']"/>
                {{ item.options?.type }}
                <span>{{ item.options?.tagName }}</span>
                的{{ item.options?.productName }}
                {{ item.options?.propertiesName }}
              </div>
              <div v-else-if="item.device?.selector === 'relation'">
                <AIcon :type="typeIconMap[item.device?.message?.messageType ||'INVOKE_FUNCTION']"/>
                {{ item.options?.type }}
                与
                <span>{{ item.options?.triggerName }}</span>
                具有相同 {{ item.options?.relationName }}
                的{{ item.options?.productName }}
                设备的 {{ item.options?.propertiesName }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="serial && item.options?.terms?.length && show" class="actions-item-filter-warp">
        <div class="actions-item-filter-warp-tip">
          满足此条件后执行后续动作
        </div>
        <div class="actions-item-filter-overflow">
          <Terms :when="item.options" :border="false" :data="item.terms"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Actions">
import {iconMap, itemNotifyIconMap, typeIconMap} from '@/views/rule-engine/Scene/Save/action/ListItem/util'
import {isBoolean} from 'lodash-es'
import Terms from './Terms/Terms.vue'

const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  },
  activeKeys: { // 后端返回已关联的执行动作
    type: Array,
    default: () => ([])
  },
  selectedKeys: { // 当前modal中选中的执行动作
    type: Array,
    default: () => ([])
  },
  show: {
    type: Boolean,
    default: false
  },
  serial: {
    type: Boolean,
    default: false
  },
  showUnbindBtn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'select'])

const onBind = (record) => {
  const selected = props.selectedKeys.some(item => item === record.actionId)
  emit('change', record.actionId, !selected)
}

const onSelect = (record) => {
  const selected = props.activeKeys.some(item => item === record.actionId)
  emit('select', record.actionId, !selected)
}


</script>

<style scoped lang="less">
.actions-item {
  position: relative;
  padding: 8px;
  border: 1px dashed #999;
  border-radius: 2px;
  margin-bottom: 8px;

  .item-options-warp {
    display: inline-flex;
    height: 48px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;

    .item-options-type {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      background-color: #f0f0f0;
      border-radius: 6px 0 0 6px;
      cursor: pointer;
      font-size: 22px;
    }

    .item-options-content {
      display: flex;
      align-items: center;
      padding: 0 8px;
      background: #fafafa;
      border-radius: 0 6px 6px 0;
      cursor: pointer;

      div {
        padding: 6px 10px;
        color: #333;
        font-size: 14px;
        line-height: 22px;
        background-color: #fff;
        border-radius: 22px;

        .notify-text-highlight {
          margin-left: 5px;
          font-weight: bold;
        }

        .notify-img-highlight {
          margin: 0 10px;
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }

  .item-number {
    position: absolute;
    top: 0;
    left: 16px;
    font-weight: 800;
    transform: translateY(-50%);
  }
}

.actions-item-filter-warp {
  position: relative;
  margin-bottom: 12px;
  margin-top: 16px;
  padding: 2px 0;
  border: 1px dashed #999;
  border-radius: 2px;

  &.filter-border {
    padding: 2px 16px;
    border-radius: 2px;
  }

  .actions-item-filter-warp-tip {
    position: absolute;
    top: 0;
    left: 16px;
    z-index: 2;
    color: rgba(0, 0, 0, 0.55);
    font-weight: 800;
    font-size: 14px;
    line-height: 1;
    background-color: #fff;
    transform: translateY(-50%);
  }

  .actions-item-filter-overflow {
    display: flex;
    padding-top: 4px;
    overflow-x: auto;
    overflow-y: visible;
    row-gap: 16px;
  }

  .filter-add-button {
    width: 100%;
    color: rgba(0, 0, 0, 0.3);
    text-align: center;
    cursor: pointer;
  }

  .terms-params {
    // display: inline-block;
    display: flex;
    flex-shrink: 0;

    // &:not(:first-child) {
    //   margin-bottom: 16px;
    // }

    .terms-params-warp {
      display: flex;
      align-items: baseline;
    }

    .term-type-warp {
      // display: inline-block;
      width: 50px;
      margin: 0 16px;

      .term-type {
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: 2px;
      }
    }
  }
}
</style>
