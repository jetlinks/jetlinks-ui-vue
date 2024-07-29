<template>
  <slot />
</template>

<script setup name="CheckFilterItem">
import { Form } from "jetlinks-ui-components";
import {queryAlarmList} from "@/api/rule-engine/scene";
import {defineExpose} from "vue";
import {useSceneStore} from "store/scene";
import {storeToRefs} from "pinia";

const props = defineProps({
  name: {
    type: Number,
    default: 0,
  },
  termsName: {
    type: Number,
    default: 0,
  },
  actionName: {
    type: Number,
    default: 0,
  },
  thenName: {
    type: Number,
    default: 0,
  },
  branchName: {
    type: Number,
    default: 0,
  },
  value: {
    type: Object,
    default: () => ({})
  }
})

const formItemContext = Form.useInjectFormItemContext()
const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);
const formTouchOff = () => {
  formItemContext.onFieldChange()
}

const check = async () => {
  if (props.value?.terms.length) {
    const alarmTerms = props.value.terms[1]
    const id = data.value.id
    const bindId = data.value.branches[props.branchName].then[props.thenName].actions[props.actionName].actionId || data.value.branches[props.branchName].branchId
    if (alarmTerms?.value.value) {
      const resp = await queryAlarmList({
        terms: [
          {
            column: 'id',
            termType: 'eq',
            value: alarmTerms.value.value,
            type: 'and'
          },
          {
            terms: [
              {
                column: 'id$rule-bind-alarm',
                value: `${id}:${bindId}`,
              },
              {
                column: 'id$rule-bind-alarm',
                value: `${id}:${-1}`,
                type: 'or'
              },
            ],
            type: 'and'
          },
        ]
      })

      if (!resp.result?.length) {
        formTouchOff()
      }
    } else {
      formTouchOff()
    }
  }
}

check()

defineExpose({
  formTouchOff
})

</script>

<style scoped>

</style>
