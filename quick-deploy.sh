#!/bin/bash

# LibreTV 快速部署脚本 - 避免 Cloudflare Workers 问题

echo "🚀 LibreTV 快速部署解决方案"
echo "================================"

# 检查本地服务器状态
echo "1️⃣ 检查本地服务器..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ 本地服务器正在运行: http://localhost:8080"
    echo "🎉 你可以直接使用本地版本！"
else
    echo "⚠️ 本地服务器未运行，启动中..."
    npm run dev &
    sleep 3
    echo "✅ 本地服务器已启动: http://localhost:8080"
fi

echo ""
echo "🌐 在线部署选项:"
echo "1) 使用 GitHub Pages + 静态部署"
echo "2) 使用 Netlify Drop（拖拽部署）"
echo "3) 使用 Surge.sh（即时部署）"
echo "4) 创建可分享的 ZIP 包"

read -p "请选择选项 (1-4) 或按 Enter 跳过: " choice

case $choice in
    1)
        echo "📖 GitHub Pages 部署说明:"
        echo "1. 访问: https://github.com/suxinhang/LibreTV"
        echo "2. 进入 Settings > Pages"
        echo "3. 选择 Source: Deploy from a branch"
        echo "4. 选择 Branch: main"
        echo "5. 几分钟后访问: https://suxinhang.github.io/LibreTV"
        ;;
    2)
        echo "🎯 Netlify Drop 部署:"
        echo "1. 访问: https://app.netlify.com/drop"
        echo "2. 将整个项目文件夹拖拽到页面"
        echo "3. 等待部署完成"
        echo "4. 在 Site settings > Environment variables 添加 PASSWORD"
        ;;
    3)
        echo "⚡ Surge.sh 部署:"
        if ! command -v surge &> /dev/null; then
            echo "📦 安装 Surge..."
            npm install -g surge
        fi
        echo "🚀 开始部署..."
        surge . --domain libretv-$(date +%s).surge.sh
        ;;
    4)
        echo "📦 创建分享包..."
        zip -r "LibreTV-$(date +%Y%m%d).zip" . -x "node_modules/*" ".git/*" "*.log"
        echo "✅ 已创建: LibreTV-$(date +%Y%m%d).zip"
        echo "💡 解压后运行: npm install && npm run dev"
        ;;
    *)
        echo "⏭️ 跳过在线部署"
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo ""
echo "📱 访问方式:"
echo "• 本地访问: http://localhost:8080"
echo "• 特性: 完整无限滚动功能"
echo "• 密码: 111111 (默认)"
echo ""
echo "🔧 如遇问题:"
echo "• 检查防火墙设置"
echo "• 尝试不同的部署方式"
echo "• 查看完整文档: DEPLOYMENT.md"