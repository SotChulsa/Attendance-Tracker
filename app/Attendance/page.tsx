"use client";

import { useEffect, useState } from "react";
import "./attendance.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

type AttendanceRecord = {
  id: string;
  name: string;
  status: string;
  date: string;
};

const AttendancePage = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchAttendance();
    fetchClasses();
  }, []);

  //get attendance
  const fetchAttendance = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const res = await fetch(`/api/attendance?name=${nameFilter}&status=${statusFilter}&date=${dateFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setRecords(data.attendance);
      }
    } catch {
      console.error("Failed to fetch attendance");
    }
  };

  //get classes
  const fetchClasses = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const res = await fetch("/api/classes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setClasses(data.classes);
    }
  };

  //check-in
  const handleCheckIn = () => {
    if (!selectedClass) {
      setMessage("Please select a class");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classId: Number(selectedClass),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      fetchAttendance();
    });
  };

  return (
    <div className="attendance-page">
      <div className="header">
        <div className="user-info">
          <div className="avatar" />
          <img
            src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000"
            alt="Profile"
          />
          <span>Welcome, Sot Chulsa</span>
        </div>
      </div>

      <div className="controls">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <ButtonComponent label="Check In" onClick={handleCheckIn} />
          <input
            placeholder="Student Name"
            onChange={(e) => setNameFilter(e.target.value)}
            />
          <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Outside Area">Outside Area</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          />
        <div className="calendar-image">
          <img
            src="https://image2url.com/r2/default/images/1770264564282-8dfe96cd-d402-4aec-97b5-71cb52e11442.png"
            alt="Calendar"
          />
        </div>
      </div>
      {message && <p className="message">{message}</p>}
      <div className="table-header">
        <span>Name</span>
        <span>Status</span>
        <span>Date</span>
      </div>

      {records.length === 0 ? (
        <div className="table-row">
          <div>No records found</div>
          <div>-</div>
          <div>-</div>
        </div>
      ) : (
        records.map((record) => (
          <div className="table-row" key={record.id}>
            <div>{record.name}</div>
            <div>{record.status}</div>
            <div>{record.date}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default AttendancePage;

