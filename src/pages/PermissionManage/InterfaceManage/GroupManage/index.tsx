import { addInterfaceGroup, delInterfaceGroup, listInterfaceGroup } from '@/apis/interface-group';
import { getInterfaceList } from '@/cache/interface';
import type { Interface } from '@/entity';
import GroupEditModal from '@/pages/PermissionManage/InterfaceManage/GroupManage/components/GroupEditModal';
import { DeleteTwoTone, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import {} from '@ant-design/pro-components';
import { Button, Checkbox, Collapse, Empty, Input, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

type RouteKey = {
  key: string;
  title: string;
};

type RouteItem = RouteKey & { children?: RouteKey[] };

const { Panel } = Collapse;

const Container = styled.div`
  display: flex;
  background: #fff;
  border-radius: 5px;

  .form {
    width: 50%;
    padding: 10px;
    border-right: 1px solid #ccc;

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 10px 0;
      row-gap: 10px;
    }
  }

  .show {
    width: 50%;
    padding: 10px;

    .title {
      margin-bottom: 0;
    }
  }
`;

const IconContainer = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 5px;
  transition: all 0.3s;

  &:hover {
    background-color: #ccc;
  }
`;

export default function GroupManage() {
  const [groupName, setGroupName] = useState<string>('');
  const [interfaceList, setInterfaceList] = useState<{ label: string; value: string }[]>([]);
  const [interfaceCheckedList, setInterfaceCheckedList] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<
    { key: string; title: string; children: Interface[] }[]
  >([]);
  const [editConfig, setEditConfig] = useState<{
    id: string | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const editingItem = groupList.find((group) => group.key === (editConfig.id as string)) ?? {};

  const onGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const onInterfaceChange = (list) => {
    console.log(list);
    setInterfaceCheckedList(list);
  };

  const reset = () => {
    setGroupName('');
    setInterfaceCheckedList([]);
  };

  const confirmAdd = async () => {
    if (!groupName.trim()) {
      return message.error('请输入分组名称');
    }
    if (!interfaceCheckedList.length) {
      return message.error('接口列表不能为空');
    }
    const result = await addInterfaceGroup({
      name: groupName,
      idList: interfaceCheckedList,
    });
    if (result.data) {
      message.success(result.message);
      reset();
      getInterfaceGroup();
    }
  };

  const getInterfaceGroup = async function () {
    const result = await listInterfaceGroup();
    if (result.data) {
      const interResult = await getInterfaceList([]);
      console.log('分组：', result.data);

      const groupInterfaceList = result.data.groupList.map((group) => {
        const item: RouteItem = {
          key: group.id,
          title: group.name,
        };
        item.children = interResult.list.filter((inter) => group.idList.includes(inter.id));
        return item;
      });
      console.log('处理后的树形分组结构：', groupInterfaceList);
      setGroupList(groupInterfaceList);
    }
  };

  useEffect(() => {
    (async function () {
      const result = await getInterfaceList([]);
      console.log('接口列表：', result.list);
      if (result.list) {
        setInterfaceList(
          result.list.map((inter) => ({
            label: inter.name + '-' + inter.path,
            value: inter.id,
          })),
        );
      }
    })();
  }, []);

  useEffect(() => {
    getInterfaceGroup();
  }, []);

  return (
    <>
      <Container>
        <div className="form">
          <h1 className="title">新增分组</h1>
          <Input placeholder="请输入分组名字" value={groupName} onChange={onGroupNameChange} />
          <Checkbox.Group
            options={interfaceList}
            value={interfaceCheckedList}
            onChange={onInterfaceChange}
            className="checkbox-group"
          />
          <Button onClick={confirmAdd} type="primary">
            确认
          </Button>
          <Button onClick={reset} style={{ marginLeft: '10px' }}>
            重置
          </Button>
        </div>
        <div className="show">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>分组列表</h1>
            {groupList.length ? (
              <ReloadOutlined style={{ cursor: 'pointer' }} onClick={getInterfaceGroup} />
            ) : undefined}
          </div>
          {groupList.length ? (
            <Collapse>
              {groupList.map((group) => {
                const confirm = async (e, id: string) => {
                  e.stopPropagation();
                  console.log('删除分组：', id);
                  const result = await delInterfaceGroup(id);
                  if (result.data) {
                    message.success(result.message);
                    getInterfaceGroup();
                  }
                };
                return (
                  <Panel
                    header={group.title}
                    key={group.key}
                    extra={
                      <div className="flex-center">
                        <IconContainer
                          className="flex-center"
                          onClick={() => {
                            setEditConfig({
                              ...editConfig,
                              isOpen: true,
                              id: group.key,
                            });
                          }}
                        >
                          <EditOutlined />
                        </IconContainer>
                        <Popconfirm
                          placement="top"
                          title="是否删除此分组"
                          onConfirm={(e) => confirm(e, group.key)}
                          okText="确认"
                          cancelText="取消"
                        >
                          <IconContainer className="flex-center">
                            <DeleteTwoTone />
                          </IconContainer>
                        </Popconfirm>
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        rowGap: 10,
                      }}
                    >
                      {group.children.map((inter) => (
                        <div>{inter.name + '-' + inter.path}</div>
                      ))}
                    </div>
                  </Panel>
                );
              })}
            </Collapse>
          ) : (
            <Empty
              description="暂未分组"
              className="flex-center"
              style={{
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                fontSize: '17px',
              }}
            />
          )}
        </div>
      </Container>
      {editConfig.isOpen && (
        <GroupEditModal config={{ editConfig, setEditConfig }} item={editingItem} />
      )}
    </>
  );
}
