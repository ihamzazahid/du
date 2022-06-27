import styled from "styled-components";
import { Table } from "antd";

export const MainSearch = styled.div`
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 12px;
  width: 100%;
  margin: 0 auto;
`;
export const DisplayArea = styled.div`
  display: flex;
  margin-right: 10px;
`;

export const InputStyled = styled.input`
  margin-left: 1.5rem;
  border: none;
  outline: none;
  width: 250px;
  text-align: center;
`;

export const TagComponents = styled.div`
  display: flex;
  background-color: #40a9ff;
  padding: 5px;
  border-radius: 5px;
  margin-left: 3px;

  &:not(:first-child) {
    margin-left: 0.6rem;
  }
`;

export const TagComponentText = styled.div`
  color: white;
  font-family: sans-serif;
  font-size: 0.9rem;
`;
export const TagComponentClose = styled.div`
  margin-left: 0.3rem;
  font-size: 1rem;
  font-family: sans-serif;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
export const TableStyling = styled(Table)`
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
