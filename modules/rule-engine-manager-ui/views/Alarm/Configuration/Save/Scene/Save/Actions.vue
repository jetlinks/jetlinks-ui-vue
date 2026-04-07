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
            <AIcon
              :type="
                iconMap.get(
                  item.executor === 'alarm' ? item.alarm.mode : item.executor
                )
              "
            />
          </div>
          <div class="item-options-content">
            <template v-if="item.executor === 'alarm'">
              <span>
                {{ $t('Save.Actions.0214511-0') }}{{
                  item.alarm.mode === "trigger" ? $t('Save.Actions.0214511-1') : $t('Save.Actions.0214511-2')
                }}{{ $t('Save.Actions.0214511-3') }}
              </span>

              <j-permission-button
                v-if="!showUnbindBtn"
                type="link"
                hasPermission="rule-engine/Alarm/Configuration:update"
                @click.stop="onBind(item)"
                :disabled="
                  activeKeys.some((active) => active === item.actionId)
                "
              >
                <template #icon>
                  <AIcon type="icon-bangding" />
                </template>
                {{
                  selectedKeys.some((selectKey) => selectKey === item.actionId)
                    ? $t('Save.Actions.0214511-4')
                    : $t('Save.Actions.0214511-5')
                }}
              </j-permission-button>
              <j-permission-button
                v-else-if="
                  activeKeys.some(
                    (active) => active === item.actionId || active === -1
                  )
                "
                type="link"
                hasPermission="rule-engine/Alarm/Configuration:update"
                @click.stop="onSelect(item)"
              >
                <template #icon>
                  <AIcon type="icon-jiebang" />
                </template>
                {{ $t('Save.Actions.0214511-6') }}
              </j-permission-button>
            </template>
            <template v-if="item.executor === 'notify' && show">
              <template v-if="item.notify?.notifyType === 'dingTalk'">
                <div v-if="item.options.provider === 'dingTalkRobotWebHook'">
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">{{ $t('Save.Actions.0214511-8') }}</span>
                  {{ $t('Save.Actions.0214511-9') }}
                  <span class="notify-text-highlight">
                    {{ item.notify?.templateId }}
                  </span>
                </div>
                <div v-else>
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    {{ $t('Save.Actions.0214511-10') }}
                  </span>
                  {{
                    item.options?.sendTo || item.options?.orgName ? $t('Save.Actions.0214511-11') : ""
                  }}
                  <span class="notify-text-highlight">{{
                    item.options?.sendTo || ""
                  }}</span>
                  <span class="notify-text-highlight">{{
                    item.options?.orgName || ""
                  }}</span>
                  {{ $t('Save.Actions.0214511-9') }}
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item?.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'weixin'">
                <div>
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    {{ $t('Save.Actions.0214511-12') }}
                  </span>
                  {{
                    item.options.sendTo ||
                    item.options.orgName ||
                    item.options.tagName
                      ? $t('Save.Actions.0214511-11')
                      : ""
                  }}
                  <span class="notify-text-highlight">{{
                    item.options.sendTo || ""
                  }}</span>
                  <span class="notify-text-highlight">{{
                    item.options?.orgName || ""
                  }}</span>
                  <span class="notify-text-highlight">{{
                    item.options?.tagName || ""
                  }}</span>
                  {{ $t('Save.Actions.0214511-9') }}
                  <span class="notify-text-highlight">{{
                    item.options?.templateName || item?.notify?.templateId
                  }}</span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'email'">
                <div style="display: flex">
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    {{ $t('Save.Actions.0214511-13') }}
                  </span>
                  {{ item.options?.sendTo ? $t('Save.Actions.0214511-11') : "" }}
                  <span class="notify-text-highlight">
                    <j-ellipsis style="max-width: 400px">
                      {{ item.options?.sendTo || "" }}
                    </j-ellipsis>
                  </span>
                  {{ $t('Save.Actions.0214511-9') }}
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'voice'">
                <div>
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    {{ $t('Save.Actions.0214511-14') }}
                  </span>
                  {{ item.options?.sendTo ? $t('Save.Actions.0214511-11') : "" }}
                  <span class="notify-text-highlight">{{
                    item.options?.sendTo || ""
                  }}</span>
                  {{ $t('Save.Actions.0214511-9') }}
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'sms'">
                <div>
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    {{ $t('Save.Actions.0214511-15') }}
                  </span>
                  {{ item.options?.sendTo ? $t('Save.Actions.0214511-11') : "" }}
                  <span class="notify-text-highlight">{{
                    item.options?.sendTo || ""
                  }}</span>
                  {{ $t('Save.Actions.0214511-9') }}
                  <span class="notify-text-highlight">
                    {{ item.options?.templateName || item.notify?.templateId }}
                  </span>
                </div>
              </template>
              <template v-else-if="item.notify?.notifyType === 'webhook'">
                <div>
                  {{ $t('Save.Actions.0214511-7') }}
                  <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(item.notify?.notifyType)"
                    />
                    WebHook
                  </span>
                  {{ $t('Save.Actions.0214511-9') }}
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
              <div
                v-if="['fixed', 'context'].includes(item.device?.selector)"
                style="display: flex; align-items: center"
              >
                <AIcon
                  :type="
                    typeIconMap[
                      item.device?.message?.messageType || 'INVOKE_FUNCTION'
                    ]
                  "
                />
                <span style="padding-left: 4px">{{ item.options?.type }}</span>
                <AIcon type="icon-mubiao" style="padding: 0 4px" />
                <j-ellipsis style="max-width: 120px; margin-right: 12px">
                  {{ Array.isArray(item?.options?.name) ? item?.options?.name?.join(',') : item.options?.name }}
                </j-ellipsis>
                <j-ellipsis style="max-width: 120px">
                  {{ item.options?.propertiesName }}
                </j-ellipsis>
                <span
                  v-if="
                    !isBoolean(item.options?.propertiesValue) &&
                    item.options?.propertiesValue
                  "
                  >{{ $t('Save.Actions.0214511-16') }}
                </span>
                <j-ellipsis style="max-width: 120px">
                  {{
                    `${
                      (
                        isBoolean(item.options?.propertiesValue)
                          ? true
                          : item.options?.propertiesValue
                      )
                        ? `${item.options?.propertiesValue}`
                        : ""
                    }`
                  }}
                </j-ellipsis>
              </div>
              <div v-else-if="item.device?.selector === 'tag'" style="display: flex">
                <j-ellipsis>
                  <AIcon
                  :type="
                    typeIconMap[
                      item.device?.message?.messageType || 'INVOKE_FUNCTION'
                    ]
                  "
                />
                {{ item.options?.type }}
                <span>{{ item.options?.tagName }}</span>
                {{ $t('Save.Actions.0214511-17') }}{{ item.options?.productName }}
                {{ item.options?.propertiesName }}
                </j-ellipsis>
              </div>
              <div v-else-if="item.device?.selector === 'relation'">
                <j-ellipsis>
                    <AIcon
                    :type="
                      typeIconMap[
                        item.device?.message?.messageType || 'INVOKE_FUNCTION'
                      ]
                    "
                  />
                  {{ item.options?.type }}
                  {{ $t('Save.Actions.0214511-18') }}
                  <span>{{ item.options?.triggerName }}</span>
                  {{ $t('Save.Actions.0214511-19') }} {{ item.options?.relationName }} {{ $t('Save.Actions.0214511-17') }}{{
                    item.options?.productName
                  }}
                  {{ $t('Save.Actions.0214511-20') }} {{ item.options?.propertiesName }}
                </j-ellipsis>
              </div>
            </template>
            <template v-if="item.executor === 'device-data' && show">
              <div
                v-if="['fixed', 'context'].includes(item.configuration?.selector?.selector)"
                class="device-data-info"
              >
                <AIcon type="icon-mubiao" style="padding: 0 4px" />
                <span>{{$t('Save.Actions.0214511-22')}}</span>
                <j-ellipsis style="max-width: 120px; margin-right: 12px">
                  {{ Array.isArray(item?.options?.name) ? item?.options?.name?.join(',') : item.options?.name }}
                </j-ellipsis>
                <j-ellipsis style="max-width: 120px">
                  {{ item.options?.propertiesName }}
                </j-ellipsis>
                <span
                  v-if="
                    !isBoolean(item.options?.propertiesValue) &&
                    item.options?.propertiesValue
                  "
                >{{ $t('Save.Actions.0214511-16') }}
                </span>
                <j-ellipsis style="max-width: 120px">
                  {{
                    `${
                      (
                        isBoolean(item.options?.propertiesValue)
                          ? true
                          : item.options?.propertiesValue
                      )
                        ? `${item.options?.propertiesValue}`
                        : ""
                    }`
                  }}
                </j-ellipsis>
                <span>{{$t('Save.Actions.0214511-23')}}</span>
              </div>
              <div v-else-if="item.configuration?.selector.selector === 'tag'" class="device-data-info">
                <j-ellipsis>
                  <AIcon
                    :type="
                      typeIconMap[
                        item.configuration?.message?.messageType || 'INVOKE_FUNCTION'
                      ]
                    "
                  />
                  {{ item.options?.type }}
                  <span>{{ item.options?.tagName }}</span>
                  {{ $t('Save.Actions.0214511-17') }}{{ item.options?.productName }}
                  {{ item.options?.propertiesName }}
                  <span>{{$t('Save.Actions.0214511-23')}}</span>
                </j-ellipsis>
              </div>
              <div v-else-if="item.configuration?.selector?.selector === 'relation'" class="device-data-info">
                <j-ellipsis>
                  <AIcon
                    :type="
                      typeIconMap[
                        item.configuration?.message?.messageType || 'INVOKE_FUNCTION'
                      ]
                    "
                  />
                  {{ item.options?.type }}
                  {{ $t('Save.Actions.0214511-18') }}
                  <span>{{ item.options?.triggerName }}</span>
                  {{ $t('Save.Actions.0214511-19') }} {{ item.options?.relationName }} {{ $t('Save.Actions.0214511-17') }}{{
                    item.options?.productName
                  }}
                  {{ $t('Save.Actions.0214511-20') }} {{ item.options?.propertiesName }}
                  <span>{{$t('Save.Actions.0214511-23')}}</span>
                </j-ellipsis>
              </div>
            </template>
            <template v-if="item.executor === 'collector' && show">
              <div>
                <j-ellipsis>
                  <AIcon
                    type="icon-zhihangdongzuoxie"
                  />
                  <span style="padding-left: 4px">{{item?.options?.type}}</span>
                  <span>
                      <AIcon type="icon-mubiao" style="padding: 0 4px" />
                      <span>{{item?.options?.triggerName}}</span>
                    </span>
                  <span>{{item?.options?.pointName}}</span>
                  <template v-if="item.collector?.handlerType === 'write'">
                    <span>{{$t('Save.Actions.0214511-16')}}</span>
                    <span>{{item?.options?.propertiesName}}</span>
                  </template>
                </j-ellipsis>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="serial && item.options?.terms?.length && show"
        class="actions-item-filter-warp"
      >
        <div class="actions-item-filter-warp-tip">{{ $t('Save.Actions.0214511-21') }}</div>
        <div class="actions-item-filter-overflow">
          <Terms :when="item.options" :border="false" :data="item.terms" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Actions">
import {
  iconMap,
  itemNotifyIconMap,
  typeIconMap,
} from "../../../../../Scene/Save/action/ListItem/util";
import { isBoolean } from "lodash-es";
import Terms from "./Terms/Terms.vue";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  actions: {
    type: Array,
    default: () => [],
  },
  activeKeys: {
    // 后端返回已关联的执行动作
    type: Array,
    default: () => [],
  },
  selectedKeys: {
    // 当前modal中选中的执行动作
    type: Array,
    default: () => [],
  },
  show: {
    type: Boolean,
    default: false,
  },
  serial: {
    type: Boolean,
    default: false,
  },
  showUnbindBtn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["change", "select"]);

const onBind = (record) => {
  const selected = props.selectedKeys.some((item) => item === record.actionId);
  emit("change", record.actionId, !selected);
};

const onSelect = (record) => {
  const id = props.activeKeys.find(
    (active) => active === record.actionId || active === -1
  );
  emit("select", id, false);
};
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
      flex: 1;
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
      .device-data-info {
        display: flex;
        align-items: center;
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
