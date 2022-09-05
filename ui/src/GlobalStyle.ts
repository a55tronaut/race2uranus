import 'antd/dist/antd.dark.css';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body,
  html {
    height: 100%;
    font-family: Roboto Mono;
    font-size: 10px;
    font-weight: 300;
    box-sizing: border-box;
  }

  #root {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 1.4rem;

    > main {
      flex: 1;
    }
  }

  h1 {
    font-family: Orbitron;
    font-size: 32px !important;
    font-style: normal;
    font-variant: normal;
    font-weight: 700 !important;
    line-height: 23px !important;
    letter-spacing: 0.1em;
  }

  h2 {
    font-family: Orbitron;
    font-size: 28px !important;
    font-style: normal;
    font-variant: normal;
    font-weight: 700 !important;
    line-height: 23px !important;
    letter-spacing: 0.1em;
  }

  h3 {
    font-family: Orbitron;
    font-size: 24px !important;
    font-style: normal;
    font-variant: normal;
    font-weight: 700 !important;
    line-height: 23px !important;
    letter-spacing: 0.1em;
  }

  h4 {
    font-family: Orbitron;
    font-size: 21px !important;
    font-style: normal;
    font-variant: normal;
    font-weight: 700 !important;
    line-height: 23px !important;
    letter-spacing: 0.1em;
  }

  .ant-btn > span {
    text-transform: uppercase;
    color: white;
    font-family: Orbitron;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .ant-btn-background-ghost.ant-btn-primary {
    color: #009bff;
    border-color: #009bff;
  }

  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    padding: 10px 50px 10px 20px;
  }

  .ant-dropdown-menu {
    background-color: rgba(0, 0, 0, 0.5);
    border: solid 1px;
    border-color: #009bff;
  }

  .ant-table {
    border: 1px solid #009bff;
    border-radius: 5px;
    background: none;
  }
  .ant-table-container, .ant-table-content {
    border-radius: 5px;
    table {
      border-radius: 5px;
    }
  }
  .ant-table-thead > tr > th {
    font-weight: bold;
    font-size: 12px;
    border-bottom: 1px solid #009bff;
    background: rgba(0, 0, 0, 0.8);
  }
  .ant-table-tbody > tr > td {
    border: none;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.65);
  }
  .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: rgba(0, 0, 0, 0.75);
  }
  .ant-table-container table > thead > tr:first-child th:first-child {
    border-top-left-radius: 5px;
  }
  .ant-table-container table > thead > tr:first-child th:last-child {
    border-top-right-radius: 5px;
  }
  .ant-table-container table > tbody > tr:last-child td:first-child {
    border-bottom-left-radius: 5px;
  }
  .ant-table-container table > tbody > tr:last-child td:last-child {
    border-bottom-right-radius: 5px;
  }

  .anticon {
    color: #009bff;
    font-size: 25px;
  }

  .ant-modal {
    border: 1px;
    border-radius: 5px;
    border-style: solid;
    border-color: #009bff;
    opacity: 0.85;
  }
  .ant-modal-content {
    border-radius: 5px;
  }
  .ant-modal-body {
    background-color: #15001d;
  }
`;

export default GlobalStyle;
