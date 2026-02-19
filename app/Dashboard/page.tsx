"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import "./main.css";


const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

  const res = await fetch("/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

    if (data.success) {
      setStats(data);
    }
  };
  return ( 
    <div className="dashboard-container">
      <header className="top-nav">
        <img src="https://icons.veryicon.com/png/o/education-technology/smart-campus-2/class-attendance.png" alt="Attendance Tracker Logo" />
        <nav className="nav-links">
          <span className="active">Dashboard</span>
          <Link href="List">List</Link>
          <Link href="Attendance">Attendance</Link>
          <Link href="Settings">Settings</Link>
          <Link href="Classes">Classes</Link>
        </nav>
        <div className="profile" />
        <img src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000" alt="Profile"/>
      </header>

      <div className="content">
        <aside className="sidebar">
          <div className="calendar">
            <img src="https://image2url.com/r2/default/images/1770264564282-8dfe96cd-d402-4aec-97b5-71cb52e11442.png" alt="Calender" />
          </div>
          <div className="class-today">
            <h4>Class Today</h4>
            <div className="class-card">
              Java Programming<br />(2:40 - 4:10)</div>
            <div className="class-card">
              Cryptography & Network Security<br />(8:30 - 10:00)
            </div>
          </div>
        </aside>

        <main className="main-card">
          <h2>Class Attendance</h2>
          {stats && (
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Students</h3>
                <p>{stats.totalStudents}</p>
              </div>
              <div className="card">
                <h3>Present Today</h3>
                <p>{stats.totalPresent}</p>
              </div>
              <div className="card">
                <h3>Absent Today</h3>
                <p>{stats.totalAbsent}</p>
              </div>
              <div className="card">
                <h3>Attendance %</h3>
                <p>{stats.attendancePercentage}%</p>
              </div>
            </div>
          )} 
        <div className="overview-section">
          <h4>Class Overview</h4>
            <div className="chart">
            <div className="bar" />
            <div className="bar tall" />
            <div className="bar short" />
            <div className="bar tallest" />
            <div className="bar medium" />
            <div className="bar tall"/>
            <div className="bar short" />
            <div className="bar tallest" />
            <div className="bar medium" />
            <div className="bar short" />
            <div className="bar medium" />
            <div className="bar tall"/>
            <div className="bar tallest" />
            <div className="bar short" />
            <div className="bar medium" />
            <div className="bar tall"/>
            <div className="bar medium" />
            <div className="bar tallest" />
            <div className="bar tall"/>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
