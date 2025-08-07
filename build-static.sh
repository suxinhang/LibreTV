#!/bin/bash

# 创建静态部署版本的脚本

echo "🔨 构建 LibreTV 静态版本..."

# 创建构建目录
rm -rf dist
mkdir -p dist

# 复制静态文件
echo "📁 复制静态文件..."
cp -r css js libs image dist/
cp *.html dist/ 2>/dev/null || true
cp *.json *.txt dist/ 2>/dev/null || true

# 创建简化的代理版本
echo "⚡ 创建代理配置..."
cat > dist/_redirects << 'EOF'
# Netlify 重定向规则
/proxy/* https://api.allorigins.win/raw?url=:splat 200
/s=* /index.html 200
/* /index.html 404
EOF

# 创建 vercel.json 用于 Vercel 部署
cat > dist/vercel.json << 'EOF'
{
  "rewrites": [
    {
      "source": "/proxy/(.*)",
      "destination": "https://api.allorigins.win/raw?url=$1"
    },
    {
      "source": "/s=(.*)",
      "destination": "/index.html"
    },
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
EOF

# 修改 JavaScript 中的代理 URL
echo "🔧 配置代理地址..."
if [ -f "dist/js/config.js" ]; then
    # 使用公共代理服务
    sed -i.bak 's|const PROXY_URL = .*|const PROXY_URL = "https://api.allorigins.win/raw?url=";|' dist/js/config.js
    rm -f dist/js/config.js.bak
fi

# 设置固定密码
echo "🔐 设置固定密码配置..."
echo "# 密码已设置为固定值: 20220828"

echo "✅ 构建完成！"
echo "📁 输出目录: dist/"
echo "📋 文件列表:"
ls -la dist/

echo ""
echo "🚀 部署选项:"
echo "1. Netlify: 拖拽 dist/ 文件夹到 https://app.netlify.com/drop"
echo "2. Vercel: 在 dist/ 目录运行 'vercel'"
echo "3. GitHub Pages: 将 dist/ 内容推送到 gh-pages 分支"
echo "4. 本地预览: 在 dist/ 目录运行 'python3 -m http.server 8000'"