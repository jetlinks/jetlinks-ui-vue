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
headerTitleMap.set('loading', '正在诊断中');
headerTitleMap.set('error', '发现连接问题');
headerTitleMap.set('success', '连接状态正常');

export const headerDescMap = new Map();
headerDescMap.set('loading', '已诊断XX个');
headerDescMap.set('error', '请处理连接异常');
headerDescMap.set('success', '现在可调试消息通信');

export const progressMap = new Map();
progressMap.set('loading', '#597EF7');
progressMap.set('error', '#FAB247');
progressMap.set('success', '#32D4A4');
