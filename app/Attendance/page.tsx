import "./attendance.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

const AttendancePage = () => {
  return (
    <div className="attendance-page">
      <div className="header">
        <div className="user-info">
          <div className="avatar" />
            <img src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000" alt="Profile"/>
          <span>Welcome, Sot Chulsa</span>
        </div>
      </div>

      <div className="controls">
        <ButtonComponent label="Select Class" type="submit" />
        <ButtonComponent label="Select Date" type="submit" />
        <div className="calendar-image">
            <img src="https://image2url.com/r2/default/images/1770264564282-8dfe96cd-d402-4aec-97b5-71cb52e11442.png" alt="Calendar"/>
        </div>
      </div>

      <div className="table-header">
        <span>Name</span>
        <span>Status</span>
        <span>Date</span>
      </div>

      <div className="table-row">
        <div>Sot Chulsa</div>
        <div>Present</div>
        <div>Friday 01 2026</div>
      </div>

      <div className="table-row">
        <div>Sothireak Mom</div>
        <div>Present</div>
        <div>Friday 01 2026</div>
      </div>

      <div className="table-row">
        <div>Joseph Afton</div>
        <div>Absent</div>
        <div>Friday 01 2026</div>
      </div>

      <div className="table-row">
        <div>Hyeokhaek Jeong</div>
        <div>Present</div>
        <div>Friday 01 2026</div>
      </div>
    </div>
  );
};

export default AttendancePage;
