import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const AliyunVoice = () => {
  return (
    <div class="doc">
      <div class="url">
        {$t('doc.AliyunVoice.640109-0')}
        <a href="https://account.console.aliyun.com" target="_blank" rel="noopener noreferrer">
          https://account.console.aliyun.com
        </a>
      </div>
      <h1>{$t('doc.AliyunVoice.640109-1')}</h1>
      <div>
        {$t('doc.AliyunVoice.640109-2')}
        {$t('doc.AliyunVoice.640109-3')}
      </div>
      <h1>{$t('doc.AliyunVoice.640109-4')}</h1>
      <div>
        <h2>{$t('doc.AliyunVoice.640109-5')}</h2>
        <div> {$t('doc.AliyunVoice.640109-6')}</div>
        <h2>{$t('doc.AliyunVoice.640109-7')}</h2>
        <div> {$t('doc.AliyunVoice.640109-8')}</div>
        <h2> {$t('doc.AliyunVoice.640109-9')}</h2>
        <div> {$t('doc.AliyunVoice.640109-10')}</div>
        <h2> {$t('doc.AliyunVoice.640109-11')}</h2>
        <div> {$t('doc.AliyunVoice.640109-12')}</div>
        <h2> {$t('doc.AliyunVoice.640109-13')}</h2>
        <div> {$t('doc.AliyunVoice.640109-14')}</div>
        <div>{$t('doc.AliyunVoice.640109-15')}</div>
        <div>{$t('doc.AliyunVoice.640109-16')}</div>
        <h2> {$t('doc.AliyunVoice.640109-17')}</h2>
        <div> {$t('doc.AliyunVoice.640109-18')}</div>
        <h2> {$t('doc.AliyunVoice.640109-19')}</h2>
        <div>
          {$t('doc.AliyunVoice.640109-20')}
          {$t('doc.AliyunVoice.640109-21')}{'{name}'}
          {$t('doc.AliyunVoice.640109-22')}
        </div>
      </div>
    </div>
  );
};
export default AliyunVoice;
