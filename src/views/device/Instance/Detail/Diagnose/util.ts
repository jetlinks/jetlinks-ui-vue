
import i18n from '@/i18n'
const $t = i18n.global.t
import { getImage } from '@/utils/comm';

export const headerImgMap = new Map();
headerImgMap.set('loading', getImage('/diagnose/loading-2.png'));
headerImgMap.set('error', getImage('/diagnose/error.png'));
headerImgMap.set('success', getImage('/diagnose/success.png'));

export const headerColorMap = new Map();
headerColorMap.set('loading', 'linear-gradient(89.95deg, #E6F5FF 0.03%, #E9EAFF 99.95%)');
headerColorMap.set(
  'error',
  'linear-gradient(89.95deg, rgba(231, 173, 86, 0.1) 0.03%, rgba(247, 111, 93, 0.1) 99.95%)',
);
headerColorMap.set('success', 'linear-gradient(89.95deg, #E8F8F7 0.03%, #EBEFFA 99.95%)');


export const headerTitleMap = new Map();
headerTitleMap.set('loading', $t('Diagnose.util.585601-0'));
headerTitleMap.set('error', $t('Diagnose.util.585601-1'));
headerTitleMap.set('success', $t('Diagnose.util.585601-2'));

export const headerDescMap = new Map();
headerDescMap.set('loading', $t('Diagnose.util.585601-3'));
headerDescMap.set('error', $t('Diagnose.util.585601-4'));
headerDescMap.set('success', $t('Diagnose.util.585601-5'));

export const progressMap = new Map();
progressMap.set('loading', '#597EF7');
progressMap.set('error', '#FAB247');
progressMap.set('success', '#32D4A4');
