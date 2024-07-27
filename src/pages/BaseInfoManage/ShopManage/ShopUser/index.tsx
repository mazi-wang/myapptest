import type { Staff, Store } from '@/apis/shop';
import { deleteStoreAPI, getStoreStaffAPI, putStoreStatusAPI } from '@/apis/shop';
import type { TableProps } from 'antd';
import { Input, message, Popconfirm, Space, Table, Tag } from 'antd';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { ShopModifyModal } from './components/ShopModifyModal';

import styled from 'styled-components';

const { Search } = Input;

// ID 1750336361017425922
type DataType = Store;

const Wrapper = styled.div`
  padding: 2rem 4rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StaffInfo = styled.section`
  font-weight: 600;
  color: 'teal';
`;

async function putStoreStatus(id: string) {
  try {
    const res = await putStoreStatusAPI(id);

    if (res.code === 200 && res.message === 'success') {
      message.success('修改成功');
    } else throw new Error(res.message);
  } catch (err) {
    console.log(err);
    message.error('修改失败');
  }
}

const confirm = (id: string, type: string = 'put', callbackFn: () => void) => {
  if (type === 'put') putStoreStatus(id).then(() => callbackFn());
  if (type === 'delete') deleteStoreAPI(id).then(() => callbackFn());
};

const cancel: PopconfirmProps['onCancel'] = (e) => {
  console.log(e);
  message.error('Click on No');
};

const columns: (
  onSearch: () => void,
  setModifyPwdConfig: Dispatch<SetStateAction<any>>,
) => TableProps<DataType>['columns'] = (onSearch, setModifyPwdConfig) => [
  {},
  {
    title: '店铺名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '店铺ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '店铺创建时间',
    dataIndex: 'storeCreatedTime',
    key: 'storeCreatedTime',
    render: (text) => {
      const time = new Date(text);

      return <span>{time.toLocaleDateString()}</span>;
    },
  },
  {
    title: '最后修改时间',
    dataIndex: 'storeLastModifiedTime',
    key: 'storeLastModifiedTime',
    render: (text) => {
      const time = new Date(text);

      return <span>{time.toLocaleDateString()}</span>;
    },
  },
  {
    title: '店铺状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <Popconfirm
        title="修改状态"
        description="是否确认修改状态？"
        onConfirm={() => {
          confirm(record.id, 'put', onSearch);
        }}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Tag color={text === 0 ? 'green' : 'red'}>{text ? '店铺开启' : '店铺关闭'}</Tag>
      </Popconfirm>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <span
          style={{ cursor: 'pointer', color: 'blueviolet' }}
          onClick={() => setModifyPwdConfig((curState) => ({ ...curState, isOpen: true }))}
        >
          编辑店铺名称 {record.name}
        </span>

        <a>
          <Popconfirm
            title="删除"
            onConfirm={() => confirm(record.id, 'delete')}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </a>
      </Space>
    ),
  },
];

// 搜索
const ShopUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [staffData, setStaffData] = useState<Staff<Store[]>>();

  const [modifyPwdConfig, setModifyPwdConfig] = useState<{
    id: string | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    id: null,
    isOpen: false,
    isLoading: false,
  });

  function onChangeValue() {
    async function getDataUser() {
      setLoading(true);
      try {
        const res = await getStoreStaffAPI(input);

        if (res.code !== 200) throw new Error(res.message);
        setStaffData(() => res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getDataUser();
  }

  return (
    <>
      <>
        <Wrapper>
          <Search
            placeholder="请输入用户ID"
            enterButton="搜索"
            size="large"
            loading={loading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSearch={onChangeValue}
            allowClear
          />

          <StaffInfo>
            <p>
              Email: <span className="text-4xl">{staffData?.email || ''}</span>
            </p>
            <p>
              ID: <span>{staffData?.id || ''}</span>
            </p>
            <p>
              名称: <span>{staffData?.name || ''}</span>
            </p>
          </StaffInfo>

          {staffData?.store ? (
            <Table
              columns={columns(onChangeValue, setModifyPwdConfig)}
              dataSource={staffData.store}
            />
          ) : (
            ''
          )}
        </Wrapper>
      </>

      <ShopModifyModal
        config={{ modifyPwdConfig, setModifyPwdConfig }}
        item={{ id: modifyPwdConfig.id ?? '' }}
      />
    </>
  );
};

export default ShopUser;
