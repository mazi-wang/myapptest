import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormSelect, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

import type { CombinedPerformance, PutUserPerformance } from '@/apis/shop';
import { delServiceIndexAPI, getServiceIndexAPI } from '@/apis/shop'; // 修改为实际的 API 文件路径
import { PlusOutlined } from '@ant-design/icons';
import { EditPerformanceModal } from './components/ServiceModal';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { switchSelectFetchFn } from '@/components/FormSelect';

moment.locale('zh-cn');

export type ModifyConfig = {
  data: PutUserPerformance | null;
  isOpen: boolean;
  isLoading: boolean;
  type: 'add' | 'edit';
};

export const TableList = ({ initialSearchParams, search }) => {
  const actionRef = useRef<ActionType>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const [modifyConfig, setModifyConfig] = useState<ModifyConfig>({
    data: null,
    isOpen: false,
    isLoading: false,
    type: 'edit',
  });

  function handleEdit(entity) {
    setModifyConfig({
      ...modifyConfig,
      data: entity,
      isOpen: true,
      type: 'edit',
    });
  }

  const fetchDataFromAPI = async (params) => {
    setLoading(true);
    try {
      const { current, pageSize, ...rest } = params;
      const result = await getServiceIndexAPI({
        current,
        pageSize,
        data: { ...rest, ...initialSearchParams },
      });

      if (result.code !== 200) throw new Error(result.message);
      const { current: resCurrent, pageSize: resPageSize, total, data } = result.data;

      setPagination({
        current: resCurrent + 1,
        pageSize: resPageSize,
        total,
      });

      return {
        current: resCurrent + 1,
        pageSize: resPageSize,
        total,
        data,
      };
    } catch (error) {
      return {
        current: 0,
        pageSize: 0,
        total: 0,
        data: [],
      };
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<CombinedPerformance>[] = [
    { title: '客服指标ID', dataIndex: 'id', key: 'id', hideInSearch: true, ellipsis: true },
    {
      title: '客服名',
      dataIndex: 'userName',
      key: 'userName',
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '客服名称',
      dataIndex: 'userId',
      key: 'userId',
      hideInTable: true,
      valueType: 'select',
      renderFormItem(schema, config, form, action) {
        return (
          <ProFormSelect
            showSearch
            debounceTime={300}
            placeholder="请选择客服"
            request={({ keyWords }) => {
              return switchSelectFetchFn('user', keyWords);
            }}
          />
        );
      },
      initialValue: initialSearchParams.userId,
    },
    {
      title: '指标完成月份',
      dataIndex: 'indexTime',
      key: 'indexTime',
      valueType: 'dateMonth',
      initialValue: initialSearchParams.indexTime,
    },
    { title: '平均响应时间', dataIndex: 'avgAnswer', key: 'avgAnswer', hideInSearch: true },
    {
      title: '平均响应时间单项分值',
      dataIndex: 'answerSingle',
      key: 'answerSingle',
      hideInSearch: true,
    },
    {
      title: '平均响应时间加权分值',
      dataIndex: 'answerWeighting',
      key: 'answerWeighting',
      hideInSearch: true,
    },
    { title: '客户满意率', dataIndex: 'satisfaction', key: 'satisfaction', hideInSearch: true },
    {
      title: '客户满意率单项分值',
      dataIndex: 'satisfactionSingle',
      key: 'satisfactionSingle',
      hideInSearch: true,
    },
    {
      title: '客户满意率加权分值',
      dataIndex: 'satisfactionWeighting',
      key: 'satisfactionWeighting',
      hideInSearch: true,
    },
    { title: '敷衍回复次数', dataIndex: 'playAt', key: 'playAt', hideInSearch: true },
    {
      title: '敷衍回复单项分值',
      dataIndex: 'playAtSingle',
      key: 'playAtSingle',
      hideInSearch: true,
    },
    {
      title: '敷衍回复加权分值',
      dataIndex: 'playAtWeighting',
      key: 'playAtWeighting',
      hideInSearch: true,
    },
    { title: '未正确发送次数', dataIndex: 'unsent', key: 'unsent', hideInSearch: true },
    {
      title: '未正确发送次数单项分值',
      dataIndex: 'unsentSingle',
      key: 'unsentSingle',
      hideInSearch: true,
    },
    {
      title: "未正确发送次数加权分值'",
      dataIndex: 'unsentWeighting',
      key: 'unsentWeighting',
      hideInSearch: true,
    },
    { title: '未完成连带销售次数', dataIndex: 'undone', key: 'undone', hideInSearch: true },
    {
      title: '未完成连带销售单项分值',
      dataIndex: 'undoneSingle',
      key: 'undoneSingle',
      hideInSearch: true,
    },
    {
      title: '未完成连带销售加权分值',
      dataIndex: 'undoneWeighting',
      key: 'undoneWeighting',
      hideInSearch: true,
    },
    { title: '货品扣分', dataIndex: 'deduct', key: 'deduct', hideInSearch: true },
    { title: '最终评级', dataIndex: 'rate', key: 'rate', hideInSearch: true },
    { title: '最终得分', dataIndex: 'finalScore', key: 'finalScore', hideInSearch: true },
    { title: '奖金', dataIndex: 'bonus', key: 'bonus', hideInSearch: true },
    {
      title: '操作',
      key: 'action',
      fixed: 'right', // 固定操作列
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => [
        <a key={'edit'} style={{ marginRight: 10 }} onClick={() => handleEdit(entity)}>
          修改客服指标
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除这条记录吗？"
          onConfirm={async () => {
            const res = await delServiceIndexAPI({ id: entity.id });
            if (res.code === 200) {
              message.success('删除成功');
              actionRef.current?.reload();
            } else {
              message.error('删除失败');
            }
          }}
          okText="是的"
          cancelText="取消"
        >
          <Button size="small" type="danger">
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<CombinedPerformance>
        actionRef={actionRef}
        columns={columns}
        request={fetchDataFromAPI}
        loading={loading}
        rowKey="id"
        search={
          search && {
            labelWidth: 120,
            defaultCollapsed: false,
            collapsed: false,
            collapseRender: (collapsed, onCollapse) => (
              <a onClick={() => onCollapse}>{collapsed ? '展开' : '折叠'}</a>
            ),
            optionRender: (searchConfig, formProps, dom) => [...dom],
            searchText: '查询',
            resetText: '重置',
            span: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 },
          }
        }
        headerTitle="客服指标列表"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        toolBarRender={() => [
          <Button
            key={'add'}
            type="primary"
            onClick={() => {
              setModifyConfig((prevModifyConfig) => ({
                ...prevModifyConfig,
                isOpen: true,
                type: 'add',
                data: { ...initialSearchParams },
              }));
            }}
          >
            <PlusOutlined />
            添加客服指标
          </Button>,
        ]}
      />

      {modifyConfig.isOpen && (
        <EditPerformanceModal config={{ modifyConfig, setModifyConfig }} actionRef={actionRef} />
      )}
    </>
  );
};

const ServicePage = () => {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <TableList initialSearchParams={{}} search={true} />
      </ConfigProvider>
    </>
  );
};

export default ServicePage;
