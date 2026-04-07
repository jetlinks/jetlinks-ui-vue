import { diagnose } from '../../../../../assets'
import i18n from '@jetlinks-web-core/locales';

export const headerImgMap = new Map();
headerImgMap.set('loading', diagnose.loading2);
headerImgMap.set('error', diagnose.Error);
headerImgMap.set('success', diagnose.Success);

export const headerColorMap = new Map();
headerColorMap.set('loading', 'linear-gradient(89.95deg, #E6F5FF 0.03%, #E9EAFF 99.95%)');
headerColorMap.set(
  'error',
  'linear-gradient(89.95deg, rgba(231, 173, 86, 0.1) 0.03%, rgba(247, 111, 93, 0.1) 99.95%)',
);
headerColorMap.set('success', 'linear-gradient(89.95deg, #E8F8F7 0.03%, #EBEFFA 99.95%)');


export const headerTitleMap = new Map();
headerTitleMap.set('loading', i18n.global.t('Diagnose.util.952397-0'));
headerTitleMap.set('error', i18n.global.t('Diagnose.util.952397-1'));
headerTitleMap.set('success', i18n.global.t('Diagnose.util.952397-2'));

export const headerDescMap = new Map();
headerDescMap.set('loading', i18n.global.t('Diagnose.util.952397-3'));
headerDescMap.set('error', i18n.global.t('Diagnose.util.952397-4'));
headerDescMap.set('success', i18n.global.t('Diagnose.util.952397-5'));

export const progressMap = new Map();
progressMap.set('loading', '#597EF7');
progressMap.set('error', '#FAB247');
progressMap.set('success', '#32D4A4');
