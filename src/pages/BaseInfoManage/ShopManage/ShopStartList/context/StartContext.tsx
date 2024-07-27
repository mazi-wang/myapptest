import {} from '@ant-design/pro-components';
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

// 定义 userStore 的类型
interface ListType {
  id: string;
  name: string;
}

interface StartListType<T> {
  userList?: T[];
  channelList?: T[];
  sellList?: T[];
}

interface UserStore extends StartListType<ListType> {
  date: string;
}

type UpdateUserStore = (newUserStore: Partial<UserStore>) => void;

const StartContext = createContext<{
  useStore: UserStore | undefined;
  updateUserStore: UpdateUserStore;
}>({
  useStore: undefined,
  updateUserStore: () => {
    throw new Error('updateUserStore function must be overridden');
  },
});

interface StartProviderProps {
  children: ReactNode;
}

const PAGE_SIZE = 100;

// * Provider
const StartProvider: FC<StartProviderProps> = ({ children }) => {
  const [useStore, setUseStore] = useState<UserStore | undefined>(undefined);

  const updateUserStore = (newUseStore: Partial<UserStore>) => {
    setUseStore((prevUseStore) => ({
      ...prevUseStore,
      ...newUseStore,
      date: newUseStore.date || prevUseStore?.date || new Date().toISOString(),
    }));
  };

  return (
    <StartContext.Provider value={{ useStore, updateUserStore }}>
      <>{children}</>
    </StartContext.Provider>
  );
};

function useStartContext() {
  const context = useContext(StartContext);
  if (!context) {
    throw new Error('useStartContext 必须在 StartProvider 中使用');
  }
  return context;
}

export { StartProvider, useStartContext };
