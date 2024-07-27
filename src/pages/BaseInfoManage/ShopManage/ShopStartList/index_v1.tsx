interface DitchProps {
    record: any
    refreshKey: string
    storeId: string
    refreshKeyRow: number
}

interface SellModifyProps {
    allID?: { sell_id: string; store_id: string; ditch_id: string } | null
    isOpen: boolean
    isLoading: boolean
}

// * 平台
const DitchSellRowRender = ({ record, refreshKeyRow, storeId }: DitchProps) => {
    const ditchId = record.id

    const [modifyConfig, setModifyConfig] = useState<SellModifyProps>({
        isOpen: false,
        isLoading: false,
    })
    const actionRef = useRef(null)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleRequest = async () => {
        const res = await getSellDistAPI(ditchId)

        if (res.code === 200) {
            return {
                data: res.data.sellList,
            }
        }
        return { data: [] }
    }

    return (
        <>
            <ProTable
                actionRef={actionRef}
                columns={[
                    { title: "ID", dataIndex: "id", key: "id" },
                    { title: "平台名称", dataIndex: "name", key: "name" },
                    {
                        title: "操作",
                        dataIndex: "operation",
                        key: "operation",
                        valueType: "option",
                        render: (dom, recordRow, _, action) => [
                            <a
                                key="modifyStore"
                                onClick={() => {
                                    setModifyConfig((modifyConfig) => ({
                                        ...modifyConfig,
                                        allID: {
                                            sell_id: recordRow.id,
                                            store_id: storeId,
                                            ditch_id: ditchId,
                                        },
                                        isOpen: true,
                                    }))
                                }}
                            >
                                添加平台成本
                            </a>,
                            <Popconfirm
                                title="删除"
                                key="delete"
                                onConfirm={async () => {
                                    const result = await delSellDistAPI(ditchId, recordRow.id)
                                    if (result.data) {
                                        message.success(result.message)
                                        action?.reload()
                                    } else {
                                        message.error(result.message)
                                    }
                                }}
                                okText="是的"
                                cancelText="取消"
                            >
                                <a type="danger">删除</a>
                            </Popconfirm>,
                        ],
                    },
                ]}
                rowKey="id"
                headerTitle={false}
                search={false}
                options={false}
                pagination={false}
                request={handleRequest}
                params={{ refreshKeyRow }} // 使用这个参数来强制刷新
                expandable={{
                    expandedRowRender: (record) => (
                        <CostRowRender
                            record={record}
                            refreshKey={refreshKey}
                            storeId={storeId}
                            ditchId={ditchId}
                        />
                    ),
                }}
            />

            <SellCost
                config={{ modifyConfig, setModifyConfig }}
                item={{ allID: modifyConfig.allID }}
                setRefreshKey={setRefreshKey}
                actionRef={actionRef}
            />
        </>
    )
}
