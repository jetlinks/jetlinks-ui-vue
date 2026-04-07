<script setup name="Notify">
import { useI18n } from 'vue-i18n';
import {itemNotifyIconMap} from "@rule-engine-manager-ui/views/Scene/Save/action/ListItem/util";

defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const {t: $t} = useI18n();
</script>

<template>
  <div v-if="data?.notify?.notifyType === 'dingTalk'">
      <div v-if="options?.provider === 'dingTalkRobotWebHook'">
        {{ $t('ListItem.Item.637563-3') }}<span class="notify-text-highlight">{{ $t('ListItem.Item.637563-4') }}</span>
        {{ $t('ListItem.Item.637563-5') }}
        <span class="notify-text-highlight">
          {{ options?.templateName || data?.notify?.templateId }}
        </span>
      </div>
      <div v-else>
        {{ $t('ListItem.Item.637563-3') }}
        <span class="notify-text-highlight">
           <img style="width: 18px" :src="itemNotifyIconMap.get(data?.notify?.notifyType)"/>
           {{ $t('ListItem.Item.637563-6') }}
        </span>
        {{ options?.sendTo || options?.orgName ? $t('ListItem.Item.637563-7') : "" }}
        <span class="notify-text-highlight">{{
          options?.sendTo || ""
        }}</span>
        <span class="notify-text-highlight">{{
            options?.orgName || ""
          }}</span>
        {{ $t('ListItem.Item.637563-5') }}
        <span class="notify-text-highlight">
                      {{ options?.templateName || data?.notify?.templateId }}
                    </span>
      </div>
  </div>
    <div v-else-if="data?.notify?.notifyType === 'weixin'">
      {{ $t('ListItem.Item.637563-3') }}
      <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(data?.notify?.notifyType)"
                    />
                    {{ $t('ListItem.Item.637563-8') }}
                  </span>
      {{
        options?.sendTo || options?.orgName || options?.tagName
          ? $t('ListItem.Item.637563-7')
          : ""
      }}<span class="notify-text-highlight">{{
        options?.sendTo || ""
      }}</span>
      <span class="notify-text-highlight">{{
          options?.orgName || ""
        }}</span>
      <span class="notify-text-highlight">{{
          options?.tagName || ""
        }}</span>
      {{ $t('ListItem.Item.637563-5') }}
      <span class="notify-text-highlight">
                    {{ options?.templateName || data?.notify?.templateId }}
                  </span>
    </div>
    <div v-else-if="data?.notify?.notifyType === 'email'" style="display: flex">
      {{ $t('ListItem.Item.637563-3') }}
      <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(data?.notify?.notifyType)"
                    />
                    {{ $t('ListItem.Item.637563-9') }}
                  </span>
      {{ options?.sendTo ? $t('ListItem.Item.637563-7') : ""
      }}<span class="notify-text-highlight">
                    <j-ellipsis style="max-width: 400px">
                      {{ options?.sendTo || "" }}
                    </j-ellipsis>
                  </span>
      {{ $t('ListItem.Item.637563-5') }}
      <span class="notify-text-highlight">
                    {{ options?.templateName || data?.notify?.templateId }}
                  </span>
    </div>
    <div v-else-if="data?.notify?.notifyType === 'voice'">
      {{ $t('ListItem.Item.637563-3') }}
      <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(data?.notify?.notifyType)"
                    />
                    {{ $t('ListItem.Item.637563-10') }}
                  </span>
      {{ options?.sendTo ? $t('ListItem.Item.637563-7') : ""
      }}<span class="notify-text-highlight">{{
        options?.sendTo || ""
      }}</span>
      {{ $t('ListItem.Item.637563-5') }}
      <span class="notify-text-highlight">
                    {{ options?.templateName || data?.notify?.templateId }}
                  </span>
    </div>
    <div v-else-if="data?.notify?.notifyType === 'sms'">
      {{ $t('ListItem.Item.637563-3') }}
      <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(data?.notify?.notifyType)"
                    />
                    {{ $t('ListItem.Item.637563-11') }}
                  </span>
      {{ options?.sendTo ? $t('ListItem.Item.637563-7') : ""
      }}<span class="notify-text-highlight">{{
        options?.sendTo || ""
      }}</span>
      {{ $t('ListItem.Item.637563-5') }}
      <span class="notify-text-highlight">
                    {{ options?.templateName || data?.notify?.templateId }}
                  </span>
    </div>
    <div v-else-if="data?.notify?.notifyType === 'webhook'">
      {{ $t('ListItem.Item.637563-3') }}
      <span class="notify-text-highlight">
                    <img
                      style="width: 18px"
                      :src="itemNotifyIconMap.get(data?.notify?.notifyType)"
                    />
                    WebHook
                  </span>
      {{ $t('ListItem.Item.637563-5') }}
      <span>{{
          options?.templateName || data?.notify?.templateId
        }}</span>
    </div>
</template>

<style scoped lang="less">

</style>
