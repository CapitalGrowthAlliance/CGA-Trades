import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTranslation } from 'react-i18next';

const generateData = (t: any) => {
  const data = [];
  let value = 1000;
  for (let i = 0; i < 20; i++) {
    value += Math.random() * 50 - 20;
    data.push({ name: `${t('chart.day', 'Day')} ${i + 1}`, value: Math.max(0, value) });
  }
  return data;
};

export default function LiveChart() {
  const { t } = useTranslation();
  const [data, setData] = useState(() => generateData(t));

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const lastItem = newData[newData.length - 1];
        const lastValue = lastItem.value;
        const lastDayStr = lastItem.name.split(' ').pop() || '0';
        const nextDayNum = parseInt(lastDayStr) + 1;
        
        newData.push({
          name: `${t('chart.day', 'Day')} ${nextDayNum}`,
          value: Math.max(0, lastValue + Math.random() * 50 - 20),
        });
        return newData;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [t]);

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-6 shadow-light">
      <h3 className="text-lg font-semibold text-text-primary mb-4">{t('chart.title', 'Portfolio Growth')}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toFixed(0)}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--accent-primary)' }}
            />
            <Area type="monotone" dataKey="value" stroke="var(--chart-line, var(--accent-primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
