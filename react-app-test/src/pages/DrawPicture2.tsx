import ReactECharts from 'echarts-for-react';
import { Table, Alert } from 'antd';
import type { TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';

// 电影数据类型定义
interface Movie {
  item_rank: number;
  chinese_name: string;
  original_name: string;
  director: string;
  score: number;
  countries: string;
  genres: string;
}

const MovieDashboard = () => {
  // 状态管理
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 表格列配置
  const columns: TableColumnsType<Movie> = [
    {
      title: '排名',
      dataIndex: 'item_rank',
      sorter: (a, b) => a.item_rank - b.item_rank,
      width: 80,
    },
    {
      title: '中文名',
      dataIndex: 'chinese_name',
      ellipsis: true,
    },
    {
      title: '原名',
      dataIndex: 'original_name',
      ellipsis: true,
    },
    {
      title: '评分',
      dataIndex: 'score',
      sorter: (a, b) => a.score - b.score,
      render: (score: number) => (
        <span style={{ color: score >= 9 ? '#ff4d4f' : '#52c41a' }}>
          {score.toFixed(1)}
        </span>
      ),
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'genres',
      render: (genres: string) => genres.split(' ').join(' / '),
    },
  ];

  // 获取电影数据
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/data');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // TOP10电影评分柱状图配置
  const getBarOption = () => {
    const top10Movies = [...movies]
      .sort((a, b) => a.item_rank - b.item_rank)
      .slice(0, 10);

    return {
      title: {
        text: 'TOP10电影评分',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>评分: {c}',
      },
      xAxis: {
        type: 'category',
        data: top10Movies.map(m => m.chinese_name),
        axisLabel: {
          rotate: 30,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: '评分',
        min: 8,
        max: 10,
        axisLabel: {
          formatter: '{value} 分',
        },
      },
      series: [
        {
          name: '评分',
          type: 'bar',
          data: top10Movies.map(movie => ({
            value: movie.score,
            itemStyle: {
              color: movie.score >= 9.2 ? '#c23531' : '#2f4554',
            },
          })),
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
          },
          barWidth: '40%',
        },
      ],
    };
  };

  // 电影类型矩形树图配置
  const getTreemapOption = () => {
    const genreCount: Record<string, number> = {};

    movies.forEach(movie => {
      movie.genres.split(' ').forEach(genre => {
        if (genre) {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        }
      });
    });

    const genreData = Object.entries(genreCount).map(([name, value]) => ({
      name,
      value,
      itemStyle: {
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    }));

    return {
      title: {
        text: '电影类型分布',
        left: 'center',
      },
      tooltip: {
        formatter: (info: any) => [
          `<div style="font-weight:bold">${info.name}</div>`,
          `出现次数: ${info.value}`,
        ].join(''),
      },
      series: [
        {
          name: '电影类型',
          type: 'treemap',
          data: genreData,
          breadcrumb: { show: false },
          label: { show: true },
          levels: [
            {
              itemStyle: {
                borderColor: '#555',
                borderWidth: 1,
                gapWidth: 1,
              },
            },
          ],
        },
      ],
    };
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {error && (
        <Alert
          message="数据加载失败"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 图表展示区 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ boxShadow: '0 0 8px #f0f0f0', borderRadius: 8, padding: 16 }}>
          <ReactECharts
            option={getBarOption()}
            style={{ height: 400 }}
            showLoading={loading}
          />
        </div>
        <div style={{ boxShadow: '0 0 8px #f0f0f0', borderRadius: 8, padding: 16 }}>
          <ReactECharts
            option={getTreemapOption()}
            style={{ height: 400 }}
            showLoading={loading}
          />
        </div>
      </div>

      {/* 数据表格 */}
      <div style={{ boxShadow: '0 0 8px #f0f0f0', borderRadius: 8, padding: 16 }}>
        <Table
          columns={columns}
          dataSource={movies}
          rowKey={record => `${record.item_rank}-${record.chinese_name}`}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </div>
    </div>
  );
};

export default MovieDashboard;