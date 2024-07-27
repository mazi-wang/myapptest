import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Divider, Input, InputRef, message, Popconfirm, Select, Space } from 'antd';
import type { Dispatch, SetStateAction } from 'react';
import { useRef, useState } from 'react';

import { MyFormSelect, switchSelectFetchDebounce } from '@/components/FormSelect';
import MyModalForm from '@/components/ModalForm';
import { ShopModifyModal } from './components/ShopModifyModal';

import { addSellDitchListAPI, addSellListAPI, delSellListAPI, getSellListAPI } from '@/apis/shop';
import { PlusOutlined } from '@ant-design/icons';

export type Status = {
  color: string;
  text: string;
};

export type TableListItem = {
  name: string;
  id: string;
};

const columns: (
  setModifyConfig: Dispatch<SetStateAction<ModifyConfigProps>>,
) => ProColumns<TableListItem>[] = (setModifyConfig) => [
  {
    title: '选择平台',
    dataIndex: 'id',
    key: 'id',
    copyable: true,
    valueType: 'select',
    request: async (params) => switchSelectFetchDebounce('sell', params.keyWords),
    fieldProps: {
      showSearch: true,
      filterOption: false,
    },
    width: 80,
    hideInTable: true,
  },
  {
    title: '平台名称',
    width: 120,
    dataIndex: 'name',
    hideInSearch: true,
    render: (_) => <a>{_}</a>,
  },
  {
    title: '操作',
    valueType: 'option',
    width: 120,
    render: (dom, record, _, action) => [
      <Button
        key="modifyStore"
        type="primary"
        size={'small'}
        onClick={() => {
          setModifyConfig((modifyConfig) => ({
            ...modifyConfig,
            id: record.id,
            isOpen: true,
          }));
        }}
      >
        修改平台
      </Button>,
      <Popconfirm
        title="删除"
        key="delete"
        onConfirm={async () => {
          const result = await delSellListAPI(record.id);
          if (result.code === 200) {
            message.success(result.message);
            action?.reload();
          }
        }}
        okText="是的"
        cancelText="取消"
      >
        <Button size={'small'} type="danger">
          删除
        </Button>
      </Popconfirm>,
    ],
  },
];

interface ModifyConfigProps {
  id: string | null;
  isOpen: boolean;
  isLoading: boolean;
}

const NestedTable = () => {
  const [tableListDataSource, setTableListDataSource] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [modifyConfig, setModifyConfig] = useState<ModifyConfigProps>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const actionRef = useRef<ActionType>();

  const handleRequest = async (params, sorter, filter) => {
    const pageReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id as string,
        name: params.name as string,
      },
    };
    // const res = await listStoreAPI(pageReq)

    const res = await getSellListAPI(pageReq);
    if (res.data) {
      setTableListDataSource(res.data.data);
      // 每次外层表格数据更新时，更新 refreshKey 以触发内层表格刷新
      setRefreshKey((prev) => prev + 1);
      return res.data;
    }
  };

  const onFinishStaffStore: FormProps<SellFromProps>['onFinish'] = async (values) => {
    const result = await addSellDitchListAPI(values.ditch_id, values.sell_id);
    if (result.data) {
      message.success(result.message);
      actionRef.current!.reload();
      return true;
    } else return false;
  };

  const onFinish: FormProps<{ name: string }>['onFinish'] = async (values) => {
    const shop = {
      name: values.name,
    };
    const result = await addSellListAPI(shop.name);
    if (result.data) {
      message.success(result.message);
      actionRef.current!.reload();
      return true;
    } else return false;
  };

  const [items, setItems] = useState(['电商渠道', '其它渠道']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setItems((currItems) => {
      if (name && !currItems.includes(name)) {
        return [...items, name];
      }
      return currItems;
    });
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div>
      <>
        <ProTable<TableListItem>
          actionRef={actionRef}
          columns={columns(setModifyConfig)}
          request={handleRequest}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 'auto',
            ignoreRules: false,
            resetText: '重置',
            searchText: '搜索',
          }}
          dateFormatter="string"
          headerTitle="平台列表"
          options={false}
          toolBarRender={() => [
            <MyModalForm title="新建平台" key="add" onFormSubmit={onFinish}>
              <>
                <ProFormText
                  width="md"
                  name="name"
                  label="平台名称"
                  placeholder="请输入平台名称"
                  rules={[
                    {
                      required: true,
                      message: '平台名称是必填项',
                    },
                  ]}
                />
              </>
            </MyModalForm>,
            <MyModalForm
              title="添加渠道平台"
              btnName="添加渠道平台"
              onFormSubmit={onFinishStaffStore}
              key={'addSellStore'}
            >
              <>
                {/* [ ] 待处理 */}
                <ProForm.Item label="渠道名称" name={'name'}>
                  <Select
                    style={{ width: 300 }}
                    placeholder="请选择渠道"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Input
                            placeholder="请输入渠道"
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                          <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            添加渠道
                          </Button>
                        </Space>
                      </>
                    )}
                    options={items.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </ProForm.Item>
                <MyFormSelect name="sell_id" label="请选择平台" type="sell" />
              </>
            </MyModalForm>,
          ]}
        />
      </>

      <ShopModifyModal
        config={{ modifyConfig, setModifyConfig }}
        item={{ id: modifyConfig.id ?? '' }}
        actionRef={actionRef}
      />
    </div>
  );
};

export default NestedTable;
