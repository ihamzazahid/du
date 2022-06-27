import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Checkbox,
  Form,
  Spin,
  Alert,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios, { baseUrl } from "../../axios";
import * as XLSX from "xlsx";

import { StyledImportFileInput } from "./First.styled.js";

import "antd/dist/antd.css";

const FirstLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [ip_address, setIpAddress] = useState("");
  const [user_name, setUsername] = useState("");
  const [password, setPasword] = useState("");
  const [importLoading,setImportLoading]=useState(false)

  const [checked_values, setAllCheckedValues] = useState("");

  const [checkedThirdInput, setCheckedThirdInput] = useState(true);
  const [chk, setChk] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ip_address,
      user_name,
      password,
      checked_values,
    };
    axios
      .post(baseUrl + "/addCpe", data)
      .then((res) => {
        navigate("/fourth", {
          state: {
            AllData: data,
          },
        });
        console.log(res);
        setLoading(false);
        message.success("Succesfully Login to ", ip_address);
      })
      .catch((error) => {
        setLoading(false);
        message.error("Failed to ADD CPE Device");
      
        console.log(error);
      });

    // navigate("/fourth", {
    //   state: {
    //     AllData: data,
    //   },
    // });
    console.log(data);
  };

  //   const onChangeThirdCheckBox = (e) => {
  //     console.log("checked = ", e.target.checked);
  //     setCheckedThirdInput(e.target.checked);
  //   };
  function onChange(checkedValues) {
    setAllCheckedValues(checkedValues);
    console.log("checked = ", checkedValues);
  }

   useEffect(() => {
     inputRef.current.addEventListener("input", importExcel);
   }, []);

  const postSeed = async (data) => {
    // 
    console.log("excel",data);
    setImportLoading(true);
    axios
    .post(baseUrl + "/addCpes", data)
    .then((res) => {
      navigate("/fourth", {
        state: {
          AllData: data,
        },
      });
      console.log(res);
      setImportLoading(false);
      setLoading(false);
      message.success("Succesfully Login ",);
    })
    .catch((error) => {
      setLoading(false);
      message.error("Failed to ADD CPE Devices");
    
      console.log(error);
    });





  };

  const convertToJson = (headers, fileData) => {
    let rows = [];
    fileData.forEach((row) => {
      const rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    rows = rows.filter((value) => JSON.stringify(value) !== "{}");
    return rows;
  };

  const importExcel = (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, {
        header: 1,
        raw: false,
      });
      const headers = fileData[0];
      // const heads = headers.map((head) => ({ title: head, field: head }));
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);
      // console.log(excelData);
      postSeed(data);
   
      // setRowCount(data.length);
      // setDataSource(data);
    };
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <div
        style={{
          margin: "auto",
          width: "40%",
          padding: "10px",
        }}
      >
        <div style={{ marginTop: "4%" }}>
        <Spin spinning={importLoading} tip="Fetching Data from Device. Please Wait..." 
        style={{marginRight:"50%",marginTop:"3%"}}>
          <StyledImportFileInput
            type="file"
            value={inputValue}
            onChange={() => importExcel}
            ref={inputRef}
          />
          </Spin>
          {/* <Button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "#84B8E6",
            color: "#fff",

            margin: "0 auto",

            display: "block",
          }}
        >
          + Add Devices
        </Button> */}
        </div>

        {/* {showForm ? ( */}
        <form onSubmit={handleSubmit} style={{marginTop:"1%"}}>
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
                      color: "white",
                      // paddingRight: "20px",
                      // paddingLeft: "20px",
                    }}
                  >
                    IpAddress
                  </p>
                </Col>
                &nbsp;&nbsp;
                <Col span={18}>
                  <input
                    name="ip_address"
                    value={ip_address}
                    onChange={(e) => {
                      setIpAddress(e.target.value);
                    }}
                    type="text"
                    required
                    style={{
                      width: "85%",
                      backgroundColor: "#EEEEEE",
                      border: "none",
                      padding: "6px",
                    }}
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
                      color: "white",
                      // paddingLeft: "20px",
                    }}
                  >
                    Username
                  </p>
                </Col>
                &nbsp;&nbsp;
                <Col span={18}>
                  <input
                    name="user_name"
                    value={user_name}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    type="text"
                    required
                    style={{
                      width: "85%",
                      backgroundColor: "#EEEEEE",
                      border: "none",
                      padding: "6px",
                    }}
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
                      color: "white",
                      // paddingLeft: "20px",
                    }}
                  >
                    Password
                  </p>
                </Col>
                &nbsp;&nbsp;
                <Col span={18}>
                  <input
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPasword(e.target.value);
                    }}
                    required
                    type="password"
                    style={{
                      width: "85%",
                      backgroundColor: "#EEEEEE",
                      border: "none",
                      padding: "6px",
                    }}
                  />
                </Col>
              </Row>
            </div>
            <div style={{ marginTop: "8%" }}>
              <p style={{ fontSize: "16px" }}>
                Check the boxes which info is need to fetch
              </p>

              <Checkbox.Group style={{ width: "100%" }} onChange={onChange}
              defaultValue={[
                "model",
                "serial",
                "mac_address",
                "phone_line_info",
                "client_credientials",
              ]}
              >
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
          </div>
          <div style={{ marginTop: "8%" }}>
            <Button
              htmlType="submit"
              // onClick={handleSubmit}
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
        </form>
        {/* ) : null} */}
      </div>
    </Spin>
  );
};

export default FirstLayout;
