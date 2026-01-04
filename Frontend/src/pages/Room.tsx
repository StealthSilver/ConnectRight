import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useWebRTC } from "../hooks/useWebRTC";
import { VideoPlayer } from "../components/VideoPlayer";
import { MediaControls } from "../components/MediaControls";

export const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userName = searchParams.get("name") || "Anonymous";
  const [copied, setCopied] = useState(false);

  const { joinRoom, leaveRoom, peers, localStream, remotePeers } = useWebRTC(
    roomId || "",
    userName
  );

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }
    joinRoom();
    return () => leaveRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate("/");
  };

  const copyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalParticipants = peers.length + 1;
  const isMobile = window.innerWidth <= 640;
  const isTablet = window.innerWidth <= 1024;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#020617",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: isMobile
            ? "12px 16px"
            : isTablet
            ? "14px 24px"
            : "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "12px" : "0",
          background: "#020617",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? "12px" : "18px",
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e",
              marginTop: "2px",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#f8fafc",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                display: "flex",
                gap: isMobile ? "6px" : "10px",
                marginTop: "4px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: isMobile ? "10px" : "12px",
                  color: "#94a3b8",
                }}
              >
                {roomId}
              </span>
              <button
                onClick={copyRoomId}
                style={{
                  fontSize: isMobile ? "9px" : "11px",
                  padding: isMobile ? "3px 8px" : "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid #334155",
                  background: "transparent",
                  color: copied ? "#22c55e" : "#94a3b8",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: isMobile ? "12px" : isTablet ? "12px" : "13px",
            color: "#cbd5f5",
            fontWeight: 500,
          }}
        >
          {totalParticipants}{" "}
          {totalParticipants === 1 ? "Participant" : "Participants"}
        </div>
      </header>

      {/* Video Grid */}
      <main
        style={{
          flex: 1,
          padding: isMobile ? "12px" : isTablet ? "16px" : "28px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            gap: isMobile ? "8px" : isTablet ? "12px" : "24px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : totalParticipants === 1
              ? "1fr"
              : totalParticipants === 2 && !isTablet
              ? "repeat(2, 1fr)"
              : isTablet
              ? "repeat(auto-fit, minmax(300px, 1fr))"
              : "repeat(auto-fit, minmax(360px, 1fr))",
            maxWidth: totalParticipants === 1 ? "900px" : "100%",
          }}
        >
          <VideoPlayer
            stream={localStream}
            muted
            userName={`${userName} (You)`}
            isLocal
          />

          {peers.map((peer) => {
            const connection = remotePeers.get(peer.socketId);
            return (
              <VideoPlayer
                key={peer.socketId}
                stream={connection?.stream || null}
                userName={peer.userName}
              />
            );
          })}
        </div>
      </main>

      <MediaControls roomId={roomId || ""} onLeave={handleLeaveRoom} />
    </div>
  );
};
