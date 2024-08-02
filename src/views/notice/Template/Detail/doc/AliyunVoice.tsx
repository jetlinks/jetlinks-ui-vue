// import './index.less';
import i18n from '@/i18n'
const $t = i18n.global.t
const AliyunVoice = () => {
  return (
    <div class="doc">
      <div class="url">
        {$t('doc.AliyunVoice.214688-0')}
        <a href="https://account.console.aliyun.com" target="_blank" rel="noopener noreferrer">
          https://account.console.aliyun.com
        </a>
      </div>
      <h1>{$t('doc.AliyunVoice.214688-1')}</h1>
      <div>
        {$t('doc.AliyunVoice.214688-2')}
      </div>
      <h1>{$t('doc.AliyunVoice.214688-3')}</h1>
      <div>
        <h2>{$t('doc.AliyunVoice.214688-4')}</h2>
        <div> {$t('doc.AliyunVoice.214688-5')}</div>
        <h2>{$t('doc.AliyunVoice.214688-6')}</h2>
        <div> {$t('doc.AliyunVoice.214688-7')}</div>
        <h2> {$t('doc.AliyunVoice.214688-8')}</h2>
        <div> {$t('doc.AliyunVoice.214688-9')}</div>
        <h2> {$t('doc.AliyunVoice.214688-10')}</h2>
        <div> {$t('doc.AliyunVoice.214688-11')}</div>
        <div>{$t('doc.AliyunVoice.214688-12')}</div>
        <div>{$t('doc.AliyunVoice.214688-13')}</div>
        <h2> {$t('doc.AliyunVoice.214688-14')}</h2>
        <div> {$t('doc.AliyunVoice.214688-15')}</div>
        <h2> {$t('doc.AliyunVoice.214688-16')}</h2>
        <div> {$t('doc.AliyunVoice.214688-17')}</div>
        <h2> {$t('doc.AliyunVoice.214688-18')}</h2>
        <div>
          {$t('doc.AliyunVoice.214688-19',['${name}'])}
        </div>
      </div>
    </div>
  );
};
export default AliyunVoice;
