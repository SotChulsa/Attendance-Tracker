"use client";

import { useEffect, useState } from "react";
import { ButtonComponent } from "@/Components/Buttons/button-component";
import "./classes.css";

type ClassType = {
  id: string;
  name: string;
  subject: string;
  schedule: string;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [schedule, setSchedule] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  //get the classes
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setClasses(data.classes);
      } else {
        setMessage(data.error || "Failed to fetch classes");
      }
    } catch (error) {
      setMessage("Error loading classes");
    }
  };

  //create the class
  const handleCreateClass = async () => {
    if (!name || !subject || !schedule) {
      setMessage("All fields required");
      return;
    }

    try {
        const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");
        console.log("TOKEN:", token);
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          subject,
          schedule,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Class created successfully");
        setName("");
        setSubject("");
        setSchedule("");
        fetchClasses();
      } else {
        setMessage(data.error || "Failed to create class");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="classes-container">
      <h1>Your Classes</h1>

      {message && <p className="message">{message}</p>}

    {/* Create classroom */}
      <div className="create-class-form">
        <input
          placeholder="Class Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          placeholder="Schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />

        <ButtonComponent label="Create Class" onClick={handleCreateClass} />
      </div>

      {/* classes table */}
      <div className="classes-table">
        {classes.length === 0 ? (
          <p>No classes found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.name}</td>
                  <td>{cls.subject}</td>
                  <td>{cls.schedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
