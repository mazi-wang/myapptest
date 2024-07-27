import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef } from 'react';
import { columns, searchConfig } from './monthly.columns.config';
import { useTable } from './useMonthly';

import type { MonthlyItem } from '@/apis/monthly';
import { exportMonthlyAPI, importMonthlyFileAPI } from '@/apis/monthly';
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';

import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn'; // 导入中文语言包
import CalendarApp from './components/DaysContainer';

moment.locale('zh-cn');

interface TableListProps {
  initialSearchParams?: undefined;
  search: boolean;
}

// CSS to hide the header of the Calendar component

async function handleExportExcel() {
  await exportMonthlyAPI();
}

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target?.files[0];
  if ((file && file.name.split('.').at(-1) === 'xls') || file.name.split('.').at(-1) === 'xlsx') {
    try {
      const response = await importMonthlyFileAPI(file);
      if (response.success) {
        message.success('文件已成功导入');
      } else {
        message.error('文件导入失败');
      }
    } catch (error) {
      message.error('上传失败，请重试');
      console.error('Upload error:', error);
    }
  }
};

export const MonthlyTableList: React.FC<TableListProps> = ({
  initialSearchParams,
  search = true,
}) => {
  const actionRef = useRef<ActionType | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { pagination, loading, fetchDataFromAPI } = useTable(initialSearchParams);

  const fetchTableData = async (params) => {
    return await fetchDataFromAPI(params);
  };
  async function handleImportExcel() {
    fileInputRef.current!.click();
  }

  return (
    <div>
      <ProTable<MonthlyItem>
        actionRef={actionRef}
        columns={columns()}
        request={fetchTableData}
        loading={loading}
        rowKey="id"
        headerTitle="考勤设置"
        toolBarRender={() => [
          <Button
            key={'export'}
            type="primary"
            icon={<CloudDownloadOutlined />}
            onClick={() => handleExportExcel()}
          >
            导出
          </Button>,
          <Button
            key={'import'}
            type="ghost"
            icon={<CloudUploadOutlined />}
            onClick={() => handleImportExcel()}
          >
            导入
          </Button>,
          <input
            key={'input'}
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />,
        ]}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        expandable={{
          expandedRowRender: (record) => <CalendarApp dataRender={record.dailyRecords} />,
          rowExpandable: (record) => !!record.dailyRecords,
        }}
        search={search && searchConfig}
      />
    </div>
  );
};

const MonthlyList: React.FC = () => {
  return (
    <>
      <ConfigProvider>
        <MonthlyTableList search={true} />
      </ConfigProvider>
    </>
  );
};

export default MonthlyList;
