// Adicione fontFamily: 'DM Sans, sans-serif' em todos os estilos inline relevantes

import React from 'react';

interface UserRanking {
  id: string;
  name: string;
  avatarUrl: string;
  taskCount: number;
}

const testData: UserRanking[] = [
  {
    id: "user123",
    name: "Gustavo Laureano",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D4D03AQHjYMQyjN56MQ/profile-displayphoto-shrink_200_200/B4DZecuRmpGYAY-/0/1750681066443?e=1756944000&v=beta&t=TAZWoWHkY3bBLHOX3en18D35QjcPBSH-kbFDebuSx2Q",
    taskCount: 98
  },
  {
    id: "user456",
    name: "Diego Antônio",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D4D03AQFH72WmP82IIw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1711559313001?e=1756944000&v=beta&t=RA61IWQaKddrXuAkf-eUTUPC5jGJ2HBkp_jTdjz1iB4",
    taskCount: 85
  },
  {
    id: "user789",
    name: "Paulo de Oliveira",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D4D03AQE58IgGYU6U7A/profile-displayphoto-shrink_200_200/B4DZY5l5wzHAAY-/0/1744722960201?e=1756944000&v=beta&t=TFAr2oRqw47gb2IP4Q60sZlmWzkwF7n7dYWTeB5Cp6A",
    taskCount: 72
  }
];

const rankColors = ['rgb(108, 0, 170)', 'rgb(147, 0, 184)', 'rgb(174, 0, 255)'];

const PodiumItem = ({ user, rank }: { user: UserRanking; rank: number }) => {
  const rankColor = rankColors[rank - 1] || '#8A8A8E';
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', fontFamily: 'DM Sans, sans-serif' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          border: `2px solid ${rankColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
          fontFamily: 'DM Sans, sans-serif'
        }}
      >
        {rank === 1 ? (
          <span role="img" aria-label="crown" style={{ color: rankColor, fontSize: 20, fontFamily: 'DM Sans, sans-serif' }}>👑</span>
        ) : (
          <span style={{ color: rankColor, fontWeight: 'bold', fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>{rank}</span>
        )}
      </div>
      <img src={user.avatarUrl} alt={user.name} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: 16, color: '#1C1C1E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'DM Sans, sans-serif' }}>{user.name}</div>
        <div style={{ fontSize: 14, color: '#8A8A8E', fontFamily: 'DM Sans, sans-serif' }}>{user.taskCount} tasks</div>
      </div>
    </div>
  );
};

const ListItem = ({ user, rank }: { user: UserRanking; rank: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '8px 5px', fontFamily: 'DM Sans, sans-serif' }}>
    <span style={{ width: 36, textAlign: 'center', fontSize: 14, color: '#8A8A8E', marginRight: 10, fontFamily: 'DM Sans, sans-serif' }}>{rank}</span>
    <img src={user.avatarUrl} alt={user.name} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 15 }} />
    <span style={{ flex: 1, fontSize: 15, color: '#1C1C1E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'DM Sans, sans-serif' }}>{user.name}</span>
    <span style={{ fontSize: 15, fontWeight: 600, color: '#34C759', fontFamily: 'DM Sans, sans-serif' }}>{user.taskCount}</span>
  </div>
);

interface RankingWidgetProps {
  data: UserRanking[];
  loading: boolean;
  error?: string | null;
}

const RankingWidget: React.FC<RankingWidgetProps> = ({ data = [], loading, error }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, fontFamily: 'DM Sans, sans-serif' }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, fontFamily: 'DM Sans, sans-serif' }}>
        <span style={{ color: 'red', fontSize: 14 }}>{error}</span>
      </div>
    );
  }

  const topThree = data.slice(0, 3);
  const restOfRanking = data.slice(3);

  return (
    <div
      style={{
        borderRadius: 15,
        background: '#fff',
        padding: 10,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: 500,
        margin: '0 auto',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      <div>
        {topThree.map((user, idx) => (
          <PodiumItem key={user.id} user={user} rank={idx + 1} />
        ))}
        {data.length > 3 && (
          <div style={{ height: 1, background: '#E5E5EA', margin: '10px 5px' }} />
        )}
      </div>
      <div>
        {restOfRanking.map((user, idx) => (
          <ListItem key={user.id} user={user} rank={idx + 4} />
        ))}
      </div>
    </div>
  );
};

// Use o componente assim para testar:
const RankingTest = () => (
  <RankingWidget data={testData} loading={false} />
);

export default RankingTest;
