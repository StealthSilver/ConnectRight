import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  userName?: string;
  isLocal?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  muted = false,
  userName,
  isLocal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream?.getVideoTracks().some((t) => t.enabled);
  const isMobile = window.innerWidth <= 640;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: isMobile ? "10px" : "14px",
        overflow: "hidden",
        background: "#020617",
        border: "1px solid #1e293b",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: hasVideo ? "block" : "none",
        }}
      />

      {!hasVideo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#020617",
          }}
        >
          <div
            style={{
              width: isMobile ? "60px" : "88px",
              height: isMobile ? "60px" : "88px",
              borderRadius: "50%",
              background: "#1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "24px" : "34px",
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            {userName?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
      )}

      {userName && (
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "8px" : "12px",
            left: isMobile ? "8px" : "12px",
            padding: isMobile ? "4px 8px" : "6px 10px",
            borderRadius: "6px",
            background: "rgba(2,6,23,0.85)",
            border: "1px solid #1e293b",
            color: "#f8fafc",
            fontSize: isMobile ? "10px" : "12px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
          }}
        >
          {isLocal ? "● " : ""}
          {userName}
        </div>
      )}
    </div>
  );
};
