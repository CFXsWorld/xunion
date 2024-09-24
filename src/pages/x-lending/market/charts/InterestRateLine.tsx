import { Line, LineChart, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/Charts';
import useLendingRate from '@/pages/x-lending/hooks/useLendingRate.ts';

const chartConfig = {
  DIR: {
    label: '',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const InterestRateLine = ({
  onUTRateChange,
}: {
  onUTRateChange: (value: string) => void;
}) => {
  const { depositInterestRates, lendingInterestRates } = useLendingRate();

  const chartData = depositInterestRates.slice(0, 95).map((item, index) => ({
    index: index + 1,
    DIR: item,
    LIR: lendingInterestRates[index],
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full pt-[20px]">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
        onClick={(e) => {
          onUTRateChange(e?.activeLabel || '');
        }}
      >
        <XAxis
          dataKey="index"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="DIR"
          type="monotone"
          stroke={`var(--xunion-color-theme`}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="LIR"
          type="monotone"
          stroke="#E65D5D"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default InterestRateLine;
