import { apiRequest } from './client';

// 作品接口响应结构
export interface PostListResponse {
  total: number;
  rows: Post[];
  code: number;
  msg: string;
}

export interface Post {
  id: number;
  title: string;
  content: string; // md格式内容
  userId: number;
  categoryId: number;
  createTime: string;
  updateTime: string;
}

// 获取作品列表请求参数
export interface PostListParams {
  pageNum: number;
  pageSize: number;
  categoryId?: number | null;
}

/**
 * 获取作品列表
 */
export async function getPostList(
  params: PostListParams,
  token: string | null
): Promise<{ total: number; rows: Post[] }> {
  const urlParams = new URLSearchParams({
    pageNum: params.pageNum.toString(),
    pageSize: params.pageSize.toString(),
  });
  
  // 只有当 categoryId 不为 null 时才添加参数
  if (params.categoryId !== null && params.categoryId !== undefined) {
    urlParams.append('categoryId', params.categoryId.toString());
  }
  
  const url = `/cw/post/myList?${urlParams.toString()}`;
  
  const res = await apiRequest<PostListResponse>(url, {
    method: 'GET',
    token,
  });

  if (res.code !== 200) {
    throw new Error(res.msg || '获取作品列表失败');
  }

  return {
    total: res.total || 0,
    rows: res.rows || [],
  };
}

