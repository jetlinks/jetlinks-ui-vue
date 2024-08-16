import i18n from '@/i18n'
const $t = i18n.global.t
import { useMenuStore } from '@/store/menu';
const menuStore = useMenuStore();
const systemNotice = [
    {
        provider: 'alarm',
        name: $t('components.data.752621-0'),
        children: [
            {
                provider: 'alarm-product',
                name: $t('components.data.752621-1'),
                description:
                    $t('components.data.752621-2'),
            },
            {
                provider: 'alarm-device',
                name: $t('components.data.752621-3'),
                description:
                    $t('components.data.752621-4'),
            },
            {
                provider: 'alarm-org',
                name: $t('components.data.752621-5'),
                description:
                    $t('components.data.752621-6'),
            },
            {
                provider: 'alarm-other',
                name: $t('components.data.752621-7'),
                description:
                    $t('components.data.752621-8'),
            },
        ],
    },
    {
        provider: 'system-monitor',
        name: $t('components.data.752621-9'),
        children: [
            {
                provider: 'system-event',
                name: $t('components.data.752621-10'),
            },
        ],
    },
    {
        provider: 'system-business',
        name: $t('components.data.752621-11'),
        children: [
            {
                provider: 'device-transparent-codec',
                name: $t('components.data.752621-12'),
            },
        ],
    },
];
const workflowNotice = [
    {
        provider: 'workflow-notification',
        name: $t('components.data.752621-13'),
        children: [
            {
                provider: 'workflow-task-todo',
                name: $t('components.data.752621-14'),
            },
            {
                provider: 'workflow-task-reject',
                name: $t('components.data.752621-15'),
            },
            {
                provider: 'workflow-task-cc',
                name: $t('components.data.752621-16'),
            },
            {
                provider: 'workflow-process-finish',
                name: $t('components.data.752621-17'),
            },
            {
                provider: 'workflow-process-repealed',
                name: $t('components.data.752621-18'),
            },
            {
                provider: 'workflow-task-transfer-todo',
                name: $t('components.data.752621-19')
            }
        ],
    },
]
export const getInitData = () =>{
   return menuStore.hasMenu('process') ? [...systemNotice,...workflowNotice] : [...systemNotice]

}
