import React, { useState } from "react";
import { Button, Input, Row, Col, Checkbox, Modal } from "antd";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const SecondLayout = () => {
  const location = useLocation();
  console.log("ipAddress", location.state.AllData.ipAddress);
  console.log("username", location.state.AllData.username);
  console.log("password", location.state.AllData.pasword);
  console.log("allCheckedValues", location.state.AllData.allCheckedValues[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const ConfirmButton = () => {
    Swal.fire({
      icon: "success",
      title: "All Phone Line are Registered",
      timer: 5000,
    });
  };
  const NotConfirmButton = () => {
    Swal.fire({
      icon: "error",
      title: "Phone Line not Registered",
      timer: 5000,
    });
  };

  return (
    <div style={{ margin: "5%", marginBottom: "8%" }}>
      <p style={{ fontSize: "16px", fontWeight: "bold" }}>
        Fetching Information
      </p>
      <div
        style={{
          margin: "0 auto",

          display: "block",
        }}
      >
        <Row>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                borderTopLeftRadius: "10px",
                color: "#fff",
              }}
            >
              Model
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                color: "#fff",
                margin: "2px",
              }}
            >
              FWV
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                color: "#fff",
              }}
            >
              S/N
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                color: "#fff",
              }}
            >
              MAC
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                color: "#fff",
              }}
            >
              Phone Line 1
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                borderTopRightRadius: "10px",
                color: "#fff",
              }}
            >
              Phone Line 2
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
                borderBottomLeftRadius: "10px",
              }}
            >
              MT 4012
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              46.1.2142
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              20100135
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              0090f80e1cbe
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              123-3464234
            </p>
          </Col>
          <Col span={4}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
                borderBottomRightRadius: "10px",
              }}
            >
              123-3464234
            </p>
          </Col>
        </Row>
      </div>
      <div
        style={{
          width: "50%",
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: "16px", marginTop: "8%", fontWeight: "bold" }}>
          Migration
        </p>
        <Row>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                borderTopLeftRadius: "10px",
                color: "#fff",
              }}
            >
              Model
            </p>
          </Col>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                color: "#fff",
                margin: "2px",
              }}
            >
              FWV
            </p>
          </Col>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                color: "#fff",
              }}
            >
              S/N
            </p>
          </Col>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "#84B8E6",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                color: "#fff",
                borderTopRightRadius: "10px",
              }}
            >
              MAC
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
                borderBottomLeftRadius: "10px",
              }}
            >
              MT 4012
            </p>
          </Col>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              46.1.2142
            </p>
          </Col>

          <Col span={6}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            >
              1233464234
            </p>
          </Col>
          <Col span={6}>
            <p
              style={{
                backgroundColor: "##F9F9F9",
                textAlign: "center",
                padding: "8px",
                margin: "2px",
                border: "1px solid rgba(0,0,0,0.4)",
                borderBottomRightRadius: "10px",
              }}
            >
              1233464234
            </p>
          </Col>
        </Row>

        <p
          style={{
            fontSize: "16px",
            marginTop: "8%",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Confirm Phone Registration from vIMS
        </p>
        <div
          style={{
            marginTop: "8%",
            marginBottom: "8%",
            margin: "10px auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Button
            onClick={ConfirmButton}
            style={{
              backgroundColor: "#5abb64",
              color: "#fff",
              padding: "0px",
              //   height: "10%",
              width: "150px",
              fontSize: "16px",
              textAlign: "center",
              display: "inlineBlock",
            }}
          >
            Confirm
          </Button>

          <Button
            onClick={NotConfirmButton}
            style={{
              backgroundColor: "#C65F32",
              color: "#fff",
              padding: "0",
              //   height: "10%",
              width: "150px",
              display: "inlineBlock",
              marginLeft: "2%",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            Not Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecondLayout;
