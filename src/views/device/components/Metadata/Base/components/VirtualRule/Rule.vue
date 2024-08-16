<template>
    <j-button @click="visible = true" style="width: 100%" type="dashed">
        {{ $t('VirtualRule.Rule.6916228-0') }}
    </j-button>
    <FRuleEditor v-if="visible" :id="id" :aggList="aggList" :propertiesOptions="propertiesOptions" :value="value" :virtualRule="virtualRule" @close="onClose" @save="onChange" />
</template>

<script setup lang="ts" name="Rule">
import FRuleEditor from '@/components/FRuleEditor/index.vue';
import {Form} from "jetlinks-ui-components";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const formItemContext = Form.useInjectFormItemContext();

interface Emits {
    (e: 'update:value', data: string | undefined): void;
    (e: 'change', data: string | undefined): void;
}
const emit = defineEmits<Emits>();

const props = defineProps({
    value: String,
    id: String,
    virtualRule: Object,
    aggList: Array,
    propertiesOptions: Array
});

const visible = ref<boolean>(false);

const onChange = (val: string | undefined) => {
    emit('change', val)
    emit('update:value', val)
    formItemContext.onFieldChange()
    onClose()
}

const onClose = () => {
    visible.value = false
}
</script>