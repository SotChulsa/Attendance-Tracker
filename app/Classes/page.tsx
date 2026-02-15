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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [id, setID] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleGetLocation = () => {
  if (!navigator.geolocation) {
    setMessage("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
      setMessage("Location detected");
    },
    () => {
      setMessage("Unable to get location");
    }
  );
};

  //get the class
  const fetchClasses = async () => {
    try {
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
      } else {
        setMessage("Failed to fetch classes");
      }
    } catch {
      setMessage("Error loading classes");
    }
  };

  //create the class
  const handleCreateClass = async () => {
    if (!name || !subject || !schedule) {
      setMessage("All fields required");
      return;
    }

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

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
      id,
      latitude,
      longitude,
    }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Class created successfully");
      setName("");
      setSubject("");
      setSchedule("");
      fetchClasses();
    }
  };

  // edit the class
  const handleEditClass = (cls: ClassType) => {
    setEditingId(cls.id);
    setName(cls.name);
    setSubject(cls.subject);
    setSchedule(cls.schedule);
  };

  //update the class
  const handleUpdateClass = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const res = await fetch(`/api/classes/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, subject, schedule }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Class updated successfully");
      setEditingId(null);
      setName("");
      setSubject("");
      setSchedule("");
      fetchClasses();
    }
  };

    const handleAssignStudent = async (classId: string) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    await fetch("/api/classes/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        classId,
        studentId: Number(id),
      }),
    });

    setMessage("Student assigned");
    setID("");
    };

  //delete the class
  const handleDeleteClass = async (id: string) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!confirm("Delete this class?")) return;

    await fetch(`/api/classes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchClasses();
  };

  return (
    <div className="classes-container">
      <h1>Your Classes</h1>
      {message && <p className="message">{message}</p>}
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
        <input
          placeholder="Student ID"
          value={id}
          onChange={(e) => setID(e.target.value)}
        />
        <input
          placeholder="Latitude"
          value={latitude}
          readOnly
        />
        <input
          placeholder="Longitude"
          value={longitude}
          readOnly
        />
        <ButtonComponent
          label={editingId ? "Update Class" : "Create Class"}
          onClick={editingId ? handleUpdateClass : handleCreateClass}
        />
        <ButtonComponent
          label="Use Current Location"
          onClick={handleGetLocation}
        />
      </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.name}</td>
                  <td>{cls.subject}</td>
                  <td>{cls.schedule}</td>
                  <td>
                    <ButtonComponent
                      label="Edit"
                      onClick={() => handleEditClass(cls)}
                    />
                    <ButtonComponent
                      label="Delete"
                      onClick={() => handleDeleteClass(cls.id)}
                    />
                    <ButtonComponent
                      label="Assign Student"
                      onClick={() => handleAssignStudent(cls.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
