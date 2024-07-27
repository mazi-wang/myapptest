import { addUserPostAPI, delUserPostAPI, getUserPostAllAPI } from '@/apis/post';
import MyModalForm from '@/components/ModalForm';
import type { ProColumns } from '@ant-design/pro-components';
import { ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import Styled from 'styled-components';

import { MyFormSelect, switchSelectNameFetchFn } from '@/components/FormSelect';

interface DataType {
  name: string;
  stationName: string;
  id: string;
  stationId: string;
}

const NameSpan = Styled.div``;

function FromItem({ id }: { id: string }) {
  return (
    <>
      <ProFormText
        name="id"
        width="md"
        label="用户编号"
        fieldProps={{
          disabled: true,
          value: id,
        }}
      />
      <MyFormSelect name="stationId" label="选择岗位" type="station" />
    </>
  );
}

async function onFinishPutPost(params, stationId) {
  try {
    const res = await addUserPostAPI(params, stationId);
    if (res.code !== 200) throw new Error(res.message);
    message.success('成功');
    return true;
  } catch (err) {
    message.error('出错了');
    return false;
  }
}

const columns = (actionRef): ProColumns<DataType, 'text'>[] | undefined => [
  {
    title: '员工名称',
    dataIndex: 'name',
    valueType: 'select',
    hideInTable: true,
    renderFormItem(schema, config, form, action) {
      return (
        <ProFormSelect
          showSearch
          debounceTime={300}
          placeholder="请选择员工名称"
          request={({ keyWords }) => {
            return switchSelectNameFetchFn('user', keyWords);
          }}
        />
      );
    },
  },
  {
    title: '员工名称',
    dataIndex: 'name',
    sorter: true,
    render: (name) => <NameSpan>{name}</NameSpan>,
    width: '20%',
    hideInSearch: true,
  },
  {
    title: '员工ID',
    dataIndex: 'id',
    hideInSearch: true,
  },
  {
    title: '所属岗位',
    dataIndex: 'stationName',
    width: '20%',
    hideInSearch: true,
    render(dom, entity, index, action, schema) {
      if (entity.stationName) return <span>{dom}</span>;
      else return <Tag color="red">无岗位</Tag>;
    },
  },
  {
    title: '岗位ID',
    dataIndex: 'stationId',
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 50,
    render: (dom, record, _, action) => [
      <span key={'put'}>
        {record.stationId ? (
          ''
        ) : (
          <MyModalForm
            title="添加用户岗位"
            btnName="修改岗位"
            onFormSubmit={async (values) => {
              const res = await onFinishPutPost(record.id, values.stationId);

              if (res) actionRef.current.reload();
              return res;
            }}
          >
            <FromItem id={record.id} />
          </MyModalForm>
        )}
      </span>,
      <span key="delete">
        {record.stationId ? (
          <Popconfirm
            title="删除用户岗位"
            description="此操作是不可逆的，确定删除吗？"
            onConfirm={async () => {
              const result = await delUserPostAPI(record.id, record.stationId);
              if (result.data) {
                message.success(result.message);
                action?.reload();
              } else {
                message.error(result.message);
              }
            }}
            okText="是的"
            cancelText="取消"
          >
            <Button size={'small'} type={'danger'}>
              删除用户岗位
            </Button>
          </Popconfirm>
        ) : (
          ''
        )}
      </span>,
    ],
  },
];

interface FetchParams {
  current: number;
  pageSize: number;
  name?: string;
}

interface RequestData {
  current: number;
  pageSize: number;
  data?: { name: string };
}

interface APIResult<T> {
  code: number;
  message: string;
  data: {
    current: number;
    pageSize: number;
    total: number;
    data: T[];
  };
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const PostUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const actionRef = useRef();

  // type DataFrom = <T>(
  //     params: FetchParams | null
  // ) => Promise<{ success: boolean; data: T[]; total?: number | undefined }>

  async function fetchDataFromAPI<T>(
    params: FetchParams | null,
  ): Promise<{ success: boolean; data: T[]; total?: number }> {
    setLoading(true);

    if (!params) {
      setLoading(false);
      return { success: false, data: [] };
    }

    const requestData: RequestData = {
      current: params.current,
      pageSize: params.pageSize,
      data: params.name ? { name: params.name } : undefined,
    };

    try {
      const result: APIResult<T> = await getUserPostAllAPI(requestData);

      if (result.code !== 200) {
        message.error(result.message);
        return { success: false, data: [] };
      }
      const { current, pageSize, total, data } = result.data;

      setPagination({
        current,
        pageSize,
        total,
      });
      return {
        success: true,
        data,
        total,
      };
    } catch (error) {
      message.error('获取数据失败');
      return { success: false, data: [] };
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <>
        <ProTable<DataType>
          actionRef={actionRef}
          request={fetchDataFromAPI}
          columns={columns(actionRef)}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          headerTitle="员工岗位列表"
        />
      </>
    </>
  );
};

export default PostUser;
