import styled from "styled-components";
import { Table } from "antd";

export const TableStyling = styled(Table)`
width:100%;
border-radius:10px;
// display:flex;
// flex-wrap:wrap;
overflow: auto;
// white-space: nowrap;

  .ant-table-thead > tr > th {
    background-color: #84b8e6;
    color: white;
  }
  ant-table table {
    border-collapse: separete;
  }
  .ant-table-tbody {
    border-radius: 12px;
  }

  .ant-table-tbody {
    tr {
      border: 1px solid black;
      margin: 20px;
    }
  }
  .ant-table-thead > tr:first-child > th:last-child {
    border-top-right-radius: 12px;
  }
  .ant-table-tbody > tr:last-child > td:last-child {
    border-bottom-right-radius: 12px;
  }
  .ant-table-tbody > tr:first-child > td:first-child {
    border-bottom-left-radius: 12px;
  }
  .ant-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 12px;
  }

  //   .ant-table-tbody > tr:child > td:child {
  //     margin-left: 2px;
  //     margin-right: 2px;
  //   }
`;

export const StyledImportFileInput = styled.input`
  position: relative;
  cursor: pointer;
  height: 86%;
  border-radius: 3px;
  outline: 0;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover:after {
    height: 25px;
    background-color: #059140;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  &:after {
    height: 25px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background-color: #059142;
    font-weight: bolder;
    font-family: Montserrat-Regular;
    color: #fff;
    padding-top: 1.2%;
    font-size: 11px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "Import From Excel";
    border-radius: 5px;
  }
`;

