import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Alert } from 'antd';

interface Movie {
  director: string;
  [key: string]: any;
}

interface DirectorData {
  name: string;
  value: number;
}

const DirectorPieChart = () => {
  const [directorData, setDirectorData] = useState<DirectorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5001/data')
      .then(res => {
        if (!res.ok) throw new Error('网络响应失败');
        return res.json();
      })
      .then((movies: Movie[]) => {
        const directorCount: Record<string, number> = {};

        movies.forEach(movie => {
          movie.director.split('/').forEach(rawDirector => {
            const director = rawDirector.trim();
            if (director) {
              directorCount[director] = (directorCount[director] || 0) + 1;
            }
          });
        });

        const sortedDirectors = Object.entries(directorCount)
          .sort((a, b) => b[1] - a[1]);

        const top10 = sortedDirectors.slice(0, 10);
        const othersCount = sortedDirectors.slice(10).reduce((sum, [_, count]) => sum + count, 0);

        const finalData = [
          ...top10.map(([name, value]) => ({ name, value })),
          ...(othersCount > 0 ? [{ name: '其他导演', value: othersCount }] : [])
        ];

        setDirectorData(finalData);
      })
      .catch(error => {
        console.error('数据获取失败:', error);
        setError('获取数据失败，请稍后重试');
      })
      .finally(() => setLoading(false));
  }, []);

  const getOption = () => ({
    title: {
      text: '导演作品数量统计',
      subtext: '显示作品数量最多的前10位导演',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}部 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 30, // 图例距离右侧30px
      top: 'center',
      height: '80%', // 限制图例高度
      itemGap: 10, // 增加图例项间距
      data: directorData.map(item => item.name),
      formatter: (name: string) => {
        // 长名字省略显示
        return name.length > 6 ? name.slice(0, 6) + '...' : name;
      }
    },
    grid: {
      left: '3%', // 图表容器左边距
      right: '23%', // 为图例留出空间
      containLabel: true
    },
    series: [
      {
        name: '作品数量',
        type: 'pie',
        center: ['38%', '50%'], // 向左移动饼图中心点
        radius: ['35%', '65%'], // 调整半径大小
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b|{b}}\n{c}部',
          rich: {
            b: {
              fontWeight: 'bold',
              fontSize: 12
            }
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          length: 15,
          length2: 10,
          smooth: 0.2
        },
        data: directorData
      }
    ]
  });

  return (
    <div style={{ height: '500px', margin: '20px 0', position: 'relative' }}>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {loading && <div style={{ textAlign: 'center', padding: '100px 0' }}>图表加载中...</div>}
      
      {!loading && directorData.length > 0 && (
        <ReactECharts 
          option={getOption()} 
          style={{ height: '100%', width: '100%' }} 
          opts={{ renderer: 'canvas' }}
        />
      )}
      
      {!loading && directorData.length === 0 && (
        <Alert message="没有找到导演数据" type="warning" showIcon />
      )}
    </div>
  );
};

export default DirectorPieChart;
