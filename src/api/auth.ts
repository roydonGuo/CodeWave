import { apiRequest } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

// 后端通用响应结构（此处只列出关心的字段）
interface BaseApiResponse {
  msg: string;
  code: number;
}

interface LoginApiResponse extends BaseApiResponse {
  token?: string;
}

interface GetInfoApiResponse extends BaseApiResponse {
  user?: {
    userId: number;
    userName: string;
    nickName: string;
    email?: string;
  };
}

export interface LoginResult {
  token: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickName: string;
  email?: string;
}

export async function login(req: LoginRequest): Promise<LoginResult> {
  const res = await apiRequest<LoginApiResponse>('/login', {
    method: 'POST',
    body: req,
  });

  if (res.code !== 200 || !res.token) {
    throw new Error(res.msg || '登录失败');
  }

  return { token: res.token };
}

export async function getUserInfo(token: string): Promise<UserInfo> {
  const res = await apiRequest<GetInfoApiResponse>('/getInfo', {
    method: 'GET',
    token,
  });

  if (res.code !== 200 || !res.user) {
    throw new Error(res.msg || '获取用户信息失败');
  }

  const { user } = res;
  return {
    id: user.userId,
    username: user.userName,
    nickName: user.nickName,
    email: user.email,
  };
}

