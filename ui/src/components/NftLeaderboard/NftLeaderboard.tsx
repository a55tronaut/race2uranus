import { shortenAddress, useEthers } from '@usedapp/core';
import { Table, TableColumnsType, Typography } from 'antd';
import styled from 'styled-components';

import { INftLeaderboardResult } from '../../types';
import NftImage from '../NftImage';
import { useNftLeaderboard } from './useNftLeaderboard';

const { Title } = Typography;

const columns: TableColumnsType<INftLeaderboardResult> = [
  {
    title: '#',
    dataIndex: 'position',
    align: 'center',
    width: '40px',
    render: (pos) => String(pos).padStart(2, '0'),
  },
  {
    title: 'NFT',
    dataIndex: 'address',
    align: 'left',
    render: (_, record) => (
      <div>
        <NftImage className="nft" address={record.address} id={record.nftId} /> #{record.nftId}
      </div>
    ),
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    align: 'left',
    render: (owner) => owner && shortenAddress(owner),
  },
  {
    title: 'Winnings',
    dataIndex: 'winnings',
    align: 'right',
    render: (winnings) => (
      <div className="winnings">
        <img src="/assets/magic.svg" alt="MAGIC" />
        {winnings.toFixed(0)}
      </div>
    ),
  },
  {
    title: 'Races',
    dataIndex: 'races',
    align: 'right',
  },
];

function NftLeaderboard() {
  const { account } = useEthers();
  const { items, loading } = useNftLeaderboard();

  return (
    <Container>
      <Title level={3} className="title">
        Leaderboard
      </Title>
      <Table
        columns={columns}
        rowKey={(record) => `${record.address}.${record.nftId}`}
        rowClassName={(record) => (record.owner === account ? 'owned' : '')}
        loading={loading}
        dataSource={items}
        pagination={false}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    text-align: center;
    margin: 24px;
  }

  .ant-table-wrapper {
    width: 100%;
    max-width: 800px;
  }

  .nft {
    width: 40px;
  }

  .winnings {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    > img {
      height: 20px;
      margin-right: 8px;
    }
  }

  .ant-table-row.owned > td {
    color: #f7931e;
  }
`;

export default NftLeaderboard;
