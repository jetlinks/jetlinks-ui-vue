<template>
  <j-page-container>
    <FullPage :fixed="false">
      <div class="scene-warp">
        <div class="header" v-if="data.name">
          <j-ellipsis :tooltip="{ title: data.name}" style="max-width: 50%">
            <span class="title">{{ data.name }}</span>
          </j-ellipsis>
          <div class="type">
            <img :src="TriggerHeaderIcon[data.triggerType]" />
            {{ data.trigger.typeName }}
          </div>
          <div style="flex: 1 1 0; min-width: 0; margin-left: 8px">
            <Description v-model:value="data.description" />
          </div>
        </div>
        <a-form ref="sceneForm" :model="data" :colon="false" layout="vertical">
          <Device ref="deviceRef" v-if="data.triggerType === 'device'" />
          <Manual v-else-if="data.triggerType === 'manual'" />
          <Timer v-else-if="data.triggerType === 'timer'" />
          <Collector v-else-if="data.triggerType === 'collector'"/>
          <slot name="triggerRender" :record="data"></slot>
        </a-form>
        <j-permission-button
          type="primary"
          hasPermission="rule-engine/Scene:update"
          :loading="loading"
          @click="save()"
        >
          {{ $t('Save.index.766438-0') }}
        </j-permission-button>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts" name="Scene">
import { storeToRefs } from "pinia";
import { useSceneStore } from "../../../store/scene";
import { TriggerHeaderIcon } from "./asstes";
import {modify, queryActionType, detail, queryAlarmList} from "../../../api/scene";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { onlyMessage } from "@jetlinks-web/utils";
import { handleFeatures, actionIconMap, ACTION_DATA } from './util'
import { useI18n } from 'vue-i18n'
import {useRequest} from "@jetlinks-web/hooks";
import Device from "./Device/index.vue";
import Manual from "./Manual/index.vue";
import Timer from "./Timer/index.vue";
import Collector from "./Collector/index.vue";
import Description from "./components/Description.vue";
import { Modal } from 'ant-design-vue';
import { unBindAlarm } from "../../../api/configuration";
import { debounce, omit } from "lodash-es";
import {useTabSaveSuccessBack} from "@jetlinks-web-core/hooks";

const { t: $t } = useI18n()
const sceneStore = useSceneStore();
const menuStore = useMenuStore();
const { onBack } = useTabSaveSuccessBack()
const { data: actionOptions } = useRequest(queryActionType, {
  onSuccess(resp) {
    return resp.result.map(item => ({ label: item.name, value: item.provider, subLabel: item.description, iconUrl: actionIconMap[item.provider] }))
  }
})
const { data } = storeToRefs(sceneStore);
const { getDetail, refresh } = sceneStore;

const route = useRoute();
const sceneForm = ref();
const loading = ref(false);
const deviceRef = ref();

provide('action-options', actionOptions)
provide(ACTION_DATA, data)

const save = async (next?: Function) => {
  const formData = await sceneForm.value.validateFields().catch((err) => {
    const names = err.errorFields[0].name;
    const index = Math.floor(names[1] / 2) + 1
    deviceRef.value?.changePaneIndex(index)
  });
  if (formData) {
    loading.value = true;
    const branches = data.value.branches?.filter((item) => item);
    const features = handleFeatures(branches);
    const resp: any = await modify(data.value.id!, {
      ...data.value,
      features,
      branches,
    })
      .then((res) => res)
      .catch(() => {
        loading.value = false;
      });
    loading.value = false;
    if (resp.success) {
      const isTabBack = await onBack(resp)

      if (!isTabBack) {
        next ? next?.() : menuStore.jumpPage("rule-engine/Scene", {});
      }
      onlyMessage($t('Save.index.766438-1'));
    }
  }
};

getDetail(route.query.id as string);

onUnmounted(() => {
  refresh?.();
});


/**
 * 路由跳转前校验是否存在未保存的数据，
 * 若存在则弹出确认框，
 * 若确认保存，则执行保存操作，
 * 若确认不保存，则执行跳转操作，
 * 若确认不保存且存在关联告警，则同步解除关联告警
 * @param next
 */
const beforeRouteLeave = async (next: Function) => {
  const res = await detail(route.query.id as string);
  if (res.success) {
    // 重新组装数据
    const _data = {...data.value, branches: data.value?.branches?.filter((item) => item).map(branch => {
      return {
        ...omit(branch, ['branches_Index', 'key']),
        then: branch?.then?.map(then => {
          return {
            ...omit(then, ['key']),
            actions: then?.actions?.map(action => {
              return {
                ...omit(action, ['key']),
                terms: action?.terms?.map(term => {
                  return {
                    ...omit(term, ['key', 'error']),
                    terms: term?.terms?.map(term => {
                      return {
                      ...omit(term, ['key', 'error']),
                      }
                    })
                  }
                })
              }
            })
          }
        }),
        when: branch?.when?.map(when => {
          return {
           ...omit(when, ['key']),
            terms: when?.terms?.map(term => {
              return {
               ...omit(term, ['key', 'error']),
              }
            })
          }
        })
      }
    })}
    // 数据对比
    if(JSON.stringify(_data) === JSON.stringify(res.result)) {
      next?.();
      return;
    }
    // 数据对比后，若存在未保存的数据且动作绑定了告警配置，则弹出确认框
    const unBindAction: string[] = [];
    data.value.branches?.forEach((branch, branchIndex) => {
      branch?.then?.forEach((then, _thenIndex) => {
        then?.actions?.forEach((action, _actionIndex) => {
          if(!res.result.branches?.[branchIndex]?.then?.[_thenIndex]?.actions.find(item => item.actionId === action.actionId)) {
            unBindAction.push(action.actionId);
          }
        })
      });
    });
    Modal.confirm({
      title: $t('Save.index.766438-2'),
      content: $t('Save.index.766438-3'),
      okText: $t('Save.index.766438-0'),
      cancelText: $t('Save.index.766438-4'),
      onOk: async () => {
        return await save(next);
      },
      onCancel: async () => {
        if(unBindAction.length) {
          const alarmRes = await queryAlarmList({
            terms: [
              {
                terms: unBindAction.map(item => {
                  return {
                    column: 'id$rule-bind-alarm',
                    value: `${route.query.id}:${item}`
                  }
                })
              }
            ]
          })
          if(alarmRes.success) {
            await Promise.all(alarmRes.result.map(item => unBindAlarm(route.query.id as string, item.id, unBindAction)))
            next?.();
          }
        } else {
          next?.();
        }
      }
    })
  }
};

const debouncedBeforeRouteLeave = debounce(beforeRouteLeave, 300);

onBeforeRouteUpdate((to, from, next) => { // 设备管理内路由跳转
  if(to.name === 'rule-engine/Scene') {
    return next();
  }
  debouncedBeforeRouteLeave(next);
})
</script>

<style scoped lang="less">
.scene-warp {
  padding: 24px;
  background-color: #fff;

  .header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 16px;
    .title {
      font-size: 20px;
      color: rgba(#000, 0.8);
      font-weight: bold;
    }
    .type {
      display: flex;
      align-items: center;
      min-width: 80px;
      margin-left: 16px;
      padding: 4px 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      img {
        margin-right: 4px;
      }
    }
  }
}
</style>
<style lang="less">
@import "./style.less";
</style>
