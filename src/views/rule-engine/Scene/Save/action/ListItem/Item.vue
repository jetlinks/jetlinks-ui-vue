<template>
    <div class="actions-item-warp">
      <j-form-item
        :name='["branches", branchesName, "then", thenName, "actions", name]'
        :rules='rules'
      >
        <div class="actions-item">
            <CheckItem v-bind='props' ref='checkItemRef'>
              <div class="item-options-warp">
                  <div class="item-options-type" @click="onAdd">
<!--                      <img-->
<!--                          style="width: 18px"-->
<!--                          :src="-->
<!--                              iconMap.get(-->
<!--                                  data?.executor === 'alarm'-->
<!--                                      ? data?.alarm?.mode-->
<!--                                      : data?.executor,-->
<!--                              )-->
<!--                          "-->
<!--                      />-->
                    <AIcon :type="iconMap.get(data?.executor === 'alarm' ? data.alarm.mode : data.executor)"/>
                  </div>
                  <div
                      class="item-options-content"
                      v-if="data?.executor === 'alarm'"
                  >
                      <template v-if="data?.alarm?.mode === 'trigger'">
                          满足条件后将触发<j-button
                              style="padding: 0"
                              type="link"
                              @click.stop="triggerVisible = true"
                              >关联告警</j-button
                          >
                      </template>
                      <template v-else>
                          满足条件后将解除<j-button
                              style="padding: 0"
                              type="link"
                              @click.stop="triggerVisible = true"
                              >关联告警</j-button
                          >
                      </template>
                  </div>
                  <div
                      class="item-options-content"
                      v-else-if="data?.executor === 'notify'"
                      @click="onType('notify')"
                  >
                      <template v-if="data?.notify?.notifyType === 'dingTalk'">
                          <template
                              v-if="options?.provider === 'dingTalkRobotWebHook'"
                          >
                              <div>
                                  通过<span class="notify-text-highlight"
                                      >群机器人消息</span
                                  >
                                  发送
                                  <span class="notify-text-highlight">
                                      {{
                                          options?.templateName ||
                                          data?.notify?.templateId
                                      }}
                                  </span>
                              </div>
                          </template>
                          <template v-else>
                              <div>
                                  通过
                                  <span class="notify-text-highlight">
                                      <img
                                          style="width: 18px"
                                          :src="
                                              itemNotifyIconMap.get(
                                                  data?.notify?.notifyType,
                                              )
                                          "
                                      />
                                      钉钉
                                  </span>
                                  {{(options?.sendTo || options?.orgName) ? '向' : ""}}<span class="notify-text-highlight">{{
                                      options?.sendTo || ''
                                  }}</span>
                                  <span class="notify-text-highlight">{{
                                      options?.orgName || ''
                                  }}</span>
                                  发送
                                  <span class="notify-text-highlight">
                                      {{
                                          options?.templateName ||
                                          data?.notify?.templateId
                                      }}
                                  </span>
                              </div>
                          </template>
                      </template>
                      <template v-else-if="data?.notify?.notifyType === 'weixin'">
                          <div>
                              通过
                              <span class="notify-text-highlight">
                                  <img
                                      style="width: 18px"
                                      :src="
                                          itemNotifyIconMap.get(
                                              data?.notify?.notifyType,
                                          )
                                      "
                                  />
                                  微信
                              </span>
                              {{(options?.sendTo || options?.orgName || options?.tagName) ? '向' : ''}}<span class="notify-text-highlight">{{
                                  options?.sendTo || ''
                              }}</span>
                              <span class="notify-text-highlight">{{
                                  options?.orgName || ''
                              }}</span>
                              <span class="notify-text-highlight">{{
                                  options?.tagName || ''
                              }}</span>
                              发送
                              <span class="notify-text-highlight">
                                  {{
                                      options?.templateName ||
                                      data?.notify?.templateId
                                  }}
                              </span>
                          </div>
                      </template>
                      <template v-else-if="data?.notify?.notifyType === 'email'">
                          <div style="display: flex;">
                              通过
                              <span class="notify-text-highlight">
                                  <img
                                      style="width: 18px"
                                      :src="
                                          itemNotifyIconMap.get(
                                              data?.notify?.notifyType,
                                          )
                                      "
                                  />
                                  邮件
                              </span>
                              {{options?.sendTo ? '向' : ''}}<span class="notify-text-highlight">
                                <Ellipsis style='max-width: 400px;'>
                                {{
                                    options?.sendTo || ''
                                  }}
                                </Ellipsis>
                            </span>
                              发送
                              <span class="notify-text-highlight">
                                  {{
                                      options?.templateName ||
                                      data?.notify?.templateId
                                  }}
                              </span>
                          </div>
                      </template>
                      <template v-else-if="data?.notify?.notifyType === 'voice'">
                          <div>
                              通过
                              <span class="notify-text-highlight">
                                  <img
                                      style="width: 18px"
                                      :src="
                                          itemNotifyIconMap.get(
                                              data?.notify?.notifyType,
                                          )
                                      "
                                  />
                                  语音
                              </span>
                              {{ options?.sendTo ? '向' : ''}}<span class="notify-text-highlight">{{
                                  options?.sendTo || ''
                              }}</span>
                              发送
                              <span class="notify-text-highlight">
                                  {{
                                      options?.templateName ||
                                      data?.notify?.templateId
                                  }}
                              </span>
                          </div>
                      </template>
                      <template v-else-if="data?.notify?.notifyType === 'sms'">
                          <div>
                              通过
                              <span class="notify-text-highlight">
                                  <img
                                      style="width: 18px"
                                      :src="
                                          itemNotifyIconMap.get(
                                              data?.notify?.notifyType,
                                          )
                                      "
                                  />
                                  短信
                              </span>
                              {{options?.sendTo ? '向' : ''}}<span class="notify-text-highlight">{{
                                  options?.sendTo || ''
                              }}</span>
                              发送
                              <span class="notify-text-highlight">
                                  {{
                                      options?.templateName ||
                                      data?.notify?.templateId
                                  }}
                              </span>
                          </div>
                      </template>
                      <template
                          v-else-if="data?.notify?.notifyType === 'webhook'"
                      >
                          <div>
                              通过
                              <span class="notify-text-highlight">
                                  <img
                                      style="width: 18px"
                                      :src="
                                          itemNotifyIconMap.get(
                                              data?.notify?.notifyType,
                                          )
                                      "
                                  />
                                  WebHook
                              </span>
                              发送
                              <span>{{
                                  options?.templateName ||
                                  data?.notify?.templateId
                              }}</span>
                          </div>
                      </template>
                  </div>
                  <div
                      class="item-options-content"
                      v-else-if="data?.executor === 'delay'"
                      @click="onType('delay')"
                  >
                      {{ options?.name }}
                  </div>
                  <div
                      class="item-options-content"
                      v-else-if="data?.executor === 'device'"
                      @click="onType('device')"
                  >
                      <template v-if="['fixed', 'context'].includes(data?.device?.selector)">
                          <div style='display: flex; align-items: center;'>
                              <AIcon
                                  :type="
                                      typeIconMap[
                                          data?.device?.message?.messageType ||
                                              'INVOKE_FUNCTION'
                                      ]
                                  "
                              />
                              <span style="padding-left: 4px">{{
                                  data?.options?.type
                              }}</span>
                              <AIcon
                                  type="icon-mubiao"
                                  style="padding:0 4px"
                              />
                            <Ellipsis style='max-width: 200px;margin-right: 12px;'>
                              {{data?.options?.name}}
                            </Ellipsis>
                            <Ellipsis style='max-width: 400px;'>
                              {{data?.options?.propertiesName}}
                            </Ellipsis>
                            <span v-if='!isBoolean(data?.options?.propertiesValue) && data?.options?.propertiesValue'>为 </span>
                            <Ellipsis style='max-width: 200px;'>
                              {{
                                `${
                                    (
                                        isBoolean(
                                            data?.options?.propertiesValue,
                                        )
                                            ? true
                                            : data?.options?.propertiesValue
                                    )
                                        ? `${data?.options?.propertiesValue}`
                                        : ''
                                }`
                              }}
                            </Ellipsis>

                          </div>
                      </template>
                      <template v-else-if="data?.device?.selector === 'tag'">
                          <div>
                              <AIcon
                                  :type="
                                      typeIconMap[
                                          data?.device?.message?.messageType ||
                                              'INVOKE_FUNCTION'
                                      ]
                                  "
                              />
                              {{ data?.options?.type }}
                              <span>{{ data?.options?.tagName }}</span>
                              的{{ data?.options?.productName }}
                              {{ data?.options?.propertiesName }}
                          </div>
                      </template>
                      <template v-else-if="data?.device?.selector === 'relation'">
                          <div>
                              <AIcon
                                  :type="
                                      typeIconMap[
                                          data?.device?.message?.messageType ||
                                              'INVOKE_FUNCTION'
                                      ]
                                  "
                              />
                              {{ data?.options?.type }}与<span>{{
                                  data?.options?.triggerName
                              }}</span
                              >具有相同 {{ data?.options?.relationName }}的{{
                                  data?.options?.productName
                              }}设备的
                              {{ data?.options?.propertiesName }}
                          </div>
                      </template>
                  </div>
                  <j-button v-else @click="onAdd">点击配置执行动作</j-button>
              </div>
              <div class="item-number">{{ name + 1 }}</div>
              <j-popconfirm title="确认删除？" @confirm="onDelete" placement="topRight" :overlayStyle='{minWidth: "190px"}'>
                  <div class="item-delete">
                      <AIcon type="DeleteOutlined" />
                  </div>
              </j-popconfirm>
            </CheckItem>
        </div>
      </j-form-item>
        <template v-if="!isLast && type === 'serial'">
            <div
                :class="[
                    'actions-item-filter-warp',
                    termsOptions.length ? 'filter-border' : '',
                ]"
            >
                <template v-if="termsOptions.length">
                    <div class="actions-item-filter-warp-tip">
                        满足此条件后执行后续动作
                    </div>
                    <div class="actions-item-filter-overflow">
                        <FilterGroup
                            v-for="(item, index) in termsOptions"
                            :key="item.key"
                            :branchName="branchesName"
                            :thenName="thenName"
                            :actionName="name"
                            :name="index"
                            :isLast="index === termsOptions.length - 1"
                            :isFirst="index === 0"
                        />
                    </div>
                </template>
                <div v-else class="filter-add-button" @click='addFilterParams'>
                    <AIcon type="PlusOutlined" style="padding-right: 4px" />
                    <span>添加过滤条件</span>
                </div>
            </div>
        </template>

        <template v-if="visible">
            <Modal
                :name="name"
                :branchGroup="thenName"
                :branchesName="branchesName"
                :data="data"
                :options='_data.branches[branchesName].then[thenName].actions[name].options'
                @cancel="onClose"
                @save="onSave"
            />
        </template>
        <!-- 编辑 -->
        <template>
            <ActionTypeComponent
                v-bind="props"
                v-if="!!actionType"
                :actionType="actionType"
                :options='_data.branches[branchesName].then[thenName].actions[name].options'
                @save="onPropsOk"
                @cancel="onPropsCancel"
            />
        </template>
        <TriggerAlarm
            :id="_data.id"
            :branchId="_data.branches[branchesName].branchId"
            :actionId="_data.branches[branchesName].then[thenName].actions[name].actionId"
            :targetType="_data.triggerType"
            v-if="triggerVisible"
            @close="triggerVisible = false"
        />
    </div>
