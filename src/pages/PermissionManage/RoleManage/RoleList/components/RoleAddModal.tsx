import { listInterfaceDefault } from '@/apis/interface';
import { listInterfaceGroup } from '@/apis/interface-group';
import { listMenuDefault } from '@/apis/menu';
import { addRole } from '@/apis/role';
import { getInterfaceList } from '@/cache/interface';
import { ProFormText } from '@ant-design/pro-components';
import type { TreeDataNode } from 'antd';
import { Button, Checkbox, Collapse, message, Modal, Tree } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import routes from '../../../../../../config/routes';

type Props = {
  open: boolean;
  setOpen: (isOpenDrawer: boolean) => void;
  onFinish: () => void;
};

const GroupTableItem = styled.div`
  width: 100%;
  border: 1px solid #ccc;

  .group-name {
    height: 60px;
    font-size: 16px;
    background-color: #f5f5f5;

    .title {
      margin-right: 5px;
    }
  }

  .interface-checkbox {
    height: 300px;
    padding: 10px;
    overflow-y: auto;
    scrollbar-width: none;
  }
`;

const { Panel } = Collapse;

const RoleAddModal = (props: Props) => {
  const [roleName, setRoleName] = useState<string>('');
  const [groupList, setGroupList] = useState<
    {
      value: string;
      label: string;
      children: {
        value: string;
        label: string;
      }[];
      idList: string[];
    }[]
  >([]);
  const [menuListTreeData, setMenuListTreeData] = useState<TreeDataNode[]>([]);
  const [checkedInterfaceKeys, setCheckedInterfaceKeys] = useState<React.Key[]>([]);
  const [checkedMenuKeys, setCheckedMenuKeys] = useState<React.Key[]>([]);

  /**
   * 接口选中记录
   * @param checkedKeysValue
   */
  const onInterfaceCheck = (checkedKeysValue: React.Key[], key: string) => {
    console.log('onInterfaceCheck', checkedKeysValue, key);
    // 去除当前分组
    const checkedKeysValueFilter = groupList.find((inter) => inter.value === key)?.idList;
    const filterIdList = checkedInterfaceKeys.filter((id) => !checkedKeysValueFilter?.includes(id));
    setCheckedInterfaceKeys([...new Set([...filterIdList, ...checkedKeysValue])]);
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
    if (!roleName || roleName.length === 0) {
      return message.error('角色名不能为空');
    }
    if (checkedInterfaceKeys.length === 0) {
      return message.error('接口列表不能为空');
    }
    if (checkedMenuKeys.length === 0) {
      return message.error('菜单列表不能为空');
    }
    const result = await addRole({
      name: roleName,
      pathList: checkedMenuKeys as string[],
      interfaceIdList: checkedInterfaceKeys as string[],
    });
    if (result.data) {
      message.success('增加角色成功');
      // 关闭抽屉
      props.setOpen(false);
      props.onFinish();
    }
  };

  useEffect(() => {
    // 初始化接口列表
    // const [interfaceListTreeData, setInterfaceListTreeData] = useState<TreeDataNode[]>([])
    // ;(async function () {
    //     // 获取接口默认值列表
    //     const idResult = await listInterfaceDefault()
    //     console.log("接口ID列表为：", idResult.data)
    //     if (idResult.data) {
    //         // 设置接口默认值
    //         setCheckedInterfaceKeys(idResult.data)
    //         const interfaceListResult = await getInterfaceList(idResult.data)
    //         // 数据转换  名称+路径+方法+是否是权限路径
    //         const data: { title: string; key: string }[] = interfaceListResult.list.map((inter) => {
    //             return {
    //                 key: inter.id,
    //                 title: inter.name,
    //             }
    //         })
    //         console.log("过滤后的数据：", data)
    //         setInterfaceListTreeData(data)
    //     }
    // })()
    (async function () {
      const result = await listInterfaceGroup();
      if (result.data) {
        // 获取接口默认值列表
        const idResult = await listInterfaceDefault();
        // 设置接口默认值
        setCheckedInterfaceKeys(idResult.data);
        const interResult = await getInterfaceList([]);
        // 获取所有接口的编号
        const allIdList = interResult.list.map((inter) => inter.id);
        const idSet = new Set();
        const groupInterfaceList = result.data.groupList.map((group) => {
          group.idList.forEach((id) => idSet.add(id));
          return {
            value: group.id,
            label: group.name,
            idList: group.idList,
            children: interResult.list
              .filter((inter) => group.idList.includes(inter.id))
              .map((inter) => ({
                value: inter.id,
                label: inter.name + '-' + inter.path,
              })),
          };
        });
        console.log('处理后的树形分组结构：', groupInterfaceList);
        console.log('已分组的接口：', idSet);
        const ungroupIdList = allIdList.filter((id) => !idSet.has(id));
        console.log('未分组的接口：', ungroupIdList);
        // 判断是否有未分组列表
        if (ungroupIdList.length) {
          groupInterfaceList.push({
            value: 'ungroup',
            label: '未分组',
            idList: ungroupIdList,
            children: interResult.list
              .filter((inter) => ungroupIdList.includes(inter.id))
              .map((inter) => ({
                value: inter.id,
                label: inter.name + '-' + inter.path,
              })),
          });
        }
        setGroupList(groupInterfaceList);
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
        console.log('菜单列表为：', result.data);
        const sideBarRoutes = routes.filter((route) => route.sideBar !== false);
        setCheckedMenuKeys(result.data);
        console.log(sideBarRoutes);

        function buildList(routes) {
          return routes.map((route) => {
            const item = {
              key: route.path,
              title: route.name,
            };
            if (route.routes) {
              item.children = buildList(route.routes);
            }
            return item;
          });
        }

        const list = buildList(sideBarRoutes);
        console.log(list);
        setMenuListTreeData(list);
      }
    })();
  }, []);

  const onCheckAllChange = (e: CheckboxChangeEvent, key: string) => {
    // 获取该分组的ID列表
    const idList = groupList.find((group) => group.value === key)?.idList;
    if (e.target.checked) {
      setCheckedInterfaceKeys((prevState) => [...new Set([...prevState, ...idList])]);
    } else {
      setCheckedInterfaceKeys((prevState) => prevState.filter((id) => !idList?.includes(id)));
    }
  };

  return (
    <>
      <Modal
        width={900}
        open={props.open}
        title="新建角色信息"
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
        <ProFormText
          name="name"
          width="md"
          label="角色名称"
          fieldProps={{
            value: roleName,
            onChange: (e) => {
              setRoleName(e.target.value);
            },
          }}
          rules={[
            {
              required: true,
              message: '请输入角色名称',
            },
          ]}
        />
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {groupList.map((group) => {
                const isCheckedAll =
                  new Set(group.idList.concat(checkedInterfaceKeys)).size ===
                  checkedInterfaceKeys.length;
                return (
                  <GroupTableItem key={group.value}>
                    <div className="group-name flex-center">
                      <span className="title">{group.label}</span>
                      <Checkbox
                        onChange={(e) => onCheckAllChange(e, group.value)}
                        checked={isCheckedAll}
                        key={group.value}
                      />
                    </div>
                    <div className="interface-checkbox">
                      <Checkbox.Group
                        checkable
                        onChange={(e) => onInterfaceCheck(e, group.value)}
                        value={checkedInterfaceKeys}
                        options={group.children}
                      />
                    </div>
                  </GroupTableItem>
                );
              })}
            </div>
          </Panel>
        </Collapse>
      </Modal>
    </>
  );
};

export default RoleAddModal;
