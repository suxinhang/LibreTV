# LibreTV 完整部署指南

> 本指南涵盖了 LibreTV 项目的多种部署方式，包括最新实现的无限滚动功能

## 🚀 项目特性

- ✅ **无限滚动搜索体验** - 类似抖音、微博的沉浸式浏览
- ✅ **多源视频聚合** - 支持多个视频API源
- ✅ **密码保护** - 确保安全访问
- ✅ **响应式设计** - 适配所有设备
- ✅ **PWA支持** - 可安装为应用

## 📋 部署方式对比

| 平台 | 难度 | 费用 | 性能 | 推荐度 |
|------|------|------|------|--------|
| Cloudflare Workers | ⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ | 🔥🔥🔥🔥🔥 |
| Vercel | ⭐ | 免费 | ⭐⭐⭐⭐ | 🔥🔥🔥🔥 |
| Netlify | ⭐ | 免费 | ⭐⭐⭐⭐ | 🔥🔥🔥🔥 |
| Docker | ⭐⭐⭐ | 服务器成本 | ⭐⭐⭐ | 🔥🔥🔥 |

## 🌟 方案一：Cloudflare Workers 部署（推荐）

### 特点
- ✅ **全球CDN加速**
- ✅ **零服务器成本**
- ✅ **自动HTTPS**
- ✅ **边缘计算**

### 部署步骤

#### 1. 准备工作
```bash
# 克隆项目
git clone https://github.com/suxinhang/LibreTV.git
cd LibreTV

# 安装依赖
npm install
```

#### 2. 配置环境
```bash
# 创建 .env 文件
cp .env.example .env

# 编辑 .env 设置密码
echo "PASSWORD=你的密码" > .env
```

#### 3. 部署到 Workers
```bash
# 一键部署
npx wrangler deploy

# 设置密码环境变量
npx wrangler secret put PASSWORD
# 输入你的密码
```

#### 4. 访问应用
- 部署完成后会显示 URL：`https://libretv.你的用户名.workers.dev`
- 使用设置的密码登录即可

### 自定义域名（可选）
```bash
# 在 wrangler.toml 中添加
[routes]
pattern = "libretv.yourdomain.com/*"
zone_name = "yourdomain.com"

# 重新部署
npx wrangler deploy
```

## 🚀 方案二：Vercel 部署

### 一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuxinhang%2FLibreTV)

### 手动部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 设置环境变量
vercel env add PASSWORD
```

## 🌐 方案三：Netlify 部署

### 一键部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/suxinhang/LibreTV)

### 手动部署
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod

# 设置环境变量
netlify env:set PASSWORD "你的密码"
```

## 🐳 方案四：Docker 部署

### 使用 Docker Compose（推荐）
```bash
# 创建 docker-compose.yml
version: '3.8'
services:
  libretv:
    image: bestzwei/libretv:latest
    container_name: libretv
    ports:
      - "8899:8080"
    environment:
      - PASSWORD=你的密码
    restart: unless-stopped

# 启动
docker compose up -d
```

### 直接使用 Docker
```bash
docker run -d \
  --name libretv \
  --restart unless-stopped \
  -p 8899:8080 \
  -e PASSWORD=你的密码 \
  bestzwei/libretv:latest
```

## 🔧 高级配置

### 环境变量配置
```bash
# 基本配置
PORT=8080                    # 端口号
PASSWORD=你的密码            # 访问密码（必须）
DEBUG=false                  # 调试模式

# 网络配置
CORS_ORIGIN=*               # CORS 允许的来源
REQUEST_TIMEOUT=5000        # 请求超时时间
MAX_RETRIES=2               # 最大重试次数

# 安全配置
BLOCKED_HOSTS=localhost,127.0.0.1,0.0.0.0,::1
BLOCKED_IP_PREFIXES=192.168.,10.,172.
```

### 自定义API源
1. 进入设置页面
2. 添加自定义接口
3. 输入API地址：`https://example.com/api.php/provide/vod`
4. 保存配置

## 📱 移动端优化

### PWA 安装
1. 在浏览器中访问网站
2. 点击"添加到主屏幕"
3. 即可像原生应用一样使用

### 响应式特性
- ✅ 手机端优化的触摸操作
- ✅ 平板端适配的网格布局
- ✅ 桌面端的完整功能体验

## 🛡️ 安全建议

### 必需配置
```bash
# 必须设置密码保护
PASSWORD=强密码123!@#

# 建议限制访问来源
CORS_ORIGIN=https://yourdomain.com
```

### 防护措施
- ✅ **密码保护** - 防止未授权访问
- ✅ **CORS限制** - 防止跨域攻击
- ✅ **请求限制** - 防止恶意请求
- ✅ **内容过滤** - 可选的内容过滤功能

## 🔍 无限滚动功能

### 新功能特性
- **智能加载** - 距离底部200px自动加载
- **防抖机制** - 避免频繁请求
- **状态管理** - 完善的加载状态追踪
- **用户体验** - 平滑的内容追加

### 使用方法
1. 搜索任意内容
2. 向下滚动到页面底部
3. 系统自动加载更多内容
4. 无需手动翻页

## 📊 性能优化

### Cloudflare Workers 优势
- **全球CDN** - 就近访问，速度更快
- **边缘计算** - 减少延迟
- **自动缩放** - 无需担心并发
- **零冷启动** - 即时响应

### 优化建议
```bash
# 启用缓存
CACHE_MAX_AGE=1d

# 压缩传输
gzip on

# 图片懒加载
loading="lazy"
```

## 🚨 常见问题

### Q1: 部署后无法访问？
**A:** 检查环境变量 `PASSWORD` 是否正确设置

### Q2: 视频无法播放？
**A:** 确保代理功能正常，检查网络连接

### Q3: 搜索结果为空？
**A:** 检查API源配置，确保API地址有效

### Q4: 无限滚动不工作？
**A:** 确保JavaScript已启用，刷新页面重试

## 📞 技术支持

- **项目地址**: https://github.com/suxinhang/LibreTV
- **问题反馈**: 通过 GitHub Issues 提交
- **更新日志**: 查看 GitHub Releases

## 📄 许可证

本项目采用 Apache 2.0 许可证，详见 [LICENSE](LICENSE) 文件。

---

*最后更新: 2025年8月*
*包含最新的无限滚动功能和Cloudflare Workers部署支持*