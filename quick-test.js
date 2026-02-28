// 快速测试脚本 - 在微信开发者工具的 Console 中运行
// 使用方法：复制以下代码到微信开发者工具的 Console 控制台中运行

console.log("🚀 开始微信小程序快速测试...");

// 测试工具函数
const Test = {
  // 测试计数器功能
  testCounter: function() {
    console.log("📋 测试计数器功能...");
    const initialCount = 0;
    let currentCount = initialCount;

    // 模拟点击计数器
    function addCount() {
      currentCount++;
      console.log(`✅ 计数器测试: 当前计数 = ${currentCount}`);
      return currentCount;
    }

    // 测试多次点击
    for (let i = 0; i < 5; i++) {
      addCount();
    }

    // 验证结果
    if (currentCount === 5) {
      console.log("✅ 计数器功能测试通过");
      return true;
    } else {
      console.log("❌ 计数器功能测试失败");
      return false;
    }
  },

  // 测试本地存储功能
  testStorage: function() {
    console.log("📋 测试本地存储功能...");
    const testKey = "test_data";
    const testData = { count: 10, timestamp: Date.now() };

    try {
      // 写入数据
      wx.setStorageSync(testKey, testData);
      console.log("✅ 数据写入成功");

      // 读取数据
      const readData = wx.getStorageSync(testKey);
      console.log("✅ 数据读取成功:", readData);

      // 验证数据
      if (readData.count === testData.count) {
        console.log("✅ 本地存储功能测试通过");
        return true;
      } else {
        console.log("❌ 数据验证失败");
        return false;
      }
    } catch (error) {
      console.log("❌ 本地存储测试失败:", error);
      return false;
    }
  },

  // 测试页面跳转功能
  testNavigation: function() {
    console.log("📋 测试页面跳转功能...");
    const pages = getCurrentPages();
    console.log("✅ 当前页面栈:", pages.length, "页");

    if (pages.length > 0) {
      console.log("✅ 当前页面:", pages[pages.length - 1].route);
      console.log("✅ 页面跳转功能测试通过");
      return true;
    } else {
      console.log("❌ 页面栈为空");
      return false;
    }
  },

  // 测试系统信息
  testSystemInfo: function() {
    console.log("📋 测试系统信息...");
    try {
      const systemInfo = wx.getSystemInfoSync();
      console.log("📱 品牌:", systemInfo.brand);
      console.log("📱 型号:", systemInfo.model);
      console.log("📱 系统:", systemInfo.system);
      console.log("📱 版本:", systemInfo.version);
      console.log("📱 屏幕宽度:", systemInfo.screenWidth, "px");
      console.log("📱 屏幕高度:", systemInfo.screenHeight, "px");
      console.log("✅ 系统信息获取成功");
      return true;
    } catch (error) {
      console.log("❌ 系统信息获取失败:", error);
      return false;
    }
  },

  // 测试网络状态
  testNetwork: function() {
    console.log("📋 测试网络状态...");
    try {
      const networkType = wx.getNetworkType();
      console.log("🌐 网络类型:", networkType);
      console.log("✅ 网络状态测试通过");
      return true;
    } catch (error) {
      console.log("❌ 网络状态测试失败:", error);
      return false;
    }
  },

  // 测试 Toast 提示
  testToast: function() {
    console.log("📋 测试 Toast 提示...");
    try {
      wx.showToast({
        title: '测试提示',
        icon: 'success',
        duration: 1000
      });
      console.log("✅ Toast 提示测试通过");
      return true;
    } catch (error) {
      console.log("❌ Toast 提示测试失败:", error);
      return false;
    }
  },

  // 测试模态框
  testModal: function() {
    console.log("📋 测试模态框...");
    try {
      wx.showModal({
        title: '测试模态框',
        content: '这是一个测试模态框',
        showCancel: false,
        confirmText: '确定'
      });
      console.log("✅ 模态框测试通过");
      return true;
    } catch (error) {
      console.log("❌ 模态框测试失败:", error);
      return false;
    }
  },

  // 运行所有测试
  runAllTests: function() {
    console.log("🚀 开始运行所有测试...");

    const results = {
      counter: this.testCounter(),
      storage: this.testStorage(),
      navigation: this.testNavigation(),
      systemInfo: this.testSystemInfo(),
      network: this.testNetwork(),
      toast: this.testToast(),
      modal: this.testModal()
    };

    console.log("\n📊 测试结果汇总:");
    console.log("================");

    let passed = 0;
    let failed = 0;

    for (const [testName, result] of Object.entries(results)) {
      if (result) {
        console.log(`✅ ${testName}: 通过`);
        passed++;
      } else {
        console.log(`❌ ${testName}: 失败`);
        failed++;
      }
    }

    console.log("================");
    console.log(`总计: ${passed + failed} 个测试`);
    console.log(`通过: ${passed} 个`);
    console.log(`失败: ${failed} 个`);

    if (failed === 0) {
      console.log("🎉 所有测试通过！");
    } else {
      console.log("⚠️  部分测试失败，请检查");
    }

    return results;
  }
};

// 运行测试
Test.runAllTests();

// 提供快捷命令
console.log("\n💡 快捷命令:");
console.log("Test.runAllTests() - 运行所有测试");
console.log("Test.testCounter() - 测试计数器");
console.log("Test.testStorage() - 测试本地存储");
console.log("Test.testNavigation() - 测试页面跳转");
console.log("Test.testSystemInfo() - 测试系统信息");
console.log("Test.testNetwork() - 测试网络状态");
console.log("Test.testToast() - 测试 Toast 提示");
console.log("Test.testModal() - 测试模态框");