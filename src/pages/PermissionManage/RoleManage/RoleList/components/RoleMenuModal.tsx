import { getMenuByRoleId } from '@/apis/menu';
import { modifyRoleMenu } from '@/apis/role';
import { useSidebar } from '@/hooks/useSidebar';
import type { TreeDataNode } from 'antd';
import { Button, Drawer, message, Modal, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import routes from '../../../../../../config/routes';

type Props = {
  onClose: () => void;
  open: boolean;
  roleId: number;
  setOpen: (isOpenDrawer: boolean) => void;
};

const RoleMenuModal = (props: Props) => {
  const [menuListTreeData, setMenuListTreeData] = useState<TreeDataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [isOpenModifyConfirm, setIsOpenModifyConfirm] = useState<boolean>(false);

  /**
   * 修改数据
   */
  const modify = async () => {
    // 修改角色菜单权限
    message.loading('修改中...');
    const result = await modifyRoleMenu(props.roleId, checkedKeys as string[]);
    message.destroy();
    if (result.data) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onClose = async () => {
    // 判断值是否被更改过
    console.log('checkedKeys: ', checkedKeys);
    props.setOpen(false);
  };

  /**
   * 确认修改
   */
  const confirmModify = () => {
    modify();
    setIsOpenModifyConfirm(false);
    // 关闭抽屉
    props.setOpen(false);
  };

  useEffect(() => {
    (async function () {
      // 清空选中的
      setCheckedKeys([]);
      const result = await getMenuByRoleId(props.roleId);
      /**
       * "/sku/list",
       * "/sku/add",
       * "/pallet/list",
       * "/pallet/add",
       * "/log/list",
       * "/user/add",
       * "/user/list",
       * "/operator",
       * "/supplier",
       * "/dashboard",
       * "/statistic",
       * "/statistic/overall-data-report",
       * "/statistic/product-rating-report",
       * "/sku",
       * "/sku/sku-type-list",
       * "/pallet",
       * "/anime",
       * "/anime/list",
       * "/log",
       * "/user",
       * "/permission",
       * "/permission/role",
       * "/personal",
       * "/permission/role/list"
       */
      if (result.data) {
        console.log(routes);
        console.log('菜单path列表为：', result.data);
        const list = useSidebar();
        console.log(list);
        setMenuListTreeData(list);
        setCheckedKeys(result.data);
      }
    })();
  }, [props.roleId]);

  return (
    <>
      <Drawer
        title="菜单权限"
        onClose={onClose}
        open={props.open}
        footer={
          <>
            <Button type="primary" onClick={confirmModify}>
              确认修改
            </Button>
            <Button
              onClick={() => {
                props.setOpen(false);
              }}
              style={{ 'margin-left': '10px' }}
            >
              取消修改
            </Button>
            <div style={{ 'margin-top': '10px' }}>Tips: 名称-路径</div>
          </>
        }
      >
        <Tree checkable onCheck={onCheck} checkedKeys={checkedKeys} treeData={menuListTreeData} />
      </Drawer>
      <Modal
        open={isOpenModifyConfirm}
        title="警告"
        onOk={() => {
          setIsOpenModifyConfirm(false);
          // 关闭抽屉
          props.setOpen(false);
        }}
        onCancel={() => setIsOpenModifyConfirm(false)}
        footer={
          <>
            <Button
              type="primary"
              onClick={() => {
                setIsOpenModifyConfirm(false);
                // 关闭抽屉
                props.setOpen(false);
              }}
            >
              确认关闭
            </Button>
            <Button
              onClick={() => {
                setIsOpenModifyConfirm(false);
                props.setOpen(false);
              }}
              style={{ 'margin-left': '10px' }}
            >
              取消
            </Button>
          </>
        }
      >
        您的修改将不会被更改，确定吗？
      </Modal>
    </>
  );
};

export default RoleMenuModal;
