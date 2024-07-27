import { PlusOutlined } from '@ant-design/icons';
import { ProTable, type ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import type { ServicePutTable } from './components/ServicePerModal';
import { EditPerformanceModal } from './components/ServicePerModal';
import { columns, searchConfig } from './config/tableConfig';
import { useServiceTable } from './hooks/useServiceTable';

import { totalServiceAPI, type Service } from '@/apis/shop';
import { ProDescriptions } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { TableList } from '../ServicePage';
import styles from './tableLits.modules.css';

interface TableListProps {
  initialSearchParams?: { userId: string };
  search: boolean;
}

interface ServiceTotal {
  userId: string;
  actualValueCount: number;
  actualCommissionCount: number;
  refundValueCount: number;
  refundCommissionCount: number;
}

export const ServiceTableList: React.FC<TableListProps> = ({
  initialSearchParams,
  search = true,
}) => {
  const [modifyConfig, setModifyConfig] = useState<{
    data: ServicePutTable | null;
    isOpen: boolean;
    isLoading: boolean;
    type: 'add' | 'edit';
  }>({
    data: null,
    isOpen: false,
    isLoading: false,
    type: 'edit',
  });

  const actionRef = useRef<ActionType>();
  const [serviceTotal, setServiceTotal] = useState<ServiceTotal | null>();

  const { pagination, loading, fetchDataFromAPI, deleteService } =
    useServiceTable(initialSearchParams);

  const fetchTableData = async (params: any) => {
    if (params.userId && params.serviceTime) {
      const res = await totalServiceAPI({
        serviceTime: params.serviceTime,
        userId: params.userId,
      });

      if (res.code === 200) setServiceTotal(res.data);
      else setServiceTotal(null);
    } else {
      setServiceTotal(null);
    }

    return fetchDataFromAPI(params);
  };

  return (
    <div className={styles.service}>
      <ProTable<Service>
        actionRef={actionRef}
        columns={columns(deleteService, setModifyConfig, initialSearchParams)}
        request={fetchTableData}
        loading={loading}
        rowKey="id"
        headerTitle="客服绩效列表"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        search={search && searchConfig}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key={'add'}
            type="primary"
            onClick={() => {
              setModifyConfig((prevModifyConfig) => ({
                ...prevModifyConfig,
                isOpen: true,
                type: 'add',
                data: null,
              }));
            }}
          >
            <PlusOutlined />
            添加客服绩效
          </Button>,
        ]}
        expandable={{
          expandedRowRender: (record) => (
            <span style={{ width: '100%' }}>
              <TableList
                initialSearchParams={{
                  userId: `${record.userId}`,
                  indexTime: `${dayjs(record.serviceTime).format('YYYY-MM')}`,
                }}
                search={true}
              />
            </span>
          ),
        }}
      />

      {modifyConfig.isOpen && (
        <EditPerformanceModal config={{ modifyConfig, setModifyConfig }} actionRef={actionRef} />
      )}

      {serviceTotal && (
        <div>
          <ServiceDescriptions dataSource={serviceTotal} />
        </div>
      )}
    </div>
  );
};

const ServicePerTableList: React.FC = () => {
  return (
    <>
      <ServiceTableList initialSearchParams={{ userId: '' }} search={true} />
    </>
  );
};

function ServiceDescriptions({ dataSource }: { dataSource: ServiceTotal }) {
  return (
    <div style={{ background: '#fff', padding: '20px' }}>
      <ProDescriptions
        title="客服销售金额总计"
        dataSource={dataSource}
        columns={[
          {
            title: '客服ID',
            key: 'userId',
            dataIndex: 'userId',
            ellipsis: true,
            copyable: true,
          },
          {
            title: '实销总金额',
            key: 'actualValueCount',
            dataIndex: 'actualValueCount',
            valueType: 'money',
          },
          {
            title: '实销总提成',
            key: 'refundValueCount',
            dataIndex: 'actualCommissionCount',
          },
          {
            title: '退款总金额',
            key: 'refundValueCount',
            dataIndex: 'refundValueCount',
            valueType: 'money',
          },
          {
            title: '退款总提成',
            key: 'refundCommissionCount',
            dataIndex: 'refundCommissionCount',
          },
        ]}
      >
        {/* <ProDescriptions.Item label="退款提成" valueType="percent">
                    {dataSource.refundCommissionCount * 100}
                </ProDescriptions.Item> */}
      </ProDescriptions>
    </div>
  );
}

export default ServicePerTableList;
