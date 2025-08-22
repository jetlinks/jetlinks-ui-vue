<template>
	<div class="buddle-container" :style="{ maxHeight: `${maxHeight}px` }" ref="bubbleListContentRef">
		<BubbleList autoScroll :items="bubbleItems" :roles="bubbleRoles" />
	</div>
</template>

<script lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';

export const DefaultBubbleRoles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: '16px',
      },
    },
    avatar: { icon: h(UserOutlined), style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end',
    styles: {
      content: {
        borderRadius: '16px',
      },
    },
    avatar: { icon: h(UserOutlined), style: { background: '#87d068' } },
  },
};
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BubbleList } from 'ant-design-x-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import MarkdownViewer from '@/components/MarkdownViewer/index.vue';
import { Button } from 'ant-design-vue';

interface IMessageItem {
	id: string;
	status: 'local' | 'ai' | 'loading' | 'success';
	message: string;
	loading?: boolean;
}


const props = defineProps({
	messages: {
		type: Array as PropType<IMessageItem[]>,
		default: () => [],
	},
	maxHeight: {
		type: Number,
		default: 500,
	},
	// 对话角色设置
	bubbleRoles: {
		type: Object as PropType<BubbleListProps['roles']>,
		default: DefaultBubbleRoles,
	},
});

let scrollTimer: any = null;
const bubbleListContentRef = ref<HTMLElement | null>(null);
const bubbleItems = ref<(typeof BubbleList)['items']>([]);

const hasMarkdownSyntax = (str: string) => {
	if (str.includes('\n')) {
		return true;
	}

	const markdownPatterns = [
		/^#{1,6}\s+.+$/m, // 标题 (如 ## 标题)
		/^[-*+]\s+.+$/m, // 无序列表
		/^\d+\.\s+.+$/m, // 有序列表
		/^>\s+.+$/m, // 引用块
		/(`{3,})(\w*)\n[\s\S]*?\1/gm, // 代码块 (```code```)
		/\[([^\]]+)\]\(([^)]+)\)/g, // 链接 [text](url)
		/!\[([^\]]+)\]\(([^)]+)\)/g, // 图片 ![alt](src)
		/\*\*([^*]+)\*\*|__([^_]+)__/g, // 粗体 **text** 或 __text__
		/\*([^*]+)\*|_([^_]+)_/g, // 斜体 *text* 或 _text_
		/^\s*(\|-?)+\|/m, // 表格 | header | --- |
		/^ {4,}.+$/m, // 缩进代码块
		/^[-*]{3,}$/m, // 分隔线 --- 或 ***
	];

	const resetAndTest = (regex: RegExp, str: string) => {
		regex.lastIndex = 0;
		return regex.test(str);
	};

	return markdownPatterns.some((pattern) => pattern.test(str) || (pattern.global && resetAndTest(pattern, str)));
};

const handleTypingEnd = () => {
	if (scrollTimer) {
		clearInterval(scrollTimer);
		scrollTimer = null;
	}
};

const scrollToBottom = () => {
	const scrollElement = bubbleListContentRef.value;
	if (scrollElement) {
		const scrollHeight = scrollElement.scrollHeight;

		scrollElement.scrollTo({
			top: scrollHeight + 20,
			behavior: 'smooth',
		});
	}
};

watch(
	() => props.messages,
	(messageList) => {
		if (scrollTimer) {
			clearInterval(scrollTimer);
			scrollTimer = null;
		}

		// 更新消息列表
		bubbleItems.value = messageList?.map(({ id, message, status }) => {
			const baseItem = {
				key: id,
				content: message,
				loading: status === 'loading',
				role: status === 'local' ? 'local' : 'ai',
				typing: '{ step: 1, interval: 1 }',
				onTypingComplete: () => {
					handleTypingEnd();
				},
				footer:
					status === 'success'
						? h(
								'div',
								{
									style: { display: 'flex', flexWrap: 'wrap', width: '100%' },
								},
								[
									h(
										Button,
										{
											style: { marginRight: '5px' },
										},
										'查看xxxx事件'
									),
									h(
										Button,
										{
											style: { marginRight: '5px' },
										},
										'近一周视频巡检统计'
									),
								]
						  )
						: null,
			};

			if (hasMarkdownSyntax(message)) {
				return {
					...baseItem,
					messageRender: (content: string) =>
						h(MarkdownViewer, {
							text: content,
							needScroll: false,
						}),
				};
			}

			return baseItem;
		});

		scrollTimer = setInterval(() => {
			scrollToBottom();
		}, 500);
	},
	{ immediate: true }
);

onBeforeMount(() => {
	if (scrollTimer) {
		clearInterval(scrollTimer);
		scrollTimer = null;
	}
});
</script>

<style scoped lang="less">
.buddle-container {
	width: 100%;
	padding-right: 10px;
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
