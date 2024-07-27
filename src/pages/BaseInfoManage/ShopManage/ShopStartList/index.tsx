import { ProDescriptions, ProTable } from "@ant-design/pro-components"
import {
    Button,
    Descriptions,
    DescriptionsProps,
    Drawer,
    FormProps,
    message,
    Modal,
    Popconfirm,
    Space,
    Tag,
} from "antd"
import { useRef, useState } from "react"
import type { FC } from "react"

import { Cost } from "../ShopECommerceChannelManage/ShopDitchSellCostList"
import { ShopModifyModal } from "./components/ShopModifyModal"
import { DishSell } from "./components/DishSell"
import { SellCost } from "./components/SellCost"

import { StartProvider } from "./context/StartContext"

import { userColumns, searchConfig, ditchColumns } from "./config/columns.config"
import type { ActionType } from "@ant-design/pro-table"

import {
    getStoreDitchAPI,
    delStoreDitchAPI,
    getStoreStaffListAPI,
    getCostListStore,
    getCost,
    addStoreStaffAPI,
} from "@/apis/shop"
import type { UserStoreType } from "@/apis/shop"
import { useTable } from "./hook/useTable"
import MyModalForm from "@/components/ModalForm"
import { MyFormSelect } from "@/components/FormSelect"
import { ShopChannelModifyModal } from "../ShopList/components/ShopECommerceChannelModifyModal"

export type Status = {
    color: string
    text: string
}

export type TableListItem = {
    storeName: string
    storeId: string
    status: number
    id: string
    name: string
}

export interface ModifyConfigProps<T> {
    data?: T
    isOpen: boolean
    isLoading: boolean
}

interface CostProps {
    record?: any
    sellId: string | null
    refreshKey: number
    storeId: string
    ditchId: string
    open: boolean
    onClose: () => void
}

interface SDitchProps {
    storeId: string
    refreshKey: number
}
interface ModifyConfig {
    id: string | null
    isOpen: boolean
    isLoading: boolean
}

interface SellListData {
    id: string
    name: string
    articleCreatedTime: string
    articleLastModifiedTime: string
}
export interface SDitchData<T = SellListData> {
    id: string
    name: string
    sellList: T[]
}

// * CostDrawer 成本抽屉
function CostDrawer({ sellId, refreshKey, storeId, ditchId, open, onClose }: CostProps) {
    const [costForMonth, setCostForMonth] = useState<any>(null)

    if (!storeId || !ditchId || !sellId) return null

    const handleRequest = async (params) => {
        const res = await getCostListStore({
            store_id: storeId,
            sell_id: sellId,
            ditch_id: ditchId,
            costTime: params?.date,
        })

        if (params?.date) {
            const result = await getCost({
                store_id: storeId,
                sell_id: sellId,
                ditch_id: ditchId,
                costTime: params?.date,
            })

            if (result.code === 200) setCostForMonth(result.data)
            else setCostForMonth(null)
        } else {
            setCostForMonth(null)
        }

        if (res.code === 200) {
            const costData = res.data?.costList.map((item) => {
                let body = ""
                try {
                    body = JSON.parse(item.body)
                } catch (error) {
                    body = item.body
                } finally {
                    return {
                        ...item,
                        body,
                    }
                }
            })

            return { data: costData }
        }
        return { data: [] }
    }

    return (
        <>
            <Drawer size="large" title="成本" onClose={onClose} open={open}>
                <Cost request={handleRequest} pagination={true} params={refreshKey} />
                <div style={{ fontSize: "20px" }}>
                    {costForMonth && Object.keys(costForMonth).length > 0 && (
                        <ProDescriptions
                            title="成本详情"
                            style={{ fontSize: "20px" }}
                            dataSource={costForMonth}
                            columns={[
                                {
                                    title: "成本总金额",
                                    key: "costCount",
                                    dataIndex: "costCount",
                                    valueType: "money",
                                },
                                {
                                    title: "收入金额",
                                    key: "earning",
                                    dataIndex: "earning",
                                    valueType: "money",
                                },
                                {
                                    title: "利润",
                                    key: "profit",
                                    dataIndex: "profit",
                                    valueType: "money",
                                },
                            ]}
                        />
                    )}
                </div>
            </Drawer>
        </>
    )
}

