import { useEffect } from 'react';
import { shortenAddress, useEthers } from '@usedapp/core';
import { Table, TableColumnsType, Typography } from 'antd';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { useSelectedRace } from '../../hooks';
import { INftLeaderboardResult } from '../../types';
import { orange } from '../../colors';
import NftImage from '../NftImage';
import { useNftLeaderboard } from './useNftLeaderboard';
import NftName from '../NftName';
import MagicAmount from '../MagicAmount';

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
        <NftImage className="nft" address={record.address} id={record.nftId} />{' '}
        <NftName address={record.address} id={record.nftId} />
      </div>
    ),
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    align: 'center',
    render: (owner) => owner && shortenAddress(owner),
  },
  {
    title: 'Wins',
    dataIndex: 'wins',
    align: 'right',
  },
  {
    title: 'Races',
    dataIndex: 'races',
    align: 'right',
  },
  {
    title: 'Earnings',
    dataIndex: 'earnings',
    align: 'right',
    render: (earnings) => (
      <div className="earnings">
        <MagicAmount amount={ethers.utils.parseEther(`${earnings}`)} />
      </div>
    ),
  },
];

function NftLeaderboard() {
  const { statusMeta } = useSelectedRace();
  const { account } = useEthers();
  const { items, loading, refreshItems } = useNftLeaderboard();

  useEffect(() => {
    if (statusMeta?.done) {
      refreshItems();
    }
  }, [refreshItems, statusMeta?.done]);

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
  padding: 48px 32px 96px 32px;

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

  .earnings span {
    color: ${orange};
  }

  .ant-table-row.owned > td {
    color: ${orange};
  }
`;

export default NftLeaderboard;
