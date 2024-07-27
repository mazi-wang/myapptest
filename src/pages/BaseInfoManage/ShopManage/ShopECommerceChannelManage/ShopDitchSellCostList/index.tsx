import { delCostAPI, getCostList } from '@/apis/shop';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, ConfigProvider, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { ShopModifyModal } from './components/ShopModifyModal';

import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export type Status = {
  color: string;
  text: string;
};

export type TableListItem = {
  id: string;
  type: number;
  body: any;
  costId?: string;
};

// * 成本类型(1.货品成本 2.推广成本 3.刷单成本 4.人工成本 5.外包成本 6.收入金额)
enum costType {
  货品成本 = 1,
  推广成本 = 2,
  刷单成本 = 3,
  人工成本 = 4,
  外包成本 = 5,
  收入金额 = 6,
}

// # 定义成本完成类型的枚举
enum CostTypeFinish {
  goodsCost = 1,
  promotionCost = 2,
  swipingCost = 3,
  laborCost = 4,
  outsourcingCost = 5,
  earning = 6,
}

function handleCostType(body: any, type: number) {
  switch (type) {
    case 1:
      return <>￥{body.goodsDTO.goodsCost}</>;
    case 2:
      return <></>;
    case 3:
      return <>￥{body.swipingDTO.swipingCost}</>;
    case 4:
      return <>￥{body.laborDTO.laborCost}</>;
    case 5:
      return <>￥{body.mixDTO.mixCost}</>;
    case 6:
      return <>￥{body.earningDTO.earning}</>;
  }
}

type AllId = null | { store_id: string; ditch_id: string; sell_id: string };

function SwitchProTable({
  data,
  title,
}: {
  title: string;
  data: { name: string; price: number }[];
}) {
  const actionRef = useRef(null);

  return (
    <ProTable
      actionRef={actionRef}
      columns={[
        { title: '成本类型', dataIndex: 'name', key: 'name' },
        { title: '成本价格', dataIndex: 'price', key: 'price', valueType: 'money' },
      ]}
      dataSource={data}
      rowKey="name"
      pagination={false}
      search={false}
      dateFormatter="string"
      options={false} // 隐藏工具栏
    />
  );
}

// * 删除成本
const handleRemoveFn = async (id: string, name?: string) => {
  try {
    const res = await delCostAPI({ cost_true_id: id, name });

    if (res.data) {
      message.success('成功删除');
      return true;
    } else {
      message.error('删除失败');
      return false;
    }
  } catch (error) {
    console.error('删除失败:', error);
    return false;
  }
};

function CostTypeHandle({
  body,
  type,
  id,
  reload,
  setModifyConfig,
}: {
  body: any;
  type: number;
  id: string;
  reload: any;
  setModifyConfig: any;
}) {
  const actionRef = useRef(null);
  let data;

  switch (type) {
    case costType.推广成本:
      return (
        <ProTable
          actionRef={actionRef}
          columns={[
            { title: '成本ID', dataIndex: 'costTrueId', key: 'costTrueId' },
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: '成本名称', dataIndex: 'name', key: 'name' },
            {
              title: '成本',
              dataIndex: 'promotionValue',
              key: 'promotionValue',
              valueType: 'money',
            },
            {
              title: '操作',
              key: 'Action',
              valueType: 'option',
              render: (dom, entity, index, action, schema) => [
                <a
                  key="revise"
                  style={{ paddingRight: '10px' }}
                  onClick={() =>
                    setModifyConfig((modifyConfig) => ({
                      ...modifyConfig,
                      id,
                      type,
                      name: entity.name,
                      isOpen: true,
                    }))
                  }
                >
                  修改成本
                </a>,
                <Popconfirm
                  key="delete"
                  title="删除"
                  onConfirm={async () =>
                    // * 删除推广成本 替换成本ID
                    (await handleRemoveFn(entity.costTrueId, entity.name)) && reload()
                  }
                  okText="是的"
                  cancelText="取消"
                >
                  <Button size="small" type="danger">
                    删除
                  </Button>
                </Popconfirm>,
              ],
            },
          ]}
          dataSource={body}
          rowKey="id"
          pagination={false}
          search={false}
          dateFormatter="string"
          headerTitle="推广成本列表"
          options={false} // 隐藏工具栏
        />
      );

    case costType.货品成本:
      data = [{ name: costType[1], price: body.goodsDTO.goodsCost }];
      return <SwitchProTable data={data} title="货品成本" />;
    case costType.刷单成本:
      data = [{ name: costType[3], price: body.swipingDTO.swipingCost }];
      return <SwitchProTable data={data} title="刷单成本" />;
    case costType.外包成本:
      data = [{ name: costType[5], price: body.mixDTO.mixCost }];
      return <SwitchProTable data={data} title="外包成本" />;
    case costType.收入金额:
      data = [{ name: costType[6], price: body.earningDTO.earning }];
      return <SwitchProTable data={data} title="收入金额" />;

    default:
      return <span>未处理的 类型: {type}</span>;
  }
}

