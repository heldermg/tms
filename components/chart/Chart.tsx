import React from 'react'
import Head from 'next/head'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ChartData } from './ChartData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartProps {
  title: string,
  labels: string[],
  datasets: ChartData[],
  height?: number,
  width?: number,
}

function Chart({ title, labels, datasets, height = 500, width = 1000 }: ChartProps) {

  const data = {
    labels,
    datasets
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  }

  return (
    <Bar 
      options={options} 
      data={data}
      height={height}
      width={width}
    />
  )
}

export default Chart
