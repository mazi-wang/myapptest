import { ProDescriptions, ProTable, type ActionType } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { EditPerformanceModal } from './components/ServicePerModal';
import { childColumns, columns, searchConfig } from './config/tableConfig';
import { useServiceTable } from './hooks/useServiceTable';

import type { SwipingListRes } from '@/apis/swiping';
import { delSwipingListAPI, totalSwipingAPI } from '@/apis/swiping';

import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { type ServicePutTable } from '../ServicePerformance/components/ServicePerModal';
import styles from './tableLits.modules.css';

interface TableListProps {
  initialSearchParams?: {};
  search: boolean;
}

export const ServiceTableList: React.FC<TableListProps> = ({
  initialSearchParams,
  search = true,
}) => {
  const actionRef = useRef<ActionType>();
  const { pagination, loading, fetchDataFromAPI } = useServiceTable(initialSearchParams);
  const [modifyConfig, setModifyConfig] = useState({ isOpen: false, type: 'add', data: {} });
  const [swipingTotal, setSwipingTotal] = useState<{
    moneyTotal: number;
    refundTotal: number;
  } | null>();

  async function onRequestFn(params: any) {
    // console.log("params", params)
    if (params.store_id && params.date) {
      const res = await totalSwipingAPI({ storeId: params.store_id, date: params.date });

      if (res.code === 200) setSwipingTotal(res.data);
      else setSwipingTotal(null);
    } else setSwipingTotal(null);

    return fetchDataFromAPI(params);
  }

  return (
    <div className={styles.service}>
      <ProTable<SwipingListRes>
        actionRef={actionRef}
        columns={columns(setModifyConfig)}
        request={onRequestFn}
        loading={loading}
        rowKey="storeId"
        headerTitle="店铺刷单列表"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        search={search && searchConfig}
        expandable={{
          expandedRowRender: (record) => (
            <TableList dataSource={record.swipingList} actionRef={actionRef} />
          ),
          rowExpandable: (record) => {
            return record.swipingList && record.swipingList.length > 0 ? true : false;
          },
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setModifyConfig((prevConfig) => ({
                ...prevConfig,
                type: 'add',
                isOpen: true,
                data: { swipingTime: dayjs().format('YYYY-MM-DD') },
              }));
            }}
            key={'add'}
          >
            <PlusOutlined />
            添加店铺刷单
          </Button>,
        ]}
      />

      {modifyConfig.isOpen && (
        <EditPerformanceModal config={{ modifyConfig, setModifyConfig }} actionRef={actionRef} />
      )}

      {swipingTotal && (
        <div style={{ background: '#fff', padding: '20px' }}>
          <ProDescriptions
            title="刷单总金额"
            dataSource={swipingTotal}
            columns={[
              {
                title: '总佣金',
                key: 'moneyTotal',
                dataIndex: 'moneyTotal',
                valueType: 'money',
              },
              {
                title: '返款金额',
                key: 'refundTotal',
                dataIndex: 'refundTotal',
                valueType: 'money',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

const ServicePerTableList: React.FC = () => {
  return (
    <>
      <ServiceTableList initialSearchParams={{}} search={true} />
    </>
  );
};

export default ServicePerTableList;

function TableList({ dataSource, actionRef }) {
  const [modifyConfig, setModifyConfig] = useState<{
    data: ServicePutTable | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    data: null,
    isOpen: false,
    isLoading: false,
  });

  const deleteService = async (id: string, actionRef: any) => {
    const res = await delSwipingListAPI({ id });
    if (res.code === 200) {
      message.success('删除成功');
      actionRef.current.reload();
    }
  };

  const openPutServiceModal = (data: any) => {
    setModifyConfig((prevModify) => ({ ...prevModify, data, isOpen: true }));
  };

  return (
    <>
      <ProTable
        dataSource={dataSource}
        columns={childColumns(deleteService, openPutServiceModal, actionRef)}
        rowKey={'id'}
        cardBordered
        search={false}
        toolBarRender={false}
        scroll={{ x: 1200 }}
        pagination={false}
      />
      {modifyConfig.isOpen ? (
        <EditPerformanceModal config={{ modifyConfig, setModifyConfig }} actionRef={actionRef} />
      ) : null}
    </>
  );
}
