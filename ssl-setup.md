# 免费SSL证书申请指南

## 🎯 推荐方案对比

| 平台 | 证书类型 | 配置难度 | 自动续期 | 推荐度 |
|------|----------|----------|----------|--------|
| **Vercel** | 自动HTTPS | ⭐ 零配置 | ✅ 自动 | ⭐⭐⭐⭐⭐ |
| **Netlify** | 自动HTTPS | ⭐ 零配置 | ✅ 自动 | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | 自动HTTPS | ⭐ 一键启用 | ✅ 自动 | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | 免费SSL | ⭐ 零配置 | ✅ 自动 | ⭐⭐⭐⭐⭐ |
| **Let's Encrypt** | 免费证书 | ⭐⭐⭐ 需配置 | ✅ 可自动 | ⭐⭐⭐ |

## 🚀 方案一：Vercel 部署（推荐）

### 特点：
- ✅ 自动HTTPS，无需配置
- ✅ 全球CDN加速
- ✅ 自定义域名支持
- ✅ 自动证书续期

### 部署步骤：
```bash
# 1. 安装 Vercel CLI（如已安装可跳过）
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在 dist 目录部署
cd dist
vercel --prod

# 4. 绑定自定义域名（可选）
vercel domains add yourdomain.com
```

### 访问地址：
- 会获得类似：`https://your-project-name.vercel.app`
- 支持绑定自定义域名

## 🌐 方案二：Netlify 部署（推荐）

### 特点：
- ✅ 拖拽部署，零配置HTTPS
- ✅ 免费自定义域名
- ✅ 自动证书管理

### 部署步骤：
1. 访问：https://app.netlify.com/drop
2. 拖拽 `dist/` 文件夹到页面
3. 等待部署完成
4. 获得 `https://随机名称.netlify.app` 地址

### 自定义域名：
1. 在 Netlify Dashboard 点击 "Domain settings"
2. 添加自定义域名
3. 按提示配置DNS记录
4. SSL证书自动配置

## 📱 方案三：Cloudflare Pages

### 特点：
- ✅ 免费SSL证书
- ✅ 全球边缘网络
- ✅ 完美解决之前的Workers问题

### 部署步骤：
```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 创建 Pages 项目
wrangler pages project create libretv

# 4. 部署静态文件
wrangler pages deploy dist --project-name libretv
```

## 🔧 方案四：Let's Encrypt + 自有服务器

### 适用场景：
- 有自己的服务器或VPS
- 需要完全控制

### 证书申请：
```bash
# 安装 Certbot
sudo apt-get install certbot

# 申请证书（需要域名指向你的服务器）
sudo certbot certonly --standalone -d yourdomain.com

# 证书路径：
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem

# 自动续期
sudo crontab -e
# 添加：0 2 * * * certbot renew --quiet
```

### Node.js HTTPS 配置：
```javascript
// https-server.mjs
import https from 'https';
import fs from 'fs';
import express from 'express';

const app = express();

// SSL 证书配置
const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

// 你的应用逻辑
app.use(express.static('dist'));

// 启动 HTTPS 服务器
https.createServer(options, app).listen(443, () => {
  console.log('HTTPS 服务器运行在 https://yourdomain.com');
});

// HTTP 重定向到 HTTPS
app.listen(80, () => {
  app.use((req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
});
```

## 🎯 立即可用的解决方案

### 最快方式（2分钟内完成）：
1. **Netlify Drop**：访问 https://app.netlify.com/drop
2. **拖拽** `dist/` 文件夹
3. **获得** `https://xxx.netlify.app` 地址
4. **享受** 免费HTTPS访问！

### 自定义域名（5分钟内完成）：
1. 购买域名（推荐：Namecheap, Cloudflare）
2. 在Netlify/Vercel添加域名
3. 配置DNS记录
4. 自动获得SSL证书

## 🔐 安全增强配置

### HTTPS重定向：
```javascript
// 在 js/app.js 中添加
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace('https:' + window.location.href.substring(window.location.protocol.length));
}
```

### 安全头配置：
```javascript
// 在服务器端添加
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```