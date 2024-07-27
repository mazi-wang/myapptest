import { listInterfaceDefault, updateInterfaceDefault } from '@/apis/interface';
import { listMenuDefault, updateMenuDefault } from '@/apis/menu';
import { getInterfaceList } from '@/cache/interface';
import { useSidebar } from '@/hooks/useSidebar';
import type { TreeDataNode } from 'antd';
import { Button, Checkbox, Collapse, message, Modal, Tree } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import routes from '../../../../../../config/routes';

type Props = {
  open: boolean;
  setOpen: (isOpenDrawer: boolean) => void;
};

const { Panel } = Collapse;

const RoleAddDefaultModal = (props: Props) => {
  const [interfaceListTreeData, setInterfaceListTreeData] = useState<CheckboxValueType[]>([]);
  const [menuListTreeData, setMenuListTreeData] = useState<TreeDataNode[]>([]);
  const [checkedInterfaceKeys, setCheckedInterfaceKeys] = useState<React.Key[]>([]);
  const [checkedMenuKeys, setCheckedMenuKeys] = useState<React.Key[]>([]);

  /**
   * 接口选中记录
   * @param checkedKeysValue
   */
  const onInterfaceCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onInterfaceCheck', checkedKeysValue);
    setCheckedInterfaceKeys(checkedKeysValue);
  };

  /**
   * 菜单选中记录
   * @param checkedKeysValue
   */
  const onMenuCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onMenuCheck', checkedKeysValue);
    setCheckedMenuKeys(checkedKeysValue);
  };

  /**
   * 确认增加
   */
  const confirmAdd = async () => {
    // 增加角色
    console.log('checkedInterfaceKeys: ', checkedInterfaceKeys);
    console.log('checkedMenuKeys: ', checkedMenuKeys);
    // 1. 更新默认接口
    const interResult = await updateInterfaceDefault(checkedInterfaceKeys as string[]);
    if (interResult.data) {
      message.success('更新默认接口成功');
    }
    // 2. 更新默认菜单
    const menuResult = await updateMenuDefault(checkedMenuKeys as string[]);
    if (menuResult.data) {
      message.success('更新默认菜单成功');
    }
    props.setOpen(false);
  };

  useEffect(() => {
    // 初始化接口列表
    (async function () {
      // 获取接口默认值列表
      const idResult = await listInterfaceDefault();
      console.log('接口ID列表为：', idResult.data);
      if (idResult.data) {
        // 设置接口默认值
        setCheckedInterfaceKeys(idResult.data);
        const interfaceListResult = await getInterfaceList(idResult.data);
        console.log('过滤前的数据：', interfaceListResult.list);
        // 数据转换
        const data: TreeDataNode[] = interfaceListResult.list.map((inter) => {
          return {
            key: inter.id,
            value: inter.id,
            label: inter.name,
          } as TreeDataNode;
        });
        console.log('过滤后的数据：', data);
        setInterfaceListTreeData(data);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const result = await listMenuDefault();
      if (result.data) {
        // 设置菜单默认值
        setCheckedMenuKeys(result.data);
        console.log(routes);
        console.log('菜单path列表为：', result.data);
        const list = useSidebar();
        console.log(list);
        setMenuListTreeData(list);
      }
    })();
  }, []);

  return (
    <>
      <Modal
        width={800}
        open={props.open}
        title="更新新增角色默认值"
        onOk={() => {
          props.setOpen(false);
        }}
        onCancel={() => {
          props.setOpen(false);
        }}
        footer={
          <>
            <Button type="primary" onClick={confirmAdd}>
              确认增加
            </Button>
            <Button
              onClick={() => {
                props.setOpen(false);
              }}
              style={{ marginLeft: '10px' }}
            >
              取消增加
            </Button>
          </>
        }
      >
        <Collapse accordion>
          <Panel header="菜单权限" key="menu">
            <Tree
              checkable
              onCheck={onMenuCheck}
              checkedKeys={checkedMenuKeys}
              treeData={menuListTreeData}
            />
          </Panel>
          <Panel header="接口权限" key="interface">
            <Checkbox.Group
              checkable
              onChange={onInterfaceCheck}
              value={checkedInterfaceKeys}
              options={interfaceListTreeData}
              style={{
                display: 'grid',
                gridRowGap: 5,
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            />
          </Panel>
        </Collapse>
      </Modal>
    </>
  );
};

export default RoleAddDefaultModal;
