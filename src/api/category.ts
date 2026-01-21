import { apiRequest } from './client';

// 分类接口响应结构
export interface CategoryListResponse {
  total: number;
  rows: Category[];
  code: number;
  msg: string;
}

export interface Category {
  id: number;
  name: string;
}

// 添加分类请求
export interface AddCategoryRequest {
  name: string;
}

// 添加分类响应
export interface AddCategoryResponse {
  code: number;
  msg: string;
}

/**
 * 获取分类列表
 */
export async function getCategoryList(token: string | null): Promise<Category[]> {
  // GET 请求参数通过 URL 传递
  const params = new URLSearchParams({
    pageNum: '1',
    pageSize: '99',
  });
  const url = `/cw/postCategory/myList?${params.toString()}`;
  
  const res = await apiRequest<CategoryListResponse>(url, {
    method: 'GET',
    token,
  });

  if (res.code !== 200) {
    throw new Error(res.msg || '获取分类列表失败');
  }

  return res.rows || [];
}

/**
 * 添加分类
 * @returns 如果成功（code === 200），返回 void
 * @throws 如果失败（code !== 200），抛出错误
 */
export async function addCategory(
  req: AddCategoryRequest,
  token: string | null
): Promise<void> {
  const res = await apiRequest<AddCategoryResponse>('/cw/postCategory/mySave', {
    method: 'POST',
    body: req,
    token,
  });

  // 只有当 code === 200 时才视为成功
  if (res.code !== 200) {
    throw new Error(res.msg || '添加分类失败');
  }

  // 成功时不需要返回数据，因为响应中没有 data 字段
}

