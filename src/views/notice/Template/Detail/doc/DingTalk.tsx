
// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t
const DingTalk = () => {
  const agentId = getImage('/notice/doc/template/dingTalk-message/01-Agentid.jpg');
  // const userId = getImage('/notice/doc/template/dingTalk-message/02-user-id.jpg');
  // const dept = getImage('/notice/doc/template/dingTalk-message/03-dept.jpg');
  return (
    <div class="doc">
      <div class="url">
        {$t('doc.DingTalk.214687-0')}
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
        <br />
        {$t('doc.DingTalk.214687-1')}
        <a href="https://www.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://www.dingtalk.com
        </a>
      </div>
      <h1>{$t('doc.DingTalk.214687-2')}</h1>
      <div>
        {$t('doc.DingTalk.214687-3')}
        <div>{$t('doc.DingTalk.214687-4')}</div>
      </div>
      <h1> {$t('doc.DingTalk.214687-5')}</h1>
      <h2> {$t('doc.DingTalk.214687-6')}</h2>
      <div> {$t('doc.DingTalk.214687-7')}</div>
      <h2> 2、Agentid</h2>
      <div> {$t('doc.DingTalk.214687-8')}</div>
      <div> {$t('doc.DingTalk.214687-9')}</div>
      <div class="image">
        <Image width="100%" src={agentId} />
      </div>
      <h2> {$t('doc.DingTalk.214687-10')}</h2>
      <div>{$t('doc.DingTalk.214687-11')}</div>
      {/*<div> 收信人ID获取路径：“钉钉管理后台”--“通讯录”--“查看用户”</div>*/}
      {/*<div> 收信部门ID获取路径：“钉钉管理后台”--“通讯录”--“编辑部门”</div>*/}
      {/*<div class="image">*/}
      {/*  <Image width="100%" src={userId} />*/}
      {/*  <Image width="100%" src={dept} />*/}
      {/*</div>*/}
      <h2> {$t('doc.DingTalk.214687-12')}</h2>
      <div>
        {$t('doc.DingTalk.214687-13',['${name}'])}
      </div>
    </div>
  );
};
export default DingTalk;
