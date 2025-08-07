#!/bin/bash

# LibreTV 一键部署脚本
# 支持多种部署平台

set -e

echo "🚀 LibreTV 一键部署脚本"
echo "=========================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 显示部署选项
echo "请选择部署平台:"
echo "1) Cloudflare Workers (推荐)"
echo "2) Vercel"
echo "3) Netlify"
echo "4) 本地开发环境"
echo "5) Docker"

read -p "请输入选项 (1-5): " choice

case $choice in
    1)
        echo "🌟 部署到 Cloudflare Workers..."
        
        # 检查 wrangler
        if ! command -v npx &> /dev/null; then
            echo "❌ 错误: 请先安装 Node.js"
            exit 1
        fi
        
        # 检查是否已配置
        if [ ! -f "wrangler.toml" ]; then
            echo "❌ 错误: 未找到 wrangler.toml 配置文件"
            exit 1
        fi
        
        # 部署
        echo "📦 开始部署..."
        npx wrangler deploy
        
        echo "✅ 部署完成!"
        echo "🔧 请记得设置密码: npx wrangler secret put PASSWORD"
        ;;
        
    2)
        echo "🔵 部署到 Vercel..."
        
        # 安装 Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "📦 安装 Vercel CLI..."
            npm i -g vercel
        fi
        
        # 部署
        echo "📦 开始部署..."
        vercel --prod
        
        echo "✅ 部署完成!"
        echo "🔧 请记得设置环境变量: vercel env add PASSWORD"
        ;;
        
    3)
        echo "🟢 部署到 Netlify..."
        
        # 安装 Netlify CLI
        if ! command -v netlify &> /dev/null; then
            echo "📦 安装 Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # 登录检查
        if ! netlify status &> /dev/null; then
            echo "🔐 请先登录 Netlify..."
            netlify login
        fi
        
        # 部署
        echo "📦 开始部署..."
        netlify deploy --prod
        
        echo "✅ 部署完成!"
        echo "🔧 请记得设置环境变量: netlify env:set PASSWORD 你的密码"
        ;;
        
    4)
        echo "💻 启动本地开发环境..."
        
        # 检查环境文件
        if [ ! -f ".env" ]; then
            if [ -f ".env.example" ]; then
                echo "📝 创建环境配置文件..."
                cp .env.example .env
                echo "⚠️  请编辑 .env 文件设置 PASSWORD"
            else
                echo "PASSWORD=111111" > .env
                echo "✅ 已创建默认 .env 文件，密码: 111111"
            fi
        fi
        
        # 安装依赖
        echo "📦 安装依赖..."
        npm install
        
        # 启动开发服务器
        echo "🚀 启动开发服务器..."
        npm run dev
        ;;
        
    5)
        echo "🐳 Docker 部署..."
        
        # 检查 Docker
        if ! command -v docker &> /dev/null; then
            echo "❌ 错误: 请先安装 Docker"
            exit 1
        fi
        
        # 获取密码
        read -p "请输入访问密码: " password
        
        # 停止旧容器
        echo "🛑 停止旧容器..."
        docker stop libretv 2>/dev/null || true
        docker rm libretv 2>/dev/null || true
        
        # 启动新容器
        echo "🚀 启动 Docker 容器..."
        docker run -d \
            --name libretv \
            --restart unless-stopped \
            -p 8899:8080 \
            -e PASSWORD="$password" \
            bestzwei/libretv:latest
        
        echo "✅ Docker 部署完成!"
        echo "🌐 访问地址: http://localhost:8899"
        echo "🔑 密码: $password"
        ;;
        
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成! 享受你的 LibreTV 体验吧!"
echo "📖 更多帮助请查看: DEPLOYMENT.md"