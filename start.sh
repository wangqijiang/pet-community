#!/bin/bash

echo "=========================================="
echo "  WaggleWorld 宠物社交小程序启动脚本"
echo "=========================================="
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 MySQL 是否运行
if ! command -v mysql &> /dev/null; then
    echo "⚠️  警告: 未检测到 MySQL 命令行工具"
    echo "   请确保 MySQL 服务正在运行"
fi

# 进入 server 目录
cd server

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 正在安装依赖..."
    npm install
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  未找到 .env 文件，请配置环境变量"
    echo "   可以复制 .env.example 并修改"
fi

echo ""
echo "🚀 正在启动后端服务..."
echo "   API 地址: http://localhost:3000"
echo "   API 文档: http://localhost:3000/api-docs"
echo ""
echo "📝 请在另一个终端窗口打开 UI/index.html 访问前端"
echo "   或使用: npx http-server ../UI -p 8080"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev
