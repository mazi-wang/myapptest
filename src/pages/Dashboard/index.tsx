import { Button, Col, Result, Row } from "antd"
import { styled } from "styled-components"
import Visits from "@/pages/Dashboard/components/Visits"
import { SmileOutlined } from "@ant-design/icons"

const DashboardBox = styled.div`
    display: grid;
    grid-gap: 10px;
`

const Dashboard = () => {
    return (
        <DashboardBox>
            {/* <Row gutter={[20]}>
                <Col span={6}>
                    <Visits />
                </Col>
                <Col span={6}>
                    <Visits />
                </Col>
                <Col span={6}>
                    <Visits />
                </Col>
                <Col span={6}>
                    <Visits />
                </Col>
            </Row> */}

            <Result
                icon={<SmileOutlined />}
                title="欢迎来到羊羊财务管理系统"
                // extra={<Button type="primary">Next</Button>}
            />
        </DashboardBox>
    )
}

export default Dashboard
