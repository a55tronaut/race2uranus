import { Space, Button, Dropdown, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: <Link to="/about">ABOUT</Link>,
      },
      {
        key: '2',
        label: <Link to="/lore">LORE</Link>,
      },
      {
        key: '3',
        label: <Link to="/leaderboard">LEADERBOARD</Link>,
      },
      {
        key: '4',
        label: (
          <a href="https://discord.gg/TdkFpqnAch" rel="noreferrer" target="_blank">
            COMMUNITY <img className="discord" src="/assets/discord.svg" alt="Discord" style={{ height: '20px' }} />
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
        <Space>
          <Button icon={<MenuOutlined />} size="large" />
        </Space>
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
