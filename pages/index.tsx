import type { NextPage } from "next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import styles from "../styles/Home.module.css";
import data from "../mock.json";
import { useEffect, useState } from "react";
import Head from 'next/head';

type ScheduleData = { date: string; orders: number };

const SLOTS = [
  {
    start: "08:00:00",
    end: "12:00:00",
    label: "08AM - 12PM",
  },
  {
    start: "12:00:00",
    end: "16:00:00",
    label: "12PM - 4PM",
  },
  {
    start: "16:00:00",
    end: "20:00:00",
    label: "4PM - 8PM",
  },
  {
    start: "20:00:00",
    end: "24:00:00",
    label: "8PM - 12AM",
  },
  {
    start: "24:00:00",
    end: "08:00:00",
    label: "12AM - 8AM",
  },
];

const Home: NextPage = () => {
  const [date, setDate] = useState<string>("2021-05-22");

  const [filteredData, setFilteredData] = useState<ScheduleData[]>([]);

  const [dateData, setDateData] = useState<ScheduleData[]>([]);

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (date) {
      const filtered = data.filter((item) => item.item_date === date);
      const dataWithDateAndSchedules: ScheduleData[] = [];
      filtered.forEach((item) => {
        const date = item.schedule_time.split(" ")[0];
        const data = dataWithDateAndSchedules.find((d) => d.date === date);
        if (data) data.orders++;
        else dataWithDateAndSchedules.push({ date, orders: 1 });
      });
      setFilteredData(dataWithDateAndSchedules);
    }
  }, [date]);

  const onBarClick = (e: ScheduleData) => {
    const scheduleDate = e.date;
    const orders = data.filter(
      (item) =>
        item.schedule_time.split(" ")[0] === scheduleDate &&
        item.item_date === date
    );
    const dataToReplace: ScheduleData[] = SLOTS.map((slot) => {
      const noOfOrders = orders.filter((item) => {
        const time = item.schedule_time.split(" ")[1];
        return time < slot.end && time > slot.start;
      }).length;
      return {
        date: slot.label,
        orders: noOfOrders,
      };
    });
    setSelectedDate(scheduleDate);
    setDateData(dataToReplace);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Archive</title>
      </Head>
      <main className={styles.main}>
        <input value={date} type='date' onChange={(e) => setDate(e.target.value)} />
        <BarChart width={730} height={250} data={filteredData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis dataKey='orders' />
          <Tooltip />
          <Legend />
          <Bar onClick={onBarClick} dataKey='orders' fill='#8884d8' />
        </BarChart>
        {selectedDate && (
          <>
            <h2>Orders to be delievered on {date} and Scheduled on {selectedDate}</h2>
            <BarChart width={730} height={250} data={dateData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis dataKey='orders' />
              <Tooltip />
              <Legend />
              <Bar dataKey='orders' fill='black' />
            </BarChart>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
