import { Table, Alert } from 'antd';
import type { TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';

interface Movie {
  item_rank: number;
  chinese_name: string;
  original_name: string;
  director: string;
  score: number;
  countries: string;
  genres: string;
}

const columns: TableColumnsType<Movie> = [
  { title: '排名', dataIndex: 'item_rank', sorter: (a, b) => a.item_rank - b.item_rank },
  { title: '中文名', dataIndex: 'chinese_name' },
  { title: '原名', dataIndex: 'original_name' },
  { title: '导演', dataIndex: 'director', width: 200 },
  { title: '评分', dataIndex: 'score', sorter: (a, b) => a.score - b.score },
  { title: '国家', dataIndex: 'countries' },
  { title: '类型', dataIndex: 'genres' },
];

const MovieTable = () => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5001/data')
      .then(res => {
        if (!res.ok) throw new Error('网络响应失败');
        return res.json();
      })
      .then(data => setData(data))
      .catch(error => {
        console.error('数据获取失败:', error);
        setError('获取数据失败，请稍后重试');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(record) => `${record.chinese_name}-${record.item_rank}`}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default MovieTable;
