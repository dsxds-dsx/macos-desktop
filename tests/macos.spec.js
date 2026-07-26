const { test, expect } = require('@playwright/test');

// 辅助函数：解锁进入桌面
async function unlockToDesktop(page) {
  await page.waitForTimeout(4000);
  await page.locator('#lock-password').fill('1234');
  await page.locator('#lock-submit').click();
  await page.waitForTimeout(1000);
}

test.describe('macOS 网页桌面系统测试', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('previewer-tools')) {
          console.error(`Console Error: ${text}`);
        }
      }
    });
    page.on('pageerror', exception => {
      console.error(`Page Error: ${exception.message}`);
    });
  });

  test.describe('启动和锁屏流程', () => {
    test('页面加载时显示启动屏幕', async ({ page }) => {
      const bootScreen = page.locator('#boot-screen');
      await expect(bootScreen).toBeVisible();
      await expect(bootScreen.locator('.boot-logo')).toBeVisible();
    });

    test('启动后自动进入锁屏', async ({ page }) => {
      await page.waitForTimeout(4000);
      const lockScreen = page.locator('#lock-screen');
      await expect(lockScreen).toBeVisible();
      const lockTime = page.locator('#lock-time');
      await expect(lockTime).toBeVisible();
      const lockDate = page.locator('#lock-date');
      await expect(lockDate).toBeVisible();
    });

    test('锁屏显示时间和日期', async ({ page }) => {
      await page.waitForTimeout(4000);
      const timeText = await page.locator('#lock-time').textContent();
      expect(timeText).toMatch(/^\d{2}:\d{2}$/);
    });

    test('输入密码后解锁进入桌面', async ({ page }) => {
      await unlockToDesktop(page);
      await expect(page.locator('#desktop')).toBeVisible();
      await expect(page.locator('#menubar')).toBeVisible();
      await expect(page.locator('#dock')).toBeVisible();
    });

    test('按 Enter 键解锁', async ({ page }) => {
      await page.waitForTimeout(4000);
      await page.locator('#lock-password').fill('test');
      await page.locator('#lock-password').press('Enter');
      await page.waitForTimeout(1000);
      await expect(page.locator('#desktop')).toBeVisible();
    });

    test('锁屏控制按钮存在', async ({ page }) => {
      await page.waitForTimeout(4000);
      await expect(page.locator('#sleep-btn')).toBeVisible();
      await expect(page.locator('#restart-btn')).toBeVisible();
      await expect(page.locator('#shutdown-btn')).toBeVisible();
    });
  });

  test.describe('桌面和菜单栏', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('菜单栏显示正确元素', async ({ page }) => {
      await expect(page.locator('.apple-menu')).toBeVisible();
      await expect(page.locator('#app-menu')).toContainText('访达');
      await expect(page.locator('#menubar-time')).toBeVisible();
      await expect(page.locator('#menubar-date')).toBeVisible();
      await expect(page.locator('#control-center-btn')).toBeVisible();
      await expect(page.locator('#notif-center-btn')).toBeVisible();
      await expect(page.locator('#search-menu')).toBeVisible();
    });

    test('Apple 菜单可展开', async ({ page }) => {
      await page.locator('#apple-menu').click();
      await expect(page.locator('#apple-dropdown')).toHaveClass(/show/);
      const items = page.locator('#apple-dropdown .dropdown-item');
      await expect(items).toHaveCount(9);
    });

    test('桌面图标显示', async ({ page }) => {
      const icons = page.locator('.desktop-icon');
      await expect(icons).toHaveCount(3);
    });

    test('壁纸已设置', async ({ page }) => {
      const wallpaper = page.locator('#wallpaper');
      const bg = await wallpaper.evaluate(el => getComputedStyle(el).backgroundImage);
      expect(bg).toBeTruthy();
    });
  });

  test.describe('Dock 功能', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('Dock 包含所有默认应用', async ({ page }) => {
      const dockItems = page.locator('.dock-item');
      await expect(dockItems.first()).toBeVisible();
      expect(await dockItems.count()).toBeGreaterThanOrEqual(12);
    });

    test('点击 Dock 应用图标可打开窗口', async ({ page }) => {
      await page.locator('[data-app-id="safari"]').click();
      await page.waitForTimeout(500);
      const windows = page.locator('.window');
      expect(await windows.count()).toBeGreaterThanOrEqual(2);
    });

    test('Dock 指示器显示运行中的应用', async ({ page }) => {
      await page.locator('[data-app-id="terminal"]').click();
      await page.waitForTimeout(500);
      const terminalDockItem = page.locator('.dock-item[data-app-id="terminal"]');
      await expect(terminalDockItem).toHaveClass(/running/);
    });
  });

  test.describe('窗口管理', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('窗口可以关闭', async ({ page }) => {
      const initialCount = await page.locator('.window').count();
      
      const closeBtn = page.locator('.window .window-control.close').first();
      await closeBtn.click();
      await page.waitForTimeout(400);
      
      const afterCount = await page.locator('.window').count();
      expect(afterCount).toBe(initialCount - 1);
    });

    test('窗口可以最小化', async ({ page }) => {
      await page.locator('[data-app-id="terminal"]').click();
      await page.waitForTimeout(500);
      
      const minimizeBtn = page.locator('.window .window-control.minimize').last();
      await minimizeBtn.click();
      await page.waitForTimeout(500);
    });

    test('窗口可以最大化', async ({ page }) => {
      await page.locator('[data-app-id="calculator"]').click();
      await page.waitForTimeout(500);
      
      const maxBtn = page.locator('.window .window-control.maximize').last();
      await maxBtn.click();
      await page.waitForTimeout(300);
    });

    test('窗口可以拖动', async ({ page }) => {
      await page.locator('[data-app-id="notes"]').click();
      await page.waitForTimeout(500);
      
      const header = page.locator('.window .window-header').last();
      const box = await header.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + 100, box.y + 100, { steps: 10 });
        await page.mouse.up();
      }
    });
  });

  test.describe('控制中心和通知中心', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('控制中心可打开', async ({ page }) => {
      await page.locator('#control-center-btn').click();
      await expect(page.locator('#control-center')).toHaveClass(/show/);
      await expect(page.locator('#cc-wifi')).toBeVisible();
      await expect(page.locator('#cc-bluetooth')).toBeVisible();
      await expect(page.locator('#cc-brightness')).toBeVisible();
    });

    test('控制中心按钮可切换', async ({ page }) => {
      await page.locator('#control-center-btn').click();
      const wifiBtn = page.locator('#cc-wifi');
      await expect(wifiBtn).toHaveClass(/active/);
      await wifiBtn.click();
      await expect(wifiBtn).not.toHaveClass(/active/);
    });

    test('通知中心可打开', async ({ page }) => {
      await page.locator('#notif-center-btn').click();
      await expect(page.locator('#notification-center')).toHaveClass(/show/);
      await expect(page.locator('.nc-widget-weather')).toBeVisible();
      await expect(page.locator('.nc-widget-calendar')).toBeVisible();
    });
  });

  test.describe('Spotlight 搜索', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('点击搜索图标打开 Spotlight', async ({ page }) => {
      await page.locator('#search-menu').click();
      await expect(page.locator('#spotlight')).toHaveClass(/show/);
      const input = page.locator('#spotlight-input');
      await expect(input).toBeFocused();
    });

    test('Spotlight 搜索应用', async ({ page }) => {
      await page.locator('#search-menu').click();
      await page.locator('#spotlight-input').fill('safari');
      await page.waitForTimeout(300);
      const results = page.locator('.spotlight-item');
      expect(await results.count()).toBeGreaterThanOrEqual(1);
    });

    test('按 Escape 关闭 Spotlight', async ({ page }) => {
      await page.locator('#search-menu').click();
      await page.keyboard.press('Escape');
      await expect(page.locator('#spotlight')).not.toHaveClass(/show/);
    });
  });

  test.describe('核心应用', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('访达(Finder)自动打开', async ({ page }) => {
      const windows = page.locator('.window');
      expect(await windows.count()).toBeGreaterThanOrEqual(1);
    });

    test('系统设置可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('settings'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('系统设置');
    });

    test('终端可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('terminal'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('终端');
    });

    test('Safari 可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('safari'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('Safari');
    });

    test('备忘录可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('notes'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('备忘录');
    });

    test('AI 助手可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('ai'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('AI');
    });

    test('计算器可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('calculator'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('计算器');
    });

    test('照片可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('photos'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('照片');
    });

    test('邮件可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('mail'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('邮件');
    });

    test('信息可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('messages'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('信息');
    });

    test('音乐可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('music'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('音乐');
    });

    test('日历可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('calendar'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('日历');
    });

    test('活动监视器可打开', async ({ page }) => {
      await page.evaluate(() => window.appManager.openApp('activity'));
      await page.waitForTimeout(500);
      const title = await page.locator('.window .window-title').last().textContent();
      expect(title).toContain('活动监视器');
    });
  });

  test.describe('主题和设置', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('默认深色主题', async ({ page }) => {
      const theme = await page.locator('body').getAttribute('data-theme');
      expect(theme).toBe('dark');
    });

    test('切换到浅色主题', async ({ page }) => {
      await page.evaluate(() => window.setTheme('light'));
      const theme = await page.locator('body').getAttribute('data-theme');
      expect(theme).toBe('light');
    });

    test('切换到自动主题', async ({ page }) => {
      await page.evaluate(() => window.setTheme('auto'));
      const theme = await page.locator('body').getAttribute('data-theme');
      expect(['light', 'dark']).toContain(theme);
    });
  });

  test.describe('所有应用可打开（无错误）', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    const allApps = [
      'finder', 'safari', 'mail', 'messages', 'facetime', 'maps', 'photos',
      'notes', 'calendar', 'reminders', 'music', 'podcasts', 'tv', 'news',
      'stocks', 'books', 'appstore', 'ai', 'settings', 'terminal', 'activity',
      'calculator', 'textedit', 'preview', 'quicktime', 'weather', 'clock',
      'contacts', 'voicememos', 'stickies', 'chess', 'dictionary', 'fontbook',
      'imagecapture', 'keychain', 'migration', 'sysinfo', 'home', 'numbers',
      'pages', 'keynote', 'garageband', 'imovie', 'trash'
    ];

    for (const appId of allApps) {
      test(`应用 ${appId} 可打开无报错`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        
        const beforeCount = await page.locator('.window').count();
        await page.evaluate(id => window.appManager.openApp(id), appId);
        await page.waitForTimeout(500);
        
        expect(errors).toHaveLength(0);
        
        const afterCount = await page.locator('.window').count();
        expect(afterCount).toBeGreaterThan(beforeCount);
      });
    }
  });

  test.describe('持久化存储', () => {
    test('主题设置保存到 localStorage', async ({ page }) => {
      await unlockToDesktop(page);
      
      await page.evaluate(() => window.setTheme('light'));
      const savedTheme = await page.evaluate(() => localStorage.getItem('macos_theme'));
      expect(savedTheme).toBe('light');
    });

    test('刷新后主题设置保留', async ({ page }) => {
      await unlockToDesktop(page);
      await page.evaluate(() => window.setTheme('light'));
      
      await page.reload();
      await page.waitForTimeout(4000);
      await page.locator('#lock-password').fill('1234');
      await page.locator('#lock-submit').click();
      await page.waitForTimeout(1000);
      
      const theme = await page.locator('body').getAttribute('data-theme');
      expect(theme).toBe('light');
    });
  });

  test.describe('终端命令', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
      await page.evaluate(() => window.appManager.openApp('terminal'));
      await page.waitForTimeout(500);
    });

    test('ls 命令可执行', async ({ page }) => {
      const terminalInput = page.locator('.terminal-input').last();
      const typeCmd = async (cmd) => {
        if (await terminalInput.isVisible()) {
          await terminalInput.fill(cmd);
          await terminalInput.press('Enter');
        } else {
          await page.keyboard.type(cmd);
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(200);
      };
      await typeCmd('cd /');
      await typeCmd('ls');
      const content = await page.locator('.window-body').last().innerText();
      expect(content).toContain('Desktop');
    });

    test('help 命令显示帮助', async ({ page }) => {
      const terminalInput = page.locator('.terminal-input').last();
      if (await terminalInput.isVisible()) {
        await terminalInput.fill('help');
        await terminalInput.press('Enter');
      } else {
        await page.keyboard.type('help');
        await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(300);
      const content = await page.locator('.window-body').last().innerText();
      expect(content).toContain('命令');
    });
  });

  test.describe('右键菜单', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
    });

    test('桌面右键显示菜单', async ({ page }) => {
      await page.evaluate(() => {
        const desktop = document.getElementById('desktop');
        const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 50, clientY: 100 });
        desktop.dispatchEvent(event);
      });
      await expect(page.locator('#context-menu')).toHaveClass(/show/);
    });
  });

  test.describe('关机流程', () => {
    test('关机按钮显示关机屏幕', async ({ page }) => {
      await unlockToDesktop(page);
      
      await page.locator('#apple-menu').click();
      await page.locator('[data-action="shutdown"]').click();
      await page.waitForTimeout(300);
      await expect(page.locator('#shutdown-screen')).toBeVisible();
    });
  });

  test.describe('无控制台错误验证', () => {
    test('页面加载和操作过程无控制台错误', async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (!text.includes('previewer-tools') && !text.includes('favicon')) {
            consoleErrors.push(text);
          }
        }
      });
      page.on('pageerror', err => consoleErrors.push(err.message));
      
      await unlockToDesktop(page);
      
      const testApps = ['safari', 'terminal', 'notes', 'calculator', 'settings', 'ai', 'music', 'mail', 'photos', 'calendar'];
      for (const appId of testApps) {
        await page.evaluate(id => window.appManager.openApp(id), appId);
        await page.waitForTimeout(300);
      }
      
      await page.locator('#control-center-btn').click();
      await page.waitForTimeout(300);
      await page.locator('#notif-center-btn').click();
      await page.waitForTimeout(300);
      
      expect(consoleErrors).toHaveLength(0);
    });
  });

  test.describe('AI 助手功能', () => {
    test.beforeEach(async ({ page }) => {
      await unlockToDesktop(page);
      await page.evaluate(() => window.appManager.openApp('ai'));
      await page.waitForTimeout(500);
    });

    test('AI 助手窗口可打开', async ({ page }) => {
      const aiWindow = page.locator('.window').last();
      await expect(aiWindow).toBeVisible();
      const title = await aiWindow.locator('.window-title').textContent();
      expect(title).toContain('AI');
    });

    test('AI 可以发送消息并收到回复', async ({ page }) => {
      const input = page.locator('.ai-input, .ai-chat-input, input[type="text"]').last();
      if (await input.isVisible()) {
        await input.fill('你好');
        await input.press('Enter');
        await page.waitForTimeout(1000);
        const messages = page.locator('.ai-message, .chat-message, .message');
        expect(await messages.count()).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
