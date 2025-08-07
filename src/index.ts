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
    // 这里需要根据实际的静态文件处理方式调整
    // 在 Workers 中，通常需要将静态文件上传到 KV 或使用 Assets
    const asset = await fetch(`https://your-asset-domain.com${path}`);
    
    if (!asset.ok) {
      return new Response('File not found', { status: 404 });
    }
    
    return new Response(asset.body, {
      headers: {
        'Content-Type': getContentType(path),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
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