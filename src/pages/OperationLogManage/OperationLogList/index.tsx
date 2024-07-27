import { listLog } from '@/apis/log';
import type { LogListReq } from '@/apis/types/log';
import type { OperationLog } from '@/entity';
import type { PageReq } from '@/type';
import { history } from '@@/core/history';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { useRef, useState } from 'react';
import { columns } from './config';

export default () => {
  const [list, setList] = useState<OperationLog[]>([]);
  const actionRef = useRef<ActionType>();
  const access = useAccess();
  console.log('access: ', access);

  const { location } = history;
  const handleRequest = async (params, sort, filter) => {
    console.log(params, sort, filter);
    const pageReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id,
        uid: params.uid,
        name: params.name,
        path: params.path,
        params: params.params,
        gmtCreatedTime: {
          range: {
            min: params.createdStart,
            max: params.createdEnd,
          },
          sort: sort.gmtCreatedTime ? (sort.gmtCreatedTime === 'ascend' ? 0 : 1) : undefined,
        },
      },
    } as PageReq<LogListReq>;
    console.log('获取操作日志列表参数： ', pageReq);
    const result = await listLog(pageReq);
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

  return (
    <>
      <>
        <ProTable<OperationLog>
          form={{ initialValues: location.query }}
          columns={columns}
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
          search={{
            labelWidth: 'auto',
          }}
          pagination={{
            pageSize: 10,
          }}
          dateFormatter="string"
          headerTitle="操作日志列表"
        />
      </>
    </>
  );
};
