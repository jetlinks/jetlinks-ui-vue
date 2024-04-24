import { h, onMounted, onUpdated, ref } from 'vue';

import MarkdownIt from 'markdown-it';
import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItDeflist from 'markdown-it-deflist';
import { full as emoji } from 'markdown-it-emoji'
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';
import MarkdownItIns from 'markdown-it-ins';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItTasklists from 'markdown-it-task-lists';
import MarkdownItTOC from 'markdown-it-toc-done-right';

const props = {
    anchor: {
        type: Object,
        default: () => ({})
    },
    breaks: {
        type: Boolean,
        default: false
    },
    emoji: {
        type: Object,
        default: () => ({})
    },
    highlight: {
        type: Object,
        default: () => ({})
    },
    html: {
        type: Boolean,
        default: false
    },
    langPrefix: {
        type: String,
        default: 'language-'
    },
    linkify: {
        type: Boolean,
        default: false
    },
    plugins: {
        type: Array,
        default: () => []
    },
    quotes: {
        type: String,
        default: '“”‘’'
    },
    source: {
        type: String,
        default: ''
    },
    tasklists: {
        type: Object,
        default: () => ({})
    },
    toc: {
        type: Object,
        default: () => ({})
    },
    typographer: {
        type: Boolean,
        default: false
    },
    xhtmlOut: {
        type: Boolean,
        default: false
    }
};

export default {
    name: 'Markdown',
    props,
    setup(props) {
        const md = ref();
        const renderMarkdown = () => {
            let markdown = new MarkdownIt()
                .use(MarkdownItAbbr)
                .use(MarkdownItAnchor, props.anchor)
                .use(MarkdownItDeflist)
                .use(emoji, props.emoji)
                .use(MarkdownItFootnote)
                .use(MarkdownItHighlightjs, props.highlight)
                .use(MarkdownItIns)
                .use(MarkdownItMark)
                .use(MarkdownItSub)
                .use(MarkdownItSup)
                .use(MarkdownItTasklists, props.tasklists)
                .use(MarkdownItTOC, props.toc)
                .set({
                    breaks: props.breaks,
                    html: props.html,
                    langPrefix: props.langPrefix,
                    linkify: props.linkify,
                    quotes: props.quotes,
                    typographer: props.typographer,
                    xhtmlOut: props.xhtmlOut
                });

            props.plugins.forEach(({ plugin, options = {} }) => {
                markdown.use(plugin, options);
            });

            md.value = markdown.render(props.source);
        };

        onMounted(() => renderMarkdown());
        onUpdated(() => renderMarkdown());

        return () => h('div', { innerHTML: md.value, style: { height: '100%'} });
    }
};
