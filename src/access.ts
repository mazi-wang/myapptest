import { UserInfo } from './services/apis/typings';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: UserInfo } | undefined) {
  const { currentUser } = initialState ?? {};
  // console.log('currentUser', currentUser);

  const menu: Record<string, boolean> = {};

  if (currentUser?.permission) {
    currentUser?.permission?.accessMenu?.forEach((item) => {
      menu[item] = true;
    });
    currentUser?.permission?.unAccessMenu?.forEach((item) => {
      menu[item] = false;
    });
  }

  return menu;
}
