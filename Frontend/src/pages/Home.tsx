import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomId.trim() && userName.trim()) {
      navigate(`/room/${roomId}?name=${encodeURIComponent(userName)}`);
    }
  };

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    if (userName.trim()) {
      navigate(`/room/${newRoomId}?name=${encodeURIComponent(userName)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (roomId.trim() && userName.trim()) {
        joinRoom();
      } else if (userName.trim()) {
        createRoom();
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: window.innerWidth <= 768 ? "column" : "row",
        background:
          "radial-gradient(circle at top left, #1e3a8a 0%, #020617 45%)",
        color: "#f8fafc",
        padding: window.innerWidth <= 640 ? "16px" : "24px",
      }}
    >
      {/* Left – Marketing / Hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: window.innerWidth <= 768 ? "flex-start" : "center",
          padding:
            window.innerWidth <= 640
              ? "24px 0"
              : window.innerWidth <= 768
              ? "40px 20px"
              : "80px",
          paddingTop: window.innerWidth <= 768 ? "20px" : "80px",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: window.innerWidth <= 640 ? "6px 12px" : "8px 14px",
            borderRadius: "999px",
            fontSize: window.innerWidth <= 640 ? "10px" : "12px",
            fontWeight: 600,
            letterSpacing: "0.4px",
            color: "#93c5fd",
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.25)",
            width: "fit-content",
            marginBottom: window.innerWidth <= 640 ? "16px" : "32px",
          }}
        >
          WebRTC Powered Meetings
        </span>

        <h1
          style={{
            fontSize:
              window.innerWidth <= 640
                ? "32px"
                : window.innerWidth <= 768
                ? "44px"
                : "60px",
            lineHeight: "1.05",
            fontWeight: 800,
            marginBottom: window.innerWidth <= 640 ? "16px" : "28px",
            letterSpacing: "-0.03em",
          }}
        >
          Next-Gen Video
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Conferencing
          </span>
        </h1>

        <p
          style={{
            fontSize:
              window.innerWidth <= 640
                ? "14px"
                : window.innerWidth <= 768
                ? "15px"
                : "18px",
            maxWidth: "620px",
            color: "#94a3b8",
            lineHeight: "1.7",
            marginBottom: window.innerWidth <= 640 ? "24px" : "48px",
          }}
        >
          Host secure, real-time video meetings with zero setup. Create or join
          rooms instantly with enterprise-grade performance and privacy.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth <= 640 ? "column" : "row",
            gap: window.innerWidth <= 640 ? "16px" : "48px",
          }}
        >
          {[
            ["Ultra HD", "Crystal-clear video"],
            ["Instant Join", "No installs required"],
            ["Secure", "End-to-end encrypted"],
          ].map(([title, desc]) => (
            <div key={title}>
              <div
                style={{
                  fontSize: window.innerWidth <= 640 ? "12px" : "14px",
                  fontWeight: 700,
                  color: "#60a5fa",
                  marginBottom: "6px",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: window.innerWidth <= 640 ? "11px" : "13px",
                  color: "#64748b",
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right – Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: window.innerWidth <= 768 ? "20px 0" : "0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: window.innerWidth <= 640 ? "100%" : "460px",
            padding:
              window.innerWidth <= 640
                ? "32px"
                : window.innerWidth <= 768
                ? "40px"
                : "48px",
            borderRadius: window.innerWidth <= 640 ? "16px" : "20px",
            background:
              "linear-gradient(180deg, rgba(30,41,59,0.85), rgba(15,23,42,0.85))",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(148,163,184,0.15)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            style={{
              fontSize: window.innerWidth <= 640 ? "24px" : "30px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            Get Started
          </h2>
          <p
            style={{
              fontSize: window.innerWidth <= 640 ? "13px" : "15px",
              color: "#94a3b8",
              marginBottom: window.innerWidth <= 640 ? "24px" : "36px",
            }}
          >
            Join an existing meeting or create a new one
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: window.innerWidth <= 640 ? "16px" : "22px",
            }}
          >
            {/* Name */}
            <input
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              style={inputStyle}
            />

            {/* Room */}
            <input
              placeholder="Room ID (optional)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              style={{ ...inputStyle, fontFamily: "monospace" }}
            />

            <button
              onClick={createRoom}
              disabled={!userName.trim()}
              style={{
                ...primaryButton,
                opacity: userName.trim() ? 1 : 0.5,
                cursor: userName.trim() ? "pointer" : "not-allowed",
              }}
            >
              Create New Room
            </button>
            <div
              style={{
                textAlign: "center",
                fontSize: window.innerWidth <= 640 ? "11px" : "12px",
                color: "#64748b",
                letterSpacing: "1px",
              }}
            >
              OR
            </div>

            <button
              onClick={joinRoom}
              disabled={!roomId.trim() || !userName.trim()}
              style={{
                ...secondaryButton,
                opacity: roomId.trim() && userName.trim() ? 1 : 0.4,
                cursor:
                  roomId.trim() && userName.trim() ? "pointer" : "not-allowed",
              }}
            >
              Join Existing Room
            </button>
          </div>

          <p
            style={{
              marginTop: window.innerWidth <= 640 ? "20px" : "28px",
              fontSize: window.innerWidth <= 640 ? "11px" : "12px",
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            Encrypted • No tracking • No data stored
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const getInputStyle = (): React.CSSProperties => {
  const isSmall = window.innerWidth <= 640;
  return {
    width: "100%",
    padding: isSmall ? "12px 14px" : "14px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(2,6,23,0.6)",
    color: "#f8fafc",
    fontSize: isSmall ? "14px" : "15px",
    outline: "none",
  };
};

const inputStyle: React.CSSProperties = getInputStyle();

const getPrimaryButtonStyle = (): React.CSSProperties => {
  const isSmall = window.innerWidth <= 640;
  return {
    padding: isSmall ? "12px" : "14px",
    borderRadius: "10px",
    border: "none",
    fontWeight: 600,
    fontSize: isSmall ? "14px" : "15px",
    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
    color: "#fff",
  };
};

const primaryButton: React.CSSProperties = getPrimaryButtonStyle();

const getSecondaryButtonStyle = (): React.CSSProperties => {
  const isSmall = window.innerWidth <= 640;
  return {
    padding: isSmall ? "12px" : "14px",
    borderRadius: "10px",
    border: "1px solid #3b82f6",
    fontWeight: 600,
    fontSize: isSmall ? "14px" : "15px",
    background: "transparent",
    color: "#3b82f6",
  };
};

const secondaryButton: React.CSSProperties = getSecondaryButtonStyle();
