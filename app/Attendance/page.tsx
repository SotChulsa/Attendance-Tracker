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

const handleCheckIn = () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    await fetch("/api/check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        classId: 1, //later comes from selected class
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    });

    fetchAttendance(); //refresh table
  });
};


const AttendancePage = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();

      if (data.success) {
        setRecords(data.attendance);
      }
    } catch (error) {
      console.error("Failed to fetch attendance");
    }
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
        <ButtonComponent label="Select Class" type="submit" />
        <ButtonComponent label="Select Date" type="submit" />
      <ButtonComponent label="Check In" onClick={handleCheckIn}/>
        <div className="calendar-image">
          <img
            src="https://image2url.com/r2/default/images/1770264564282-8dfe96cd-d402-4aec-97b5-71cb52e11442.png"
            alt="Calendar"
          />
        </div>
      </div>

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
const fetchAttendance = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const res = await fetch("/api/attendance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setRecords(data.attendance);
    }
  } catch (error) {
    console.error("Failed to fetch attendance");
  }
};


function setRecords(attendance: any) {
  throw new Error("Function not implemented.");
}

