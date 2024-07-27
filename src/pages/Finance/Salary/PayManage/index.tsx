import type { EmployeeCompensation, GetPayType } from '@/apis/pay';
import { ProTable, type ActionType } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { EditPayModal } from './PayModal';
import type { ChangeModalFn, OnDeleteFn } from './usePay';
import { useTable } from './usePay';
import { columns, searchConfig, tableColumns } from './usePay.config';

import { LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';

interface TableListProps {
  initialSearchParams?: any;
  search: boolean;
}

const PaySheetList: React.FC<{
  dataSource: EmployeeCompensation[];
  handleDeleteFn: OnDeleteFn;
  changeModal: ChangeModalFn;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}> = ({ dataSource, changeModal, handleDeleteFn, actionRef }) => {
  return (
    <>
      <ProTable<EmployeeCompensation>
        columns={tableColumns(handleDeleteFn, changeModal, actionRef)}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: true }}
        search={false}
      />
    </>
  );
};

// * This component is used to display the list of employees and their salaries
export const PayTableList: React.FC<TableListProps> = ({
  initialSearchParams = null,
  search = true,
}) => {
  const [records, setRecords] = useState<number>();
  const actionRef = useRef<ActionType>();
  const [initialParams, setInitialParams] = useState({
    ...initialSearchParams,
    dateMonth: dayjs().format('YYYY-MM'),
    user_id: '',
  });

  const { pagination, loading, fetchDataFromAPI, onDeleteFn, modifyConfig, changeModal } = useTable(
    initialParams,
    setInitialParams,
  );

  return (
    <div>
      <ProTable<GetPayType>
        params={{ initialParams }}
        actionRef={actionRef}
        columns={columns(initialParams, records, changeModal, actionRef, onDeleteFn)}
        request={(params) => {
          return fetchDataFromAPI(params);
        }}
        onReset={() => {
          setInitialParams(() => ({
            dateMonth: dayjs().format('YYYY-MM'),
            user_id: undefined,
          }));

          setTimeout(() => {
            actionRef.current?.reset?.();
          }, 0);
        }}
        onSubmit={(params) => {
          console.log('onSubmit', params);

          if (!params?.dateMonth) {
            setInitialParams((currValues) => ({
              ...currValues,
              dateMonth: undefined,
            }));
          }

          if (!params?.userId) {
            setInitialParams((currValues) => ({
              ...currValues,
              user_id: undefined,
            }));
          }
        }}
        loading={loading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <PaySheetList
              dataSource={record.paySheetList}
              handleDeleteFn={onDeleteFn}
              changeModal={changeModal}
              actionRef={actionRef}
            />
          ),
          rowExpandable: (record) => (record.paySheetList ? true : false),
        }}
        headerTitle="工资列表"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        search={search && searchConfig}
        scroll={{ x: true }}
        toolBarRender={() => [
          <Tag
            key={'curr'}
            color="green"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setInitialParams(() => ({
                dateMonth: dayjs().format('YYYY-MM'),
              }));

              setTimeout(() => {
                actionRef.current?.reset?.();
              });
            }}
          >
            回到当前月份: {dayjs().format('YYYY-MM')}
          </Tag>,
          <Button
            key={'prev'}
            onClick={() => {
              setInitialParams((currValues) => ({
                ...currValues,
                dateMonth: dayjs(currValues.dateMonth).subtract(1, 'month').format('YYYY-MM'),
              }));

              setTimeout(() => {
                actionRef.current?.reset?.();
              });
            }}
            type="primary"
            icon={<LeftOutlined />}
            disabled={loading}
          />,

          <Button
            key={'next'}
            onClick={() => {
              setInitialParams((currValues) => ({
                ...currValues,
                dateMonth: dayjs(currValues.dateMonth).add(1, 'month').format('YYYY-MM'),
              }));

              setTimeout(() => {
                actionRef.current?.reset?.();
              });
            }}
            type="primary"
            icon={<RightOutlined />}
            disabled={loading}
          />,

          <Button
            key={'add'}
            type="primary"
            onClick={() => {
              changeModal({
                isOpen: true,
                isLoading: true,
                type: 'add',
                data: {
                  grantTime:
                    dayjs().date() > 20
                      ? dayjs().format('YYYY-MM')
                      : dayjs().subtract(1, 'month').format('YYYY-MM'),
                },
              });
            }}
          >
            <PlusOutlined />
            添加员工工资
          </Button>,
        ]}
      />
      {modifyConfig.isOpen && (
        <EditPayModal config={{ modifyConfig, changeModal }} actionRef={actionRef} />
      )}
    </div>
  );
};

const PayTablePage: React.FC = () => {
  return (
    <>
      <PayTableList search={true} />
    </>
  );
};

export default PayTablePage;
