import React, { useEffect, useState } from "react";
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
  message
} from "antd";
import { TableStyling,StyledImportFileInput } from "./Fourth.styled.js";
import { useLocation } from "react-router-dom";
import axios, { baseUrl } from "../../axios";
import * as XLSX from 'xlsx';



const FourthLayout = () => {

  const location = useLocation();
  const ip=location.state.AllData.ip_address;
  console.log("ipAddress", location.state.AllData.ip_address);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleIp, setIsModalVisibleIp] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);



  const [showForm, setShowForm] = useState(false);
  const [searchData, setSearchData] = useState("");

  const [checked, setChecked] = useState(false);
  const [checkedSecInput, setCheckedSecInput] = useState(false);

  const [listening_port, setListeningPort] = useState("");
  const [ip_to_fqdn, setIp_to_fqdn] = useState("");
  const [migration_status_data,setMigrationStatusData]=useState([])
  const [preMigData,setPreMigData]=useState([])
  const [postMigData,setPostMigData]=useState([])


  const [disabled, setDisabled] = useState(false);

  const { Column, ColumnGroup } = Table;    
  
  
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };
  // const handleOnboard = () => {
  //   if (selectedRowKeys.length > 0) {
  //     let filterRes = allData.filter((item) =>{
  //       console.log("filtered ip", item.cpe_ip_address)
  //       selectedRowKeys.includes(item.cpe_ip_address)
        
  //     }
  //     );

  //     // history.push({
  //     //   pathname: "/onboard",
  //     //   state: { detail: filterRes },
  //     // });
  //   } else {
  //     alert("No ip Selected.");
  //   }
  // };


  const showModal2 = async () => {
    const data_needed = { listening_port, ip_to_fqdn };
    console.log(data_needed);                               
     
    try {                                                                                                                                                                                                                                                                                        
      const res = await axios.get(
        baseUrl + "/getMigrationStatus"
      );                                                                                                                                                                                                                                                                           
      setMigrationStatusData(res.data);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      console.log(res.data);                                                                                    
    } catch (err) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      console.log(err);                                                                                                                                                                                                                                                                       
    }                                                                                         
    
    setIsModalVisible(true); 
  };

  const handleOk2 = () => {
    setIsModalVisible(false);
  };     
   
  const handleCancel2 = () => {
          setIsModalVisible(false);
  }     ;
      
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

  const [allData,setAllData]=useState([])
  const [secondTableData,setSecondTableData]=useState([])

  const d={ip_address:ip,}

  useEffect(() => {
const GetCpeDetail = async () => {
    try {
      const res = await axios.get(
        baseUrl + "/getCpeDetail",
        
      );
      setAllData(res.data)
      // console.log("Data",res.data.cpe_ip_address);
    } catch (err) {
      console.log(err);
    }
  };
  // ENRTeam123



  GetCpeDetail();

    // const GetCpeDetail = async () => {
    //   try {
    //     const res = await axios.get(
    //       baseUrl + "/getCpeDetail/"
    //     );
    //    console.log(res.data);
    //     console.log("GetCpeDetail ", res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // GetCpeDetail();

  }, []);

  useEffect(()=>{
if(!checked){
  setListeningPort(null);
}

  },[checked])

useEffect(()=>{
  if(!checkedSecInput){
    setIp_to_fqdn(null)
  }
},[checkedSecInput])

  const GetPhoneDetail = async (ip) => {
    console.log("getPhoneIp",ip);
    try {
   
      const res = await axios.post(
        baseUrl + "/getPhonesDetail",
        {ip_address:ip}
      );
      setSecondTableData(res.data)
      console.log("Data Second",res.data);
    } catch (err) {
      console.log(err);
    }
  };

