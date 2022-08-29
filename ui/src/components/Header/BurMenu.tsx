import { Space, Button, Dropdown, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: <a href="/about">ABOUT</a>,
      },
      {
        key: '2',
        label: <a href="/lore">LORE</a>,
      },
      {
        key: '3',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="/">
            DOCS
          </a>
        ),
      },
    ]}
  />
);

function BurMenu() {
  return (
    <BurgerMenu>
      <Dropdown overlay={menu}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Button icon={<MenuOutlined />} size="large" />
          </Space>
        </a>
      </Dropdown>
    </BurgerMenu>
  );
}

const BurgerMenu = styled.div`
  margin-left: 1em;
  .ant-btn {
    border: none;
  }
`;

export default BurMenu;
