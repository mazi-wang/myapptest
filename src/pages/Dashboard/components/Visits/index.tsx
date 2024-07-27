import { styled } from "styled-components"
import { Divider } from "antd"

const VisitBox = styled.div`
    display: flex;
    flex-direction: column;
    height: 170px;
    padding: 20px 20px 0;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.26);
    font-family: sans-serif;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
    }

    .top-text {
        height: 15%;
        margin: 0;
        font-weight: bolder;
        font-size: 20px;
    }

    .middle-data {
        height: 30%;
        margin: 0;
        font-size: 25px;
    }

    .divider {
        margin: 0;
    }

    .content {
        display: flex;
        align-items: center;
        height: 35%;
    }

    .bottom-text {
        display: flex;
        align-items: center;
        height: 20%;
        font-weight: bolder;

        .percent {
            color: red;
            font-size: 18px;
        }
    }
`

export default () => {
    return (
        <VisitBox>
            <h2 className="top-text">访问量</h2>
            <span className="middle-data">8846</span>
            <div className="content">这里是数据</div>
            <Divider className="divider" />
            <div className="bottom-text">
                比昨日下降
                <span className="percent">50%</span>
            </div>
        </VisitBox>
    )
}
