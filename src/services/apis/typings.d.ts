export type UserInfo = {
  userInfo: {
    /**
     * 员工ID
     */
    uid: string;
    /**
     * 真实名字
     */
    name: string;
    /**
     * 登录名称
     */
    username: string;
    /**
     * 性别
     */
    gender: number;
    /**
     * 年龄
     */
    age: number;
    /**
     * 头像地址
     */
    avatar: string;
  };
  role: {
    id: string;
    name: string;
  }[];
  permission: {
    accessMenu: string[];
    unAccessMenu: string[];
  };
};
