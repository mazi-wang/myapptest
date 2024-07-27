import { history } from '@@/core/history';
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { currentUser } from './services/apis/user';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// 请求头中的token的key
const TOKEN_KEY_IN_REQ_HEADER = 'Authorization';
// 请求头中的token前缀
const TOKEN_PREFIX_IN_HEADER = 'Bearer ';
// 响应头中的access_token的key
const ACCESS_TOKEN_KEY_IN_RESP_HEADER = 'x-access-token';
// 响应头中的refresh_token的key
const REFRESH_TOKEN_KEY_IN_RESP_HEADER = 'x-refresh-token';

// 本地存储accessToken的key
const LOC_ACCESS_TOKEN_KEY = 'YANG_ACCESS_TOKEN';
// 本地存储refreshToken的key
const LOC_REFRESH_TOKEN_KEY = 'YANG_REFRESH_TOKEN';
// 本地存储接口更新版本
const LOC_INTER_UPDATE_VERSION = 'LOC_INTER_UPDATE_VERSION';
// 本地存储接口列表的key
const LOC_INTER_LIST_KEY = 'INTER_LIST';
// 本地存储接口列表的缓存时间
const LOC_INTER_LIST_TIME = 1000 * 60 * 60 * 24 * 7;

const WHITE_LIST = ['/api/user/login'];

export enum LoginErrorEnum {
  INVALID_TOKEN = 10102,
  NON_LOGIN = 10103,
  NON_AUTHORIZATION = 403,
}

function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// 是否在刷新token
let isRefreshToken = false;

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url;

      console.log(config);

      //   console.log("请求地址：", url)
      if (url && !WHITE_LIST.includes(url)) {
        const token = localStorage.getItem(LOC_ACCESS_TOKEN_KEY);
        if (token && token !== 'undefined') {
          config.headers = {
            ...config.headers,
            [TOKEN_KEY_IN_REQ_HEADER]: TOKEN_PREFIX_IN_HEADER + token,
          };
        }
      }

      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      const { headers } = response;
      const contentType = headers['content-type'];

      const result = response.data;

      if (
        contentType &&
        contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      ) {
        const blob = response.blob();
        const contentDisposition = headers['content-disposition'];
        let filename = 'download.xlsx';

        if (contentDisposition) {
          const matches = /filename="(.+)"/.exec(contentDisposition);
          if (matches && matches[1]) {
            filename = decodeURIComponent(matches[1]);
          }
        }

        downloadFile(blob, filename);
        return response;
      }

      switch (result.code) {
        case LoginErrorEnum.INVALID_TOKEN: {
          //   console.log("刷新token")
          const refreshToken = localStorage.getItem(LOC_REFRESH_TOKEN_KEY);
          if (refreshToken) {
            if (!isRefreshToken) {
              isRefreshToken = true;

              localStorage.setItem(LOC_ACCESS_TOKEN_KEY, refreshToken);
              async function refreshResult() {
                const res = await currentUser();
                if (!res.data) return history.push('/login');

                isRefreshToken = false;
              }
              refreshResult();

              return refreshResult;
            }
          } else {
            return history.push('/login');
          }
        }
        case LoginErrorEnum.NON_AUTHORIZATION: {
          return history.push('/403');
        }
        case LoginErrorEnum.NON_LOGIN: {
          return history.push('/login');
        }
        default: {
          //   console.log("location: ", location)
          if (headers[ACCESS_TOKEN_KEY_IN_RESP_HEADER]) {
            const access_token = headers[ACCESS_TOKEN_KEY_IN_RESP_HEADER]?.replace(
              TOKEN_PREFIX_IN_HEADER,
              '',
            );
            const refresh_token = headers[REFRESH_TOKEN_KEY_IN_RESP_HEADER]?.replace(
              TOKEN_PREFIX_IN_HEADER,
              '',
            );
            if (typeof access_token === 'string') {
              localStorage.setItem(LOC_ACCESS_TOKEN_KEY, access_token);
            }
            if (typeof refresh_token === 'string') {
              localStorage.setItem(LOC_REFRESH_TOKEN_KEY, refresh_token);
            }
          }

          return response;
        }
      }
    },
  ],
};