const showModal=(ip)=>{
    setIsModalVisible(true);

}

  const startMig = async () => {
    // setIsModalVisible(true);
    const StartMigration = 
      {
        listening_port: listening_port, 
      ip_to_fqdn: ip_to_fqdn, 
      cp_ip_addresses:selectedRowKeys}
    ;

    try {
      const res = await axios.post(
        baseUrl + "/migratePhonesFromCp",
        StartMigration
      );
      console.log("Sent", res);
      message.success('Migration Started, Please wait for a while... ', 10);



    } catch (err) {
      console.log(err);
    }

  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const Firstdata = [
    {
      key: "1",
      cpe_ip_address: "John",
      user_name: ["nice", "developer"],
      password: ["nice", "developer"],
      registration_status: ["nice", "developer"],
    },
  ];
  // const MigStatusdata = [
  //   {
  //     key: "2",
  //     cpe_ip_address: [migration_status.cpe_ip_address],
  //     user_name:["nice", "developer"],
  //     registration_status: ["nice", "developer"],
  //     migration_status: ["nice", "developer"],
     
  //   },
  // ];
  const SecondColumns=[
      {
        title: "IP",
        dataIndex: "cpe_ip_address",
      },
      {
        title: "Username",
        dataIndex: "user_name",
      },
      {
        title: "Password",
        dataIndex: "password",
      },
      {
        title: "Registration Status",
        dataIndex: "registration_status",
      },
  ]
  const MigStatusColumns=[
      {
        title: "IP",
        dataIndex: "cpe_ip_address",
      },
      {
        title: "Username",
        dataIndex: "user_name",
      },
      {
        title: "Pre Migration Status",
        dataIndex: "pre_migration_status",
      },
      {
        title: "Registration Status",
        dataIndex: "registration_status",
      },
      {
        title: "migration_status",
        dataIndex: "migration_status",
      },
  ]
  const showModalIP = (ip) => {
    GetPhoneDetail(ip);
    setIsModalVisibleIp(true);
  };
  const handleOkIP = () => {
    setIsModalVisibleIp(false);
  };

  const handleCancelIP = () => {
    setIsModalVisibleIp(false);
  };
  const columns = [
    {
      title: "IP Address",
      dataIndex: "cpe_ip_address",
      render: (text,record) => (
        <span
          onClick={()=>showModalIP(record.cpe_ip_address)}
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
    
    >
          {text}
        </span>
      ),
    },
    {
      title: "Model",
      dataIndex: "model_number",
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
    },
    {
      title: "MAC",
      dataIndex: "mac_address",
    },
    {
      title: "Out-Bound IP",
      dataIndex: "outbound_ip",
    },
    {
      title: "Listening Port",
      dataIndex: "listening_port",
    },
    {
      title: "ACS url",
      dataIndex: "acs_url",
      render: (text) => (
        <a href={"acs_url"} target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: "CWMP Username",
      dataIndex: "cwmp_user_name",
    },
    {
      title: "CWMP Password",
      dataIndex: "cwmp_password",
      
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

  const headers=[
    {label:"Check Values", key:"check_values"},
    {label:"cpe_ip_address", key:"cpe_ip_address"},
    {label:"cpe_password", key:"cpe_password"},
    {label:"cpe_usernames", key:"cpe_username"},
    {label:"password", key:"password"},
    {label:"pre_migration_status", key:"pre_migration_status"},
    {label:"sw_type", key:"sw_type"},
    {label:"user_name", key:"user_name"},
    
    ]
    const jsonToExcel = (preMigData) => { 
      let wb = XLSX.utils.book_new();
      let binaryPreMigData = XLSX.utils.json_to_sheet(preMigData);
      XLSX.utils.book_append_sheet(wb, binaryPreMigData, "pre_migration");
      XLSX.writeFile(wb, "pre_migration.xlsx");
    };
    const ExportPreMigration = async () => {
      try {                                                                                                                                                                                                                                                                                        
        const res = await axios.get(
          baseUrl + "/exportPreCpes"
        );                                                                                                                                                                                                                                                                           

      jsonToExcel(res.data);
      message.success("Pre-Migration Data Exported")
      console.log("preMig",res.data)
                                                                                  
      } catch (err) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
       console.log(err);                                                                                                                                                                                                                                                                       
      } 
     
    
    }
  
    const jsonToExcel2 = (postMigData) => {
      let wb = XLSX.utils.book_new();
      let binaryPostMigData = XLSX.utils.json_to_sheet(postMigData);
      XLSX.utils.book_append_sheet(wb, binaryPostMigData, "post_migration");
      XLSX.writeFile(wb, "post_migration.xlsx");
 
    };

const ExportPostMigration=async()=>{
  try {                                                                                                                                                                                                                                                                                        
    const res = await axios.get(
      baseUrl + "/exportPostCpes"
    );                                                                                                                                                                                                                                                                                    
  jsonToExcel2(res.data);
message.success("Post Migration Data Exported")
    console.log("Post-Mig",res.data);                                                                                    
  } catch (err) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    console.log(err);                                                                                                                                                                                                                                                                       
  } 
}

  return (
    <div>
      <div style={{ padding: "2%", }}>
        <div style={{display:"flex"}}>
        <p style={{ fontSize: "16px", fontWeight: "bold",flex:"2.5" }}>CPE Information</p>
        <div style={{float:"right",paddingRight:"1%", flex:"1"}}>
        <Button
                onClick={ExportPreMigration}
                style={{
                  backgroundColor: "#3bbdc2",
                  color: "white",
                  marginBottom: "4%",
                  borderRadius:"3px"
                }}
              >
                Export Pre-Migration
              </Button>
             &nbsp; &nbsp;
              <Button
                onClick={ExportPostMigration}
                style={{
                  backgroundColor: "#3bbdc2",
                  color: "white",
                  borderRadius:"3px",
                  marginBottom: "4%",
                }}
              >
                Export Post-Migration
              </Button>
        </div>
        </div>
        <TableStyling 
                  rowSelection={rowSelection}
rowKey="cpe_ip_address"
        columns={columns} dataSource={allData} pagination={false} style={{width:"100%",paddingRight:"4%"}} />
      </div>
      <Modal
       width={750}
       title="Phone Lines" visible={isModalVisibleIp} onOk={handleOkIP} onCancel={handleCancelIP}>
      <TableStyling
              // dataSource={Firstdata}
              // pagination={false}
              columns={SecondColumns} dataSource={secondTableData} pagination={false}
              style={{ width: "100%", margin: "2% 1%" }}
            />
      </Modal>
      <Modal
       width={900}
        title="Migration Status"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          <div style={{ marginTop: "1%", textAlign: "center" }}>

       <TableStyling
              columns={MigStatusColumns} 
              dataSource={migration_status_data} 
              pagination={false}
           / >
             </div>
             </Modal>
              {/* <Column
                title="IP"
                dataIndex="cpe_ip_address"
                key="cpe_ip_address"
              /> */}
              {/* <Column
                title="IP"
                dataIndex="cpe_ip_address"
                key="cpe_ip_address"
                style={{ border: "1px solid black", width: "10%" }}
                render={(cpe_ip_address) => (
                  <>
                    {cpe_ip_address.map((cpe_ip_address) => (
                      <div
                        color="blue"
                        key={cpe_ip_address}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          paddingLeft: "12px",
                          borderRadius: "3px",
                        }}
                      >
                        {cpe_ip_address}
                      </div>
                    ))}
                  </>
                )}
              />
              <Column
                title="Username"
                dataIndex="user_name"
                key="user_name"
                style={{ border: "1px solid black", width: "10%" }}
                render={(user_name) => (
                  <>
                    {user_name.map((user_name) => (
                      <div
                        color="blue"
                        key={user_name}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          paddingLeft: "12px",
                          borderRadius: "3px",
                        }}
                      >
                        {user_name}
                      </div>
                    ))}
                  </>
                )}
              />
              <Column
                title="Registration Status"
                dataIndex="registration_status"
                key="registration_status"
                style={{ border: "1px solid black" }}
                render={(registration_status) => (
                  <>
                    {registration_status.map((registration_status) => (
                      <div
                        color="blue"
                        key={registration_status}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          borderRadius: "3px",
                          paddingLeft: "12px",
                        }}
                      >
                        {registration_status}
                      </div>
                    ))}
                  </>
                )}
              />
              <Column
                title="Migration Status"
                dataIndex="migration_status"
                key="migration_status"
                style={{ border: "1px solid black" }}
                render={(migration_status) => (
                  <>
                    {migration_status.map((migration_status) => (
                      <div
                        color="blue"
                        key={migration_status}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          borderRadius: "3px",
                          paddingLeft: "12px",
                        }}
                      >
                        {migration_status}
                      </div>
                    ))}
                  </>
                )}
              /> */}
           
      <div style={{ width: "60%", margin: "0 auto" }}>
          {/* <p style={{ fontSize: "16px", fontWeight: "bold" }}>Details</p> */}

          <div style={{ marginTop: "1%", textAlign: "center" }}>
          {/* <TableStyling
              // dataSource={Firstdata}
              // pagination={false}
              columns={SecondColumns} dataSource={secondTableData} pagination={false}
              style={{ width: "100%", margin: "2% 1%" }}
            >
              <Column
                title="IP"
                dataIndex="cpe_ip_address"
                key="cpe_ip_address"
              />
               <Column
                title="IP"
                dataIndex="cpe_ip_address"
                key="cpe_ip_address"
                style={{ border: "1px solid black", width: "10%" }}
                render={(cpe_ip_address) => (
                  <>
                    {cpe_ip_address.map((cpe_ip_address) => (
                      <div
                        color="blue"
                        key={cpe_ip_address}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          paddingLeft: "12px",
                          borderRadius: "3px",
                        }}
                      >
                        {cpe_ip_address}
                      </div>
                    ))}
                  </>
                )}
              /> 
               <Column
                title="Username"
                dataIndex="user_name"
                key="user_name"
                style={{ border: "1px solid black", width: "10%" }}
                render={(user_name) => (
                  <>
                    {user_name.map((user_name) => (
                      <div
                        color="blue"
                        key={user_name}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          paddingLeft: "12px",
                          borderRadius: "3px",
                        }}
                      >
                        {user_name}
                      </div>
                    ))}
                  </>
                )}
              />
              <Column
                title="Password"
                dataIndex="password"
                key="password"
                style={{ border: "1px solid black" }}
                render={(password) => (
                  <>
                    {password.map((password) => (
                      <div
                        color="blue"
                        key={password}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          borderRadius: "3px",
                          paddingLeft: "12px",
                        }}
                      >
                        {password}
                      </div>
                    ))}
                  </>
                )}
              />
              <Column
                title="Registration Status"
                dataIndex="registration_status"
                key="registration_status"
                style={{ border: "1px solid black" }}
                render={(regStatus) => (
                  <>
                    {regStatus.map((regStatus) => (
                      <div
                        color="blue"
                        key={regStatus}
                        style={{
                          border: "1px solid rgba(0,0,0,0.1)",
                          marginBottom: "3px",
                          padding: "5px",
                          borderRadius: "3px",
                          paddingLeft: "12px",
                        }}
                      >
                        {regStatus}
                      </div>
                    ))}
                  </>
                )}
              /> 
            </TableStyling> */}
            <div style={{ textAlign: "left", marginTop: "7%" }}>
              <div style={{ marginTop: "3%", marginBottom: "2%" }}>
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Check the boxes which info is need to Migrate
                </p>

                {/* <Checkbox.Group style={{ width: "100%" }} onChange={onChange}> */}
                <Row>
                  <Col span={24}>
                    {/* <Checkbox value="model">Model</Checkbox> */}
                    <Checkbox
                      onClick={toggleChecked}
                      onChange={onChangeCheckBox}
                    >
                      Listening Port
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
                      ) :null}

                      
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
                            marginLeft: "4%",
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
{/* {selectedRowKeys.length >=1?  */}
              <Button
                onClick={startMig}
                style={{
                  backgroundColor: "#5abb64",
                  color: "white",
                  marginBottom: "4%",
                  borderRadius:"3px",

                }}
              >
                Start Migration
              </Button>
{/* :
message.error("error")

              } */}
 &nbsp; &nbsp;
              <Button
                onClick={showModal2}
                style={{
                  backgroundColor: "#5abb64",
                  color: "white",
                  marginBottom: "4%",
                  borderRadius:"3px",

                }}
              >
                Migration Status
             
              </Button> &nbsp; &nbsp;
             
            </div>
          </div>
        </div>
    </div>
  );
};

export default FourthLayout;
