import React from "react";
import Link from 'next/link';
import "./main.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <header className="top-nav">
        <img src="https://icons.veryicon.com/png/o/education-technology/smart-campus-2/class-attendance.png" alt="Attendance Tracker Logo" />
        <nav className="nav-links">
          <span className="active">Dashboard</span>
          <Link href="List">Student List</Link>
          <Link href="List">Teacher List</Link>
          <Link href="Attendance">Attendance</Link>
          <Link href="Settings">Settings</Link>
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

          <div className="stats">
            <div>
              <p>Total Student</p>
              <strong>48</strong>
            </div>
            <div>
              <p>Total Absent</p>
              <strong>10</strong>
            </div>
            <div>
              <p>Course</p>
              <strong>Software Engineering</strong>
            </div>
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
