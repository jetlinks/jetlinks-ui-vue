// import './index.less';
import i18n from '@/i18n'
const $t = i18n.global.t
const DingTalkRebot = () => {
  const b = '{name}';
  return (
    <div class="doc">
      <div class="url">
        {$t('doc.DingTalkRebot.214686-0')}
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
      </div>
      <h1>{$t('doc.DingTalkRebot.214686-1')}</h1>
      <div>
        {$t('doc.DingTalkRebot.214686-2')}
      </div>
      <div>
        {$t('doc.DingTalkRebot.214686-3')}
      </div>
      <h1>{$t('doc.DingTalkRebot.214686-4')}</h1>
      <div>
        <h2> {$t('doc.DingTalkRebot.214686-5')}</h2>
        <div> {$t('doc.DingTalkRebot.214686-6')}</div>
        <h2> {$t('doc.DingTalkRebot.214686-7')}</h2>
        <div> {$t('doc.DingTalkRebot.214686-8')}</div>
        <h2> {$t('doc.DingTalkRebot.214686-9')}</h2>
        <div>
          {$t('doc.DingTalkRebot.214686-10',['${name}'])}
        </div>
      </div>
    </div>
  );
};
export default DingTalkRebot;
