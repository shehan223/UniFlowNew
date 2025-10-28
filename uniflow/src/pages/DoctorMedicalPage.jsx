import React from "react";
import NaviBar from "../components/NaviBar";
import "./doctorMedicalPage.css";
import { useMedicalAvailability } from "../context/MedicalAvailabilityContext";

const DoctorMedicalPage = () => {
  const { isAvailable, setAvailability } = useMedicalAvailability();

  const handleToggle = () => {
    setAvailability(!isAvailable);
  };

  return (
    <>
      <NaviBar />
      <div className="doctor-medical">
        <div className="doctor-medical__card">
          <p className="doctor-medical__label">Medical Availability</p>
          <div className="doctor-medical__body">
            <button
              type="button"
              className={`doctor-toggle ${isAvailable ? "doctor-toggle--on" : "doctor-toggle--off"}`}
              onClick={handleToggle}
              aria-pressed={isAvailable}
            >
              <span className="doctor-toggle__label-wrapper">
                <span className="doctor-toggle__label">
                  {isAvailable ? "ON" : "OFF"}
                </span>
              </span>
              <span
                className={`doctor-toggle__knob${
                  isAvailable ? " doctor-toggle__knob--on" : ""
                }`}
                aria-hidden="true"
              />
              <span
                className={`doctor-toggle__glow${
                  isAvailable ? " doctor-toggle__glow--on" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorMedicalPage;
