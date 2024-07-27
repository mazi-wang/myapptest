import { API } from '@/type';
import { request } from '@umijs/max';
import type { UserInfo } from './typings';

type LoginParams = {
  username?: string;
  password?: string;
};

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.Result<UserInfo>;
  }>('/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: LoginParams, options?: { [key: string]: any }) {
  return request<API.Result<boolean>>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
