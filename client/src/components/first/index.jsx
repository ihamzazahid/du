import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const First = () => {
  const navigate = useNavigate();

  const [ip_address, setIpAddress] = useState("");
  const [user_name, setUsername] = useState("");
  const [password, setPasword] = useState("");

  const [checked_Values, setAllCheckedValues] = useState("");

  const handleSubmit = () => {
    const data = {
      ip_address,
      user_name,
      password,
      checked_Values,
    };
    // axios
    //   .post("http://localhost:5000/addCpe", data)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // navigate("/second", {
    //   state: {
    //     AllData: data,
    //   },
    // });
    console.log(data);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
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
      <Form
        // labelCol={{
        //   span: 8,
        // }}
        // wrapperCol={{
        //   span: 16,
        // }}

        onSubmit={handleSubmit}
      >
        <p style={{ fontSize: "16px" }}>Add Single Device</p>
        <div style={{ textAlign: "center" }}>
          <Form.Item
            //   label="IP Addres"
            // name="ip_address"
            style={{ margin: "0", marginBottom: "5px" }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input your IP Address!",
            //   },
            // ]}
          >
            <label
              style={{
                backgroundColor: "#84B8E6",
                padding: "6px",
                borderTopLeftRadius: "10px",
                textAlign: "center",
                color: "white",
                paddingRight: "18px",
                paddingLeft: "18px",
              }}
            >
              IP Address
            </label>
            &nbsp;&nbsp;&nbsp;
            <Input
              //   name="ip_address"
              value={ip_address}
              onChange={(e) => {
                setIpAddress(e.target.value);
              }}
              style={{ width: "50%", backgroundColor: "#EEEEEE" }}
              required
            />
          </Form.Item>
          <Form.Item
            //   label="Username"
            // name="user_name"
            style={{ margin: "0", marginBottom: "5px" }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input your username!",
            //   },
            // ]}
          >
            <label
              style={{
                backgroundColor: "#84B8E6",
                padding: "6px",
                textAlign: "center",
                color: "white",
                paddingRight: "18px",
                paddingLeft: "18px",
              }}
            >
              Username
            </label>
            &nbsp;&nbsp;&nbsp;
            <Input
              //   name="user_name"
              value={user_name}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              style={{ width: "50%", backgroundColor: "#EEEEEE" }}
              required
            />
          </Form.Item>

          <Form.Item
            //   label="Password"
            style={{ margin: "0", marginBottom: "5px" }}
            // name="password"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please input your password!",
            //   },
            // ]}
          >
            <label
              style={{
                backgroundColor: "#84B8E6",
                padding: "6px",
                borderBottomLeftRadius: "10px",

                textAlign: "center",
                color: "white",
                paddingRight: "20px",
                paddingLeft: "20px",
              }}
            >
              Password
            </label>
            &nbsp;&nbsp;&nbsp;
            <Input
              //   name="password"
              value={password}
              onChange={(e) => {
                setPasword(e.target.value);
              }}
              type="password"
              style={{ width: "50%", backgroundColor: "#EEEEEE" }}
              required
            />
          </Form.Item>
        </div>
        <Form.Item>
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
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#5abb64",
              color: "white",
              padding: "0px",
              width: "25%",
              margin: "0 auto",
            }}
            htmlType="submit"
          >
            Start
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default First;
