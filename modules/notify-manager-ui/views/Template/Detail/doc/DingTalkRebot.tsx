import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const DingTalkRebot = () => {
  const b = '{name}';
  return (
    <div class="doc">
      <div class="url">
        {$t('doc.DingTalkRebot.640107-0')}
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
      </div>
      <h1>{$t('doc.DingTalkRebot.640107-1')}</h1>
      <div>
        {$t('doc.DingTalkRebot.640107-2')}
      </div>
      <div>
        {$t('doc.DingTalkRebot.640107-3')}
      </div>
      <h1>{$t('doc.DingTalkRebot.640107-4')}</h1>
      <div>
        <h2> {$t('doc.DingTalkRebot.640107-5')}</h2>
        <div> {$t('doc.DingTalkRebot.640107-6')}</div>
        <h2> {$t('doc.DingTalkRebot.640107-7')}</h2>
        <div> {$t('doc.DingTalkRebot.640107-8')}</div>
        <h2> {$t('doc.DingTalkRebot.640107-9')}</h2>
        <div>
          {$t('doc.DingTalkRebot.640107-10')}{b}
          {$t('doc.DingTalkRebot.640107-11')}
        </div>
      </div>
    </div>
  );
};
export default DingTalkRebot;