// * 渠道名称
const UStoreDitchTable = ({ storeId, refreshKey }: SDitchProps) => {
    const [modifyConfig, setModifyConfig] = useState<ModifyConfig>({
        id: null,
        isOpen: false,
        isLoading: false,
    })
    const [costProps, setCostProps] = useState({
        sellId: null,
        ditchId: null,
        refreshKey: "",
    })
    const actionRef = useRef(null)

    const [open, setOpen] = useState(false)
    const [isModalCostOpen, setIsModalCostOpen] = useState({
        isOpen: false,
        isLoading: false,
    })

    // [ ] 编辑渠道
    const [modifyEditConfig, setModifyEditConfig] = useState<ModifyConfig>({
        isOpen: false,
        isLoading: false,
        id: null,
    })

    const showDrawer = (ditchId, sellId) => {
        setCostProps((prevProps) => ({
            ...prevProps,
            sellId,
            ditchId,
            refreshKey: `${sellId}${ditchId}`,
        }))
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const allID = { sell_id: costProps.sellId, store_id: storeId, ditch_id: costProps.ditchId }

    async function handelRequest() {
        setModifyConfig((prevConfig) => ({ ...prevConfig, isLoading: true }))

        try {
            const result = await getStoreDitchAPI(storeId)
            if (result.code !== 200) return { data: [] }

            return { data: result.data }
        } catch (error) {
            return { data: [] }
        } finally {
            setModifyConfig((prevConfig) => ({ ...prevConfig, isLoading: false }))
        }
    }

    // [x] 添加平台成本
    const onFinishStaffStore: FormProps<any>["onFinish"] = async (values) => {
        // console.log("表单值为: ", values)
        const shop = {
            id: values.id,
            storeId: values.storeId,
        }
        const result = await addStoreStaffAPI(shop.id, shop.storeId)
        if (result.data) {
            message.success(result.message)
            return true
        } else return false
    }

    return (
        <>
            <ProTable<SDitchData>
                bordered
                columns={ditchColumns(
                    setModifyConfig,
                    actionRef,
                    storeId,
                    showDrawer,
                    setIsModalCostOpen,
                    setCostProps,
                    setModifyEditConfig
                )}
                rowKey="id"
                headerTitle={false}
                search={false}
                options={false}
                pagination={false}
                request={handelRequest}
                actionRef={actionRef}
                params={{ refreshKey }} // 使用这个参数来强制刷新
            />

            {/* * 添加渠道平台 */}
            <DishSell
                config={{ modifyConfig, setModifyConfig }}
                item={{ id: modifyConfig.id ?? "" }}
                actionRef={actionRef}
            />

            {/* * 添加平台成本 */}
            <SellCost
                config={{ modifyConfig: isModalCostOpen, setModifyConfig: setIsModalCostOpen }}
                item={{ allID }}
                actionRef={actionRef}
                setCostProps={setCostProps}
            />
            {/* * 成本抽屉 */}
            <CostDrawer {...costProps} storeId={storeId} open={open} onClose={onClose} />

            {/* * 编辑渠道 */}
            <ShopChannelModifyModal
                config={{ modifyEditConfig, setModifyEditConfig }}
                item={{ id: modifyEditConfig.id ?? "" }}
                actionRef={actionRef}
            />
        </>
    )
}

// TODO 用户店铺列表
const UserListTable: FC = () => {
    const actionRef: React.Ref<ActionType | undefined> = useRef()
    const [refreshKey, setRefreshKey] = useState<number>(0)
    const [modifyConfig, setModifyConfig] = useState<ModifyConfigProps<TableListItem>>({
        isOpen: false,
        isLoading: false,
    })

    const { fetchDataFromAPI, pagination, deleteService, loading } = useTable<
        UserStoreType,
        UserParams,
        { userId: string; storeId: string }
    >({}, getStoreStaffListAPI, delStoreDitchAPI)

    const onFinishStaffStore: FormProps<{ id: string; storeId: string }>["onFinish"] = async (
        values
    ) => {
        // console.log("表单值为: ", values)
        const shop = {
            id: values.id,
            storeId: values.storeId,
        }
        const result = await addStoreStaffAPI(shop.id, shop.storeId)
        if (result.data) {
            message.success(result.message)
            actionRef.current?.reload()
            return true
        } else return false
    }

    return (
        <>
            <ProTable<UserStoreType, { userId: string }>
                debounceTime={800}
                actionRef={actionRef}
                request={fetchDataFromAPI}
                columns={userColumns(setModifyConfig, actionRef)}
                rowKey={"storeId"}
                expandable={{
                    expandedRowRender: (record) => (
                        <UStoreDitchTable storeId={record.storeId} refreshKey={refreshKey} />
                    ),
                }}
                search={searchConfig}
                dateFormatter="string"
                headerTitle="店铺负责人列表"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                }}
                loading={loading}
                toolBarRender={() => [
                    <MyModalForm
                        key={"addUser"}
                        title="添加店铺员工"
                        btnName="添加员工店铺"
                        onFormSubmit={onFinishStaffStore}
                    >
                        <>
                            <MyFormSelect name="id" label="选择员工" type="user" />
                            <MyFormSelect name="storeId" label="选择店铺" type="store" />
                        </>
                    </MyModalForm>,
                ]}
            />

            {modifyConfig.data && (
                <ShopModifyModal
                    config={{ modifyConfig, setModifyConfig }}
                    actionRef={actionRef}
                    setRefreshKey={setRefreshKey}
                />
            )}
        </>
    )
}

export default function UserStoreStartTable() {
    return (
        <StartProvider>
            <UserListTable />
        </StartProvider>
    )
}
