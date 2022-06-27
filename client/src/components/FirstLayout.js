import React, { useState } from "react";
import { Button, Input, Row, Col, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.css";
import SecondLayout from "./SecondLayout.js";

const FirstLayout = () => {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [pasword, setPasword] = useState("");
  const [listeningPort, setListeningPort] = useState("");
  const [ip_to_fqdn, setIp_to_fqdn] = useState("");
  const [allCheckedValues, setAllCheckedValues] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkedSecInput, setCheckedSecInput] = useState(false);
  const [checkedThirdInput, setCheckedThirdInput] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [chk, setChk] = useState(false);

  const handleSubmit = () => {
    const data = {
      ipAddress,
      username,
      pasword,
      listeningPort,
      allCheckedValues,
      ip_to_fqdn,
    };
    navigate("/second", {
      state: {
        AllData: data,
      },
    });
    console.log(data);
  };

  const toggleChecked = () => {
    setChecked(!checked);
  };
  const toggleSecInputChecked = () => {
    setCheckedSecInput(!checkedSecInput);
  };
  const toggleThirdInputChecked = () => {
    setCheckedThirdInput(!checkedThirdInput);
  };
  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  const onChangeCheckBox = (e) => {
    console.log("checked = ", e.target.checked);
    setChecked(e.target.checked);
  };
  const onChangeSecondCheckBox = (e) => {
    console.log("checked = ", e.target.checked);
    setCheckedSecInput(e.target.checked);
  };
  //   const onChangeThirdCheckBox = (e) => {
  //     console.log("checked = ", e.target.checked);
  //     setCheckedThirdInput(e.target.checked);
  //   };
  function onChange(checkedValues) {
    setAllCheckedValues(checkedValues);
    console.log("checked = ", checkedValues);
  }

  return (
    <div
      style={{
        margin: "auto",
        width: "40%",
        padding: "10px",
      }}
    >
      <div style={{ marginTop: "4%" }}>
        <Button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "#84B8E6",
            color: "#fff",

            margin: "0 auto",

            display: "block",
          }}
        >
          + Add Devices
        </Button>
      </div>

      {showForm ? (
        <div style={{ marginTop: "6%" }}>
          <p style={{ fontSize: "16px" }}>Add Single Device</p>
          <div style={{ marginTop: "1%" }}>
            <Row>
              <Col span={5}>
                <p
                  style={{
                    backgroundColor: "#84B8E6",
                    padding: "6px",
                    borderTopLeftRadius: "10px",
                    textAlign: "center",
                    // paddingRight: "20px",
                    // paddingLeft: "20px",
                  }}
                >
                  IpAddress
                </p>
              </Col>
              &nbsp;&nbsp;
              <Col span={18}>
                <Input
                  name="ipAddress"
                  value={ipAddress}
                  onChange={(e) => {
                    setIpAddress(e.target.value);
                  }}
                  type="text"
                  style={{ width: "70%", backgroundColor: "#EEEEEE" }}
                />
              </Col>
            </Row>
          </div>

          <div style={{ marginTop: "1%" }}>
            <Row>
              <Col span={5}>
                <p
                  style={{
                    backgroundColor: "#84B8E6",
                    padding: "6px",
                    // paddingRight: "20px",
                    textAlign: "center",
                    // paddingLeft: "20px",
                  }}
                >
                  Username
                </p>
              </Col>
              &nbsp;&nbsp;
              <Col span={18}>
                <Input
                  name="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  type="text"
                  style={{ width: "70%", backgroundColor: "#EEEEEE" }}
                />
              </Col>
            </Row>
          </div>

          <div>
            <Row>
              <Col span={5}>
                <p
                  style={{
                    backgroundColor: "#84B8E6",
                    padding: "6px",
                    borderBottomLeftRadius: "10px",
                    // paddingRight: "20px",
                    textAlign: "center",
                    // paddingLeft: "20px",
                  }}
                >
                  Password
                </p>
              </Col>
              &nbsp;&nbsp;
              <Col span={18}>
                <Input
                  name="password"
                  value={pasword}
                  onChange={(e) => {
                    setPasword(e.target.value);
                  }}
                  type="password"
                  style={{ width: "70%", backgroundColor: "#EEEEEE" }}
                />
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: "8%" }}>
            <p style={{ fontSize: "16px" }}>
              Check the boxes which info is need to fetch
            </p>

            <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
              <Row>
                <Col span={12}>
                  <Checkbox value="model">Model</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="serial">Serial</Checkbox>
                </Col>
                <Col span={12} style={{ marginTop: "3%" }}>
                  <Checkbox value="mac_address">MAC Address</Checkbox>
                </Col>
                <Col span={12} style={{ marginTop: "3%" }}>
                  <Checkbox value="phone_line_info">Phone Line Info</Checkbox>
                </Col>
                <Col span={12} style={{ marginTop: "3%" }}>
                  <Checkbox value="client_credientials">
                    Client Credientials
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>
          <div style={{ marginTop: "8%" }}>
            <p style={{ fontSize: "16px" }}>
              Check the boxes which info is need to fetch
            </p>

            {/* <Checkbox.Group style={{ width: "100%" }} onChange={onChange}> */}
            <Row>
              <Col span={24}>
                {/* <Checkbox value="model">Model</Checkbox> */}
                <Checkbox onClick={toggleChecked} onChange={onChangeCheckBox}>
                  Listining Port
                  {checked ? (
                    <Input
                      name="listeningPort"
                      value={listeningPort}
                      onChange={(e) => {
                        setListeningPort(e.target.value);
                      }}
                      type="text"
                      style={{
                        width: "60%",
                        backgroundColor: "#EEEEEE",
                        marginLeft: "6%",
                      }}
                    />
                  ) : null}
                </Checkbox>
              </Col>
            </Row>
            <Row style={{ marginTop: "2%" }}>
              <Col span={24}>
                {/* <Checkbox value="model">Model</Checkbox> */}
                <Checkbox
                  onClick={toggleSecInputChecked}
                  onChange={onChangeSecondCheckBox}
                >
                  SIP IP to FQDN
                  {checkedSecInput ? (
                    <Input
                      name="ip_to_fqdn"
                      value={ip_to_fqdn}
                      onChange={(e) => {
                        setIp_to_fqdn(e.target.value);
                      }}
                      type="text"
                      style={{
                        width: "60%",
                        backgroundColor: "#EEEEEE",
                        marginLeft: "6%",
                      }}
                    />
                  ) : null}
                </Checkbox>
              </Col>
            </Row>

            {/* </Checkbox.Group> */}
          </div>
          <div style={{ marginTop: "8%" }}>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#5abb64",
                color: "#fff",
                padding: "10px",
                height: "10%",
                width: "20%",
                margin: "0 auto",
                display: "block",
              }}
            >
              Start
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FirstLayout;
