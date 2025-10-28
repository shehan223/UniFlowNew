import React from "react";
import NaviBar from "../components/NaviBar";
import SideBar from "../components/SideBar";

const Qr = () => (
  <>
    <NaviBar />
    <div style={{ display: "flex", gap: "2rem", padding: "2.5rem", background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)", minHeight: "calc(100vh - 80px)" }}>
      <SideBar />
      <main style={{ flex: 1, borderRadius: "32px", background: "#fff", padding: "2.5rem", boxShadow: "0 24px 60px rgba(148, 163, 184, 0.25)" }}>
        <h1 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f172a" }}>QR Attendance</h1>
        <p style={{ color: "#475569", maxWidth: "520px", lineHeight: 1.6 }}>
          The QR attendance module is coming soon. This space will let students check in quickly and hostel admins monitor attendance in real time.
        </p>
      </main>
    </div>
  </>
);

export default Qr;
