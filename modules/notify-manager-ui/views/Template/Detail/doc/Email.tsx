import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const Email = () => {
  const a = `{${$t('doc.Email.640106-0')}}`;
  const b = `{name}`;
  return (
    <div class="doc">
      <h1>{$t('doc.Email.640106-1')}</h1>
      <div>
        {$t('doc.Email.640106-2')}
        {$t('doc.Email.640106-3')}
      </div>
      <h1>{$t('doc.Email.640106-4')}</h1>
      <div>
        {/* <h2> 1、服务器地址</h2>
        <div>服务器地址支持自定义输入</div> */}
        <h2> 1、{$t('doc.Email.640106-0')}</h2>
        <div>{$t('doc.Email.640106-6')}{a}</div>
        <h2> {$t('doc.Email.640106-7')}</h2>
        <div> {$t('doc.Email.640106-8')}</div>
        <h2> {$t('doc.Email.640106-9')}</h2>
        <div>
          {$t('doc.Email.640106-10') + b}
          {$t('doc.Email.640106-11')}
        </div>
      </div>
    </div>
  );
};
export default Email;