</template>

<script lang="ts" setup name="ActionItem">
import { isBoolean } from 'lodash-es';
import { PropType } from 'vue';
import { ActionsType, ParallelType } from '../../../typings';
import Modal from '../Modal/index.vue';
import ActionTypeComponent from '../Modal/ActionTypeComponent.vue';
import TriggerAlarm from '../TriggerAlarm/index.vue';
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import { iconMap, itemNotifyIconMap, typeIconMap } from './util';
import FilterGroup from './FilterGroup.vue';
import { randomString } from '@/utils/utils'
import { EventEmitter, EventEmitterKeys } from '@/views/rule-engine/Scene/Save/util'
import CheckItem from './CheckItem.vue'

const sceneStore = useSceneStore();
const { data: _data } = storeToRefs(sceneStore);

const props = defineProps({
    branchesName: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    name: {
        type: Number,
        default: 0,
    },
    data: {
        type: Object as PropType<ActionsType>,
    },
    type: {
        type: Object as PropType<ParallelType>,
    },
    parallel: {
        type: Boolean,
    },
    options: {
        type: Object,
    },
    isLast: {
        type: Boolean,
    },
});

const emit = defineEmits(['delete', 'update']);
const checkItemRef = ref()
const visible = ref<boolean>(false);
const triggerVisible = ref<boolean>(false);
const actionType = ref('');
const eventEmitterKey = ref(EventEmitterKeys({
  branch: props.branchesName,
  branchGroup: props.thenName,
  action: props.name
}))

