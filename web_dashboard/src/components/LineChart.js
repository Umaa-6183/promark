// src/components/LineChart.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const ChartComponent = ({ data }) => (
  <LineChart width={500} height={250} data={data}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="submissions" stroke="#8884d8" />
  </LineChart>
);

export default ChartComponent;