const columns = (seCostModifyConfig: React.Dispatch<React.SetStateAction<ModifyConfigProps>>) => [
  {
    title: '成本时间',
    dataIndex: 'date',
    key: 'date',
    hideInTable: true,
    valueType: 'dateMonth',
    initialValue: dayjs().format('YYYY-MM'),
  },
  {
    title: '成本类型',
    key: 'type',
    width: 120,
    dataIndex: 'type',
    hideInSearch: true,
    render: (_) => <a>{costType[_]}</a>,
  },
  {
    title: '成本ID',
    width: 120,
    align: 'right',
    dataIndex: 'id',
    render(dom, entity, index, action, schema) {
      return <a>{entity.id}</a>;
    },
    hideInSearch: true,
    key: 'id',
  },
  {
    title: '成本价格',
    width: 120,
    dataIndex: 'body',
    render: (_, record) => handleCostType(record.body, record.type),
    hideInSearch: true,
  },
  {
    title: '成本时间',
    width: 120,
    dataIndex: 'costTime',
    hideInSearch: true,
    valueType: 'dateMonth',
    key: 'costTime',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 120,
    render: (dom, record, _, action) => [
      <>
        {record.type === costType.推广成本 ? (
          ''
        ) : (
          <Button
            key="change"
            type="primary"
            size="small"
            onClick={() => {
              seCostModifyConfig((modifyConfig) => ({
                ...modifyConfig,
                id: record.id,
                type: record.type,
                isOpen: true,
              }));
            }}
          >
            修改成本
          </Button>
        )}
      </>,

      <>
        {record.type === costType.推广成本 ? (
          ''
        ) : (
          <Popconfirm
            key="delete"
            title="删除"
            onConfirm={async () => (await handleRemoveFn(record.id)) && action.reload()}
            okText="是的"
            cancelText="取消"
          >
            <Button size="small" type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        )}
      </>,
    ],
  },
];

interface ModifyConfigProps {
  id: string | null;
  isOpen: boolean;
  isLoading: boolean;
  name?: string;
  type: number | null;
  allId: AllId | null;
}

// cost_id: string; type: number
const handleRequest = async (
  params: { current: number; pageSize: number; id: string; type: number },
  setTableListDataSource: React.Dispatch<React.SetStateAction<ModifyConfigProps>>,
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>,
) => {
  const pageReq = {
    current: params.current,
    pageSize: params.pageSize,
    data: {
      cost_id: params.id,
      type: params.type,
    },
  };

  const res = await getCostList(pageReq);

  if (res.code !== 200) {
    message.error('出错了');
    return;
  }

  setTableListDataSource(res.data.data);
  setRefreshKey((prev) => prev + 1);
  return {
    data: res.data.data,
    success: true,
    total: res.data.total,
  };
};

export function Cost({
  request = handleRequest,
  search = { labelWidth: 'auto', resetText: '重置', searchText: '搜索' },
  pagination = { showQuickJumper: true },
  params: requestParams = {},
}: {
  request?: (
    params: any,
    setTableListDataSource: any,
    setRefreshKey: any,
  ) => Promise<{ data: any; success: boolean; total: any } | undefined>;
  search?: any | boolean;
  pagination: any | boolean;
  allId?: AllId | null;
  params: { id: string; type: number } | {};
}) {
  const [tableListDataSource, setTableListDataSource] = useState([]);
  const [modifyConfig, seCostModifyConfig] = useState<ModifyConfigProps>({
    id: null,
    isOpen: false,
    isLoading: false,
    type: null,
    allId: null,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const actionRef = useRef<ActionType | undefined>(null);

  return (
    <>
      <ProTable<TableListItem>
        actionRef={actionRef}
        columns={columns(seCostModifyConfig)}
        request={(params) => request(params, setTableListDataSource, setRefreshKey)}
        rowKey="id"
        pagination={pagination}
        search={search}
        dateFormatter="string"
        options={false}
        expandable={{
          expandedRowRender: (record) => {
            if (record.body && Object.keys(record.body).length > 0) {
              return (
                <CostTypeHandle
                  body={record.body}
                  type={record.type}
                  id={record.id}
                  reload={actionRef.current?.reload}
                  setModifyConfig={seCostModifyConfig}
                />
              );
            } else {
              return null;
            }
          },
          rowExpandable: (record) =>
            record.type === 2 && !!record.body && Object.keys(record.body).length > 0,
        }}
        params={requestParams}
      />

      {modifyConfig.isOpen ? (
        <ShopModifyModal
          config={{ modifyConfig, seCostModifyConfig }}
          item={{
            id: modifyConfig.id ?? '',
            type: modifyConfig.type,
            name: modifyConfig.name,
            allId: modifyConfig.allId,
          }}
          actionRef={actionRef}
        />
      ) : null}
    </>
  );
}

const CostTable = () => {
  return (
    <div>
      <ConfigProvider locale={zhCN}>
        <>
          <Cost />
        </>
      </ConfigProvider>
    </div>
  );
};

export default CostTable;
