import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface AdmetData {
  property: string;
  score: number; // 0-100 scale ideally
  fullMark: number;
}

interface AdmetRadarChartProps {
  data: AdmetData[];
}

export const AdmetRadarChart: React.FC<AdmetRadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="property" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
            itemStyle={{ color: '#a855f7' }}
          />
          <Radar
            name="ADMET Risk"
            dataKey="score"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
