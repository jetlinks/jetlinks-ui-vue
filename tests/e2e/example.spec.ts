import { test } from '@playwright/test';
import { chromium } from 'playwright';

test('搜索测试', async ({   }) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:9100/#/iot/device/Product');
  await page.waitForTimeout(3000);
  // Expect a title "to contain" a substring.
  const inputs = await page.$$('.ant-input');
  console.log(inputs.length)
  await inputs[0].fill('xyh')
  await inputs[1].fill('Qwer11234')
  const buttons = await page.$('.ant-btn')
  console.log(buttons)
  await buttons.click()
  await page.waitForTimeout(10000); // 等待1秒
  await page.goto('http://localhost:9100/#/iot/device/Product');
  await page.waitForTimeout(30000);
});
