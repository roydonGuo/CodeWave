import { API_BASE_URL } from '../config/api';

export class ApiError extends Error {
  status: number;
  body: unknown;
  code?: number;

  constructor(message: string, status: number, body: unknown, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.code = code;
  }
}

// 统一响应体格式
interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
  [key: string]: unknown;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 全局回调：用于处理 401/403 时弹出登录弹窗
let onAuthRequired: (() => void) | null = null;
export function setAuthRequiredHandler(handler: (() => void) | null) {
  onAuthRequired = handler;
}

// 全局回调：用于显示 toast
let showToastFn: ((message: string) => void) | null = null;
export function setShowToastHandler(handler: ((message: string) => void) | null) {
  showToastFn = handler;
}

export async function apiRequest<TResponse>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    token?: string | null;
    headers?: Record<string, string>;
  }
): Promise<TResponse> {
  const method = options?.method ?? 'GET';
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options?.headers ?? {}),
  };

  let body: string | undefined;
  if (options?.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    body = JSON.stringify(options.body);
  }

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body,
  });

  const text = await res.text();
  const parsed = text ? safeJsonParse(text) : null;

  // 尝试解析为统一响应格式
  const apiRes = parsed as ApiResponse<TResponse> | null;

  // 如果响应体有 code 字段，按业务码处理
  if (apiRes && typeof apiRes === 'object' && 'code' in apiRes) {
    const code = apiRes.code;
    const msg = apiRes.msg || '请求失败';

    // code === 200 表示成功
    if (code === 200) {
      // 返回 data 字段，如果没有 data 则返回整个响应体（兼容不同接口）
      return (apiRes.data ?? apiRes) as TResponse;
    }

    // 401: token 过期或未登录，弹出登录弹窗
    if (code === 401) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      // 不 throw，让调用方知道需要登录
      throw new ApiError(msg, res.status, apiRes, code);
    }

    // 403: 无权限，弹出登录弹窗
    if (code === 403) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      throw new ApiError(msg, res.status, apiRes, code);
    }

    // 500: 服务器错误，用 toast 显示 msg
    if (code === 500) {
      if (showToastFn) {
        showToastFn(msg);
      }
      // 不 throw Error，只显示 toast
      throw new ApiError(msg, res.status, apiRes, code);
    }

    // 其他 code 错误，抛出异常
    throw new ApiError(msg, res.status, apiRes, code);
  }

  // 如果没有 code 字段，按 HTTP 状态码处理
  if (!res.ok) {
    throw new ApiError(
      `请求失败：${res.status} ${res.statusText}`,
      res.status,
      parsed ?? text
    );
  }

  return (parsed as TResponse) ?? (null as TResponse);
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


