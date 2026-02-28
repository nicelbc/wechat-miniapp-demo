# dir
A local GitHub repository created with Claude Code

## 项目简介

这是一个使用 Claude Code 创建的示例 GitHub 仓库，展示了完整的项目结构和代码示例。

## 项目结构

```
dir/
├── src/           # 源代码目录
│   ├── main.cpp   # C++ 示例程序
│   └── utils.py   # Python 工具模块
├── docs/          # 文档目录
│   └── README.md  # 详细文档
├── tests/         # 测试目录
│   └── test_utils.py  # 单元测试
└── .gitignore     # Git 忽略文件
```

## 快速开始

### 运行 C++ 程序
```bash
cd src
g++ main.cpp -o main
./main
```

### 运行 Python 程序
```bash
python3 src/utils.py
```

### 运行测试
```bash
python3 tests/test_utils.py
```

## 功能特性

- ✅ C++ 面向对象编程示例
- ✅ Python 实用工具函数
- ✅ 完整的测试套件
- ✅ 详细的项目文档
- ✅ Git 版本控制

## 技术栈

- **C++**: 面向对象编程示例
- **Python**: 工具函数和测试
- **Git**: 版本控制
- **GitHub**: 代码托管
- **Claude Code**: AI 编程助手
- **GitHub MCP**: GitHub MCP 服务器

## 开发环境

- macOS
- C++ 编译器 (g++/clang++)
- Python 3.6+
- Claude Code
- GitHub MCP Server

## GitHub MCP 配置

本项目已配置 GitHub MCP 服务器，支持以下功能：

### 配置文件
- `.mcp.json` - GitHub MCP 服务器配置
- `.claude/settings.local.json` - 权限配置

### 使用方法
1. 设置 GitHub 个人访问令牌：
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="your_token"
   ```
2. 重新启动 Claude Code
3. 使用 GitHub MCP 功能

### 支持的功能
- 仓库管理
- 代码协作
- 问题管理
- 搜索功能
- 分支管理
- 提交历史

详细配置请参考：`/Users/bcl/GITHUB_MCP_SETUP.md`

## 许可证

MIT License

---

*创建时间: 2026-02-28*
*作者: nicelbc*
