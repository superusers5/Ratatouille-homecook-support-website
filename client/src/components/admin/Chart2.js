import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, Legend, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, logins, unique_logins) {
  return { time, logins, unique_logins };
}

const data = [
  createData('00:00', 0, 0),
  createData('03:00', 3, 3),
  createData('06:00', 6, 5),
  createData('09:00', 8, 7),
  createData('12:00', 7, 2),
  createData('15:00', 5, 3),
  createData('18:00', 18, 2),
  createData('21:00', 24, 2),
  createData('24:00', undefined),
];



export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Number of logins
            </Label>
          </YAxis>
          <Legend />
          <Line type="monotone" dataKey="logins" stroke={theme.palette.primary.main} />
          <Line type="monotone" dataKey="unique_logins" stroke="red"  />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}