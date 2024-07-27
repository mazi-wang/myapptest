import routes from '@/../config/routes';

type RouteKey = {
  key: string;
  title: string;
};

type RouteItem = RouteKey & { children?: RouteKey[] };

export const useRoute = routes;

/**
 * 获取侧边栏路由
 */
export const useSidebar = (): RouteItem[] => {
  const sideBarRoutes = routes.filter((route) => route.sideBar !== false);
  console.log(sideBarRoutes);

  function buildList(routes) {
    return routes.map((route) => {
      const item: RouteItem = {
        key: route.path,
        title: route.name,
      };
      if (route.routes) {
        item.children = buildList(route.routes);
      }
      return item;
    });
  }

  return buildList(sideBarRoutes);
};
