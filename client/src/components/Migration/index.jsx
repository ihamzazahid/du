import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Checkbox,
  Table,
  Tag,
  Space,
  Modal,
} from "antd";

import {
  MainSearch,
  DisplayArea,
  InputStyled,
  TagComponents,
  TagComponentText,
  TagComponentClose,
  TableStyling,
} from "./Mig.styled.js";

import TagComponent from "./TagComponent.js";
import axios, { baseUrl } from "../../axios";

// import "./MultiSearch.scss";

const Migration = () => {
  const { Search } = Input;
  const onSearch = (value) => console.log(value);
  const [tags, setTags] = useState([]);
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");

  const inputValueChangeHandler = (inputChange) => {
    setInputValue(inputChange);
    console.log(inputChange);
    if (inputChange[inputChange.length - 1] === ",") {
      setTags([...tags, inputChange.slice(0, inputChange.length - 1)]);
      setInputValue("");
    }
  };
  const cullTagFromTags = (tag) => {
    setTags([...tags.filter((element) => element !== tag)]);
  };
  console.log(tags);

  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchData] = useState("");

  const [checked, setChecked] = useState(false);
  const [checkedSecInput, setCheckedSecInput] = useState(false);

  const [listening_port, setListeningPort] = useState("");
  const [ip_to_fqdn, setIp_to_fqdn] = useState("");

  const [disabled, setDisabled] = useState(false);

  const { Column, ColumnGroup } = Table;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    const data_needed = { listening_port, ip_to_fqdn };
    console.log(data_needed);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toggleChecked = () => {
    setChecked(!checked);
  };
  const toggleSecInputChecked = () => {
    setCheckedSecInput(!checkedSecInput);
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

  const data = [
    {
      key: "1",
      ip: "John",
      phoneNumber: ["nice", "developer"],
    },
  ];

  const migrationColumns = [
    {
      title: "Port Number",
      dataIndex: "port_number",
    },
    {
      title: "IP",
      dataIndex: "ip",
    },
  ];

  const migrationData = [
    {
      key: "1",
      port_number: "45556666",
      ip: "190.89.19.8",
    },
  ];
  const SearhHandler = () => {
    setShowForm(true);
    const Data = { searchData };
    console.log(Data);
  };
  const SearchItems = () => {
    setShowForm(true);
    console.log(tags);
    axios
      .post(baseUrl + "/getPhonesFromCpes", tags)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ width: "50%", margin: "0 auto" }}>
      <div style={{ magin: "0 auto", textAlign: "center", marginTop: "5%" }}>
        <div style={{ display: "flex" }}>
          <MainSearch style={{ marginTop: "5%" }}>
            <DisplayArea>
              {tags.map((tag) => (
                <TagComponent text={tag} cullTagFromTags={cullTagFromTags} />
              ))}
            </DisplayArea>
            <Search
              style={{ background: "none", color: "black" }}
              ref={inputRef}
              value={inputValue}
              onChange={(event) => inputValueChangeHandler(event.target.value)}
              placeholder="separate by Comma"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={SearchItems}
            />
            {/* <input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={(event) => inputValueChangeHandler(event.target.value)}
              placeholder="separated by commas"
              className="tagArea__input"
            /> */}
          </MainSearch>
          {/* <button className="tagArea__button" onClick={SearchItems}>
            Search
          </button> */}
        </div>
        {/* <Input
          type="text"
          style={{ width: "25%" }}
          name="searchData"
          value={searchData}
          onChange={(e) => {
            setSearchData(e.target.value);
          }}
        />
        &nbsp;&nbsp;
        <Button type="primary" onClick={SearhHandler}>
          Search
        </Button> */}
      </div>
      {showForm ? (
        <div style={{ marginTop: "2%" }}>
          <TableStyling
            dataSource={data}
            pagination={false}
            style={{ width: "80%", margin: "2% auto" }}
          >
            <Column title="IP" dataIndex="ip" key="ip" />
            <Column
              title="Phone Number"
              dataIndex="phoneNumber"
              key="phoneNumber"
              render={(phoneNumber) => (
                <>
                  {phoneNumber.map((phoneNumber) => (
                    <Tag color="blue" key={phoneNumber}>
                      {phoneNumber}
                    </Tag>
                  ))}
                </>
              )}
            />
          </TableStyling>
          <div style={{ textAlign: "left", marginTop: "7%" }}>
            <div style={{ marginTop: "3%", marginBottom: "2%" }}>
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
                        name="listening_port"
                        value={listening_port}
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
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={showModal}
              style={{ backgroundColor: "#5abb64", color: "white" }}
            >
              Start Migration
            </Button>
          </div>

          <Modal
            title="Migration Form"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Table
              columns={migrationColumns}
              dataSource={migrationData}
              pagination={false}
            />
          </Modal>
        </div>
      ) : null}
    </div>
  );
};

export default Migration;