const triggerData = reactive({
  visible: false,
  actionId: undefined
})

const termsOptions = computed(() => {
    if (!props.parallel) {
        // 串行
        return (
            _data.value.branches![props.branchesName].then?.[props.thenName]
                .actions?.[props.name].terms || []
        );
    }
    return [];
});

const onDelete = () => {
    const key = _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].key
    EventEmitter.emit(key!, { isDelete: true }) // 发布消息
    if (props.name !== 0 && !props.parallel) { // 清空上一个串行执行动作中的options.termsColumns和terms
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name - 1].options!.termsColumns = []
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name - 1].options!.terms = []
      _data.value.branches![props.branchesName].then[props.thenName].actions[props.name - 1].terms = []
    }

    emit('delete');
};

const onClose = () => {
    visible.value = false;
};

/**
 * 添加过滤条件
 */
const addFilterParams = () => {
  const item: any = {
    type: 'and',
    key: randomString(),
    terms: [
      {
        column: undefined,
        value: {
          type: 'fixed',
          value: undefined
        },
        termType: undefined,
        type: 'and',
        key: randomString()
      }
    ]
  }
  if (_data.value.branches![props.branchesName].then[props.thenName].actions[props.name].terms) {
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].terms!.push(item)
  } else {
    _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].terms = [item]
  }
  _data.value.branches![props.branchesName].then[props.thenName].actions[props.name].options!.terms = [{
    terms: [['','eq','','and']],
    termType: '并且'
  }]
}

