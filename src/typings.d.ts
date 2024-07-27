declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module 'mockjs';
declare module 'react-fittext';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

// 请求头中的token的key
declare const TOKEN_KEY_IN_REQ_HEADER = 'Authorization';
// 请求头中的token前缀
declare const TOKEN_PREFIX_IN_HEADER = 'Bearer ';
// 响应头中的access_token的key
declare const ACCESS_TOKEN_KEY_IN_RESP_HEADER = 'x-access-token';
// 响应头中的refresh_token的key
declare const REFRESH_TOKEN_KEY_IN_RESP_HEADER = 'x-refresh-token';

// 本地存储accessToken的key
declare const LOC_ACCESS_TOKEN_KEY = 'YANG_ACCESS_TOKEN';
// 本地存储refreshToken的key
declare const LOC_REFRESH_TOKEN_KEY = 'YANG_REFRESH_TOKEN';
// 本地存储接口更新版本
declare const LOC_INTER_UPDATE_VERSION = 'LOC_INTER_UPDATE_VERSION';
// 本地存储接口列表的key
declare const LOC_INTER_LIST_KEY = 'INTER_LIST';
// 本地存储接口列表的缓存时间
declare const LOC_INTER_LIST_TIME = 1000 * 60 * 60 * 24 * 7;
