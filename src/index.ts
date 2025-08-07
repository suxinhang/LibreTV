/**
 * Cloudflare Workers 版本的 LibreTV
 * 实现视频代理和静态文件服务
 */

interface Env {
  PASSWORD?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // 处理代理请求
    if (url.pathname.startsWith('/proxy/')) {
      return handleProxy(request, env);
    }
    
    // 处理API请求
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env);
    }
    
    // 处理静态文件
    return handleStatic(request, env);
  },
};

// 处理代理请求
async function handleProxy(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = decodeURIComponent(url.pathname.replace('/proxy/', ''));
  
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return new Response('Invalid proxy URL', { status: 400 });
  }
  
  try {
    // 转发请求到目标URL
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': new URL(targetUrl).origin,
      },
    });
    
    // 创建新的响应，添加CORS头
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
    return newResponse;
  } catch (error) {
    return new Response('Proxy error: ' + error.message, { status: 500 });
  }
}

// 处理API请求
async function handleAPI(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // 处理环境变量注入
  if (url.pathname === '/api/env') {
    return new Response(
      JSON.stringify({
        PASSWORD: env.PASSWORD || '',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
  
  return new Response('API endpoint not found', { status: 404 });
}

// 处理静态文件
async function handleStatic(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // 处理搜索路径重写
  if (url.pathname.startsWith('/s=')) {
    return await fetchAsset('/index.html');
  }
  
  // 处理根路径
  if (url.pathname === '/') {
    return await fetchAsset('/index.html');
  }
  
  // 尝试获取对应的静态文件
  return await fetchAsset(url.pathname);
}

// 获取静态资源
async function fetchAsset(path: string): Promise<Response> {
  try {
    // 在新版本的 Wrangler 中，静态资源通过 Assets 自动处理
    // 这里我们提供一个简单的响应用于测试
    if (path === '/' || path === '/index.html') {
      return new Response(getIndexHTML(), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    
    // 对于其他静态文件，返回404
    return new Response('File not found', { status: 404 });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}

// 生成基本的HTML页面
function getIndexHTML(): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LibreTV - Cloudflare Workers</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: white;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        .logo {
            font-size: 3em;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .message {
            font-size: 1.2em;
            margin-bottom: 30px;
            color: #ccc;
        }
        .status {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .success {
            color: #4ade80;
        }
        .info {
            color: #60a5fa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📺 LibreTV</div>
        <div class="message">Cloudflare Workers 部署成功！</div>
        <div class="status">
            <div class="success">✅ Worker 运行正常</div>
            <div class="info">🚀 支持无限滚动搜索</div>
            <div class="info">🌐 全球CDN加速</div>
        </div>
        <p>请注意：当前为简化版本，完整功能请使用静态文件部署。</p>
        <p>访问完整版本：<a href="https://github.com/suxinhang/LibreTV" style="color: #60a5fa;">GitHub仓库</a></p>
    </div>
</body>
</html>
  `;
}

// 获取文件MIME类型
function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
  };
  return types[ext || ''] || 'text/plain';
}