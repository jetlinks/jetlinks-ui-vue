<template>
	<Sender :value="content" autoSize :placeholder="props.placeholder" :loading="agentRequestLoading" @submit="handleSubmit" @cancel="handleCancel" @change="(value) => (content = value)">
		<template #footer v-if="props.showFooter">
			<slot name="footer"></slot>
		</template>
	</Sender>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Sender, useXAgent, useXChat } from 'ant-design-x-vue';
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();

const props = defineProps({
	showFooter: {
		type: Boolean,
		default: false,
	},
	placeholder: {
		type: String,
		default: $t('Agent.data.sender.456813-1'),
	},
	// 请求失败时的描述
	requestFallDesc: {
		type: String,
		default: $t('Agent.data.sender.456813-2'),
	},
});

const emit = defineEmits<{
	(e: 'cancel'): void; // 取消请求
	(e: 'messages', preload: any[]): void; // 消息列表
	(e: 'request', preload: string, resolve: Function, reject: Function): any; // 发送请求
}>();

const content = ref('');
const agentRequestLoading = ref(false);

const [agent] = useXAgent<string, { message: string }, string>({
	request: async ({ message }, { onSuccess, onError }) => {
		agentRequestLoading.value = true;

		try {
			const result = (await new Promise((resolve, reject) => {
				emit('request', message, resolve, reject);
			})) as string[];

			onSuccess(result);
		} catch (error: any) {
      onError(error);
		} finally {
			agentRequestLoading.value = false;
		}
	},
});

const { onRequest, messages, setMessages } = useXChat({
	agent: agent.value,
	requestPlaceholder: 'Loading...',
	requestFallback: props.requestFallDesc,
});

const handleSubmit = (nextContent: string) => {
	if (!nextContent) {
		return;
	}
	onRequest(nextContent);
	content.value = '';
};

const handleCancel = () => {
	emit('cancel');
	agentRequestLoading.value = false;
};

const handleResetMessage = () => {
	setMessages([]);
};

const handleRequest = (question: string) => {
	if (!question) {
		return;
	}

	onRequest(question);
};

watch(messages as unknown as any, (val: any[]) => {
	emit('messages', val);
});

defineExpose({
	handleRequest,
	handleResetMessage,
});
</script>

<style scoped lang="less"></style>
