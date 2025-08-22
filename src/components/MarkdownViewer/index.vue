<template>
	<div class="md-preview-container">
		<v-md-preview :text="newText" mode="preview" class="h-full" @image-click="handleImageClickEvent" @copy-code-success="handleCopyCodeSuccess" />
	</div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
VMdPreview.use(vuepressTheme);

const props = defineProps({
	// 绑定文本
	text: {
		type: String,
		default: '',
	},
});

// 编辑器内容
const newText = computed(() => props.text);

const handleCopyCodeSuccess = () => {
	message.info('复制成功');
};

const handleImageClickEvent = (val: any) => {
	console.log('图片', val);
};
</script>

<style lang="less">
.md-preview-container {
	width: 100%;
	height: 100%;
}

.vuepress-markdown-body {
	padding: unset !important;
	font-size: 14px;
	background: unset;

	pre {
		color: #fff;
	}
}
</style>