const onAdd = () => {
    visible.value = true;
};

const onType = (_type: string) => {
    actionType.value = _type;
};

/**
 * 添加执行动作
 * @param data
 * @param options
 */
const onSave = (data: ActionsType, options: any) => {
  const { key, actionId, terms } = _data.value.branches![props.branchesName].then?.[props.thenName].actions?.[props.name]

  const columns = new Set([...(props.options?.termsColumns || []), ...(options?.otherColumns?.filter?.((item?: string) => item) || [])])

  const actionItem: ActionsType = {
    ...data,
    options: {...props.options, ...options, columns: [...columns.values()]},
    key,
    actionId,
    terms
  }

  _data.value.branches![props.branchesName].then[props.thenName].actions.splice(props.name, 1, actionItem)
  checkItemRef.value?.formTouchOff?.()
  visible.value = false;
  EventEmitter.emit(key!, data) // 发布消息
};

/**
 * 直接编辑执行栋数据
 * @param data
 * @param options
 */
const onPropsOk = (data: ActionsType, options?: any) => {
  onSave(data, options);
  actionType.value = '';
};

const onPropsCancel = () => {
    actionType.value = '';
};

const rules = [{
  validator(_: any, v?: ActionsType) {
    if (v?.executor === 'device') {
      const _device = v.device!
      if (
        (_device?.selector === 'fixed' && (!_device?.productId || !_device?.selectorValues?.length )) ||
        (_device?.selector === 'context' && !_device?.upperKey) ||
        (_device?.selector === 'relation' && !_device?.selectorValues?.length) ||
        _device?.changeData === true
      ) {
        return Promise.reject(new Error('该数据已发生变更，请重新配置'))
      }
    } else if (v?.executor === 'notify') {
      const _notify = v.notify
      if (
        !_notify?.notifierId ||
        !_notify?.templateId ||
        _notify?.changeData === true
      ) {
        return Promise.reject(new Error('该数据已发生变更，请重新配置'))
      }
    }
    return Promise.resolve()
  }
}]

</script>

<style lang="less" scoped>
.deleteBtn() {
    position: absolute;
    top: -10px;
    right: -10px;
    display: none;
    width: 20px;
    height: 20px;
    color: #999;
    line-height: 20px;
    text-align: center;
    background-color: #f1f1f1;
    border-radius: 50%;
    cursor: pointer;

    &.show {
        display: block;
    }

    &:hover {
        background-color: #f3f3f3;
    }
}

.actions-item {
    position: relative;
    //margin-bottom: 24px;
    padding: 16px;
    border: 1px dashed #999;
    border-radius: 2px;

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

    .item-delete {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        color: #e50012;
        background-color: rgba(229, 0, 18, 0.1);
        border-radius: 50%;
        transform: translate(50%, -50%);
        cursor: pointer;

        &:hover {
            background-color: rgba(#e50012, 0.2);
        }
    }
}

.actions-item-filter-warp {
    position: relative;
    margin-bottom: 24px;
    padding: 2px 0;
    border: 1px dashed #999;
    border-radius: 30px;

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
