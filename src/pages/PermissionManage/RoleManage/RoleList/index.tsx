import { listRole } from '@/apis/role';
import type { RoleListReq } from '@/apis/types/role';
import { clearInterfaceCache } from '@/cache/interface';
import type { Role } from '@/entity';
import type { PageReq } from '@/type';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import RoleAddDefaultModal from './components/RoleAddDefaultModal';
import RoleAddModal from './components/RoleAddModal';
import RoleEditModal from './components/RoleEditModal';
import RoleInterfaceModal from './components/RoleInterfaceModal';
import RoleMenuModal from './components/RoleMenuModal';
import { columns } from './config';

export default () => {
  const [list, setList] = useState<Role[]>([]);
  const actionRef = useRef<ActionType>();
  const [editConfig, setEditConfig] = useState<{
    id: string | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const [checkedInterfaceRoleId, setCheckedInterfaceRoleId] = useState<number>(-1);
  const [checkedMenuRoleId, setCheckedMenuRoleId] = useState<number>(-1);
  const [interfaceDrawOpen, setInterfaceDrawOpen] = useState<boolean>(false);
  const [addDrawOpen, setAddDrawOpen] = useState<boolean>(false);
  const [addDefaultOpen, setAddDefaultOpen] = useState<boolean>(false);
  const [menuDrawOpen, setMenuDrawOpen] = useState<boolean>(false);

  const { location } = history;

  const showInterfaceDrawer = (roleId: number) => {
    setInterfaceDrawOpen(true);
    setCheckedInterfaceRoleId(roleId);
  };

  const onInterfaceClose = () => {
    setInterfaceDrawOpen(false);
  };

  const showMenuDrawer = (roleId: number) => {
    setMenuDrawOpen(true);
    setCheckedMenuRoleId(roleId);
  };

  const onMenuClose = () => {
    setMenuDrawOpen(false);
  };

  console.log(editConfig.id);

  const editingItem = list.find((role) => role.id === (editConfig.id as string)) ?? {};

  const handleRequest = async (params, sort, filter) => {
    console.log(params, sort, filter);
    const pageReq: PageReq<RoleListReq> = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id,
        name: params.name,
        gmtCreatedTime: {
          range: {
            min: params.createdStart,
            max: params.createdEnd,
          },
          sort: sort.gmtCreatedTime ? (sort.gmtCreatedTime === 'ascend' ? 0 : 1) : undefined,
        },
        gmtLastModifiedTime: {
          range: {
            min: params.modifiedStart,
            max: params.modifiedEnd,
          },
          sort: sort.gmtLastModifiedTime
            ? sort.gmtLastModifiedTime === 'ascend'
              ? 0
              : 1
            : undefined,
        },
        isDeleted:
          filter.isDeleted instanceof Array
            ? filter.isDeleted
            : filter.isDeleted
              ? [filter.isDeleted]
              : undefined,
      },
    };
    console.log('获取角色列表参数： ', pageReq);
    const result = await listRole(pageReq);
    console.log('result:', result);
    if (result.data) {
      setList(result.data.data);
      return result.data;
    } else {
      return {
        current: 0,
        pageSize: 10,
        data: [],
      };
    }
  };

  /**
   * 新建角色的回调
   */
  const onAddRoleFinish = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <>
        <ProTable<Role>
          form={{ initialValues: location.query }}
          columns={columns(editConfig, setEditConfig, showInterfaceDrawer, showMenuDrawer)}
          actionRef={actionRef}
          cardBordered
          scroll={{ x: 1300 }}
          request={handleRequest}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true },
            },
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          rowKey="id"
          search={false}
          pagination={{
            pageSize: 99999,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="角色列表"
          toolBarRender={() => [
            <Button
              key="add"
              onClick={() => {
                clearInterfaceCache();
                message.success('清除成功');
              }}
              danger
            >
              清除接口缓存（如果出现接口不存在，请按下此按钮）
            </Button>,
            <Button
              key="new"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddDrawOpen(true);
              }}
              type="primary"
            >
              新建
            </Button>,
            <Button
              key="button"
              icon={<SettingOutlined />}
              onClick={() => {
                setAddDefaultOpen(true);
              }}
              type="primary"
            >
              设置角色新增默认值
            </Button>,
          ]}
        />
      </>
      {editConfig && <RoleEditModal config={{ editConfig, setEditConfig }} item={editingItem} />}
      {addDrawOpen && (
        <RoleAddModal open={addDrawOpen} setOpen={setAddDrawOpen} onFinish={onAddRoleFinish} />
      )}
      {addDefaultOpen && <RoleAddDefaultModal open={addDefaultOpen} setOpen={setAddDefaultOpen} />}
      <RoleInterfaceModal
        open={interfaceDrawOpen}
        setOpen={setInterfaceDrawOpen}
        onClose={onInterfaceClose}
        roleId={checkedInterfaceRoleId}
      />
      {menuDrawOpen && (
        <RoleMenuModal
          open={menuDrawOpen}
          setOpen={setMenuDrawOpen}
          onClose={onMenuClose}
          roleId={checkedMenuRoleId}
        />
      )}
    </>
  );
};
