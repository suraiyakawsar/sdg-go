// HowToPlayOverlay.jsx
import React from "react";
import { MdKeyboard } from "react-icons/md";
import { IconContext } from "react-icons";

const sections = [
    { title: "Movement", body: "Use WASD to move around the environment." },
    { title: "Interaction", body: "Move close to people or objects and press Q, E, or R, or click the on-screen prompt." },
    { title: "Dialogue", body: "Click to continue conversations. Some responses affect SDG points." },
    { title: "Exploration", body: "Inspect objects, talk to NPCs, and discover hidden details." },
    { title: "Progress", body: "Objectives and SDG indicators update as you play." },
    { title: "Advancing", body: "New areas unlock after key actions or conversations." }
];

export default function HowToPlayOverlay({ onClose, isBoot }) {
    return (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none"
        }}>
            <div style={{
                background: "rgba(11,18,32,0.95)",
                border: "2px solid rgba(255,255,255,0.1)",
                width: "90%",
                maxWidth: 1100,
                padding: 40,
                borderRadius: 12,
                textAlign: "center",
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 32
            }}>
                {/* Title */}
                <h1 style={{ fontSize: 36, color: "#F9FAFB", marginBottom: 8 }}>How to Play</h1>
                <p style={{ fontSize: 18, color: "#D1D5DB", marginBottom: 24 }}>
                    Explore thoughtfully. Your choices shape your impact.
                </p>

                {/* Sections in 2 columns */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "32px"
                }}>
                    {sections.map((s, i) => (
                        <div key={i} style={{
                            background: "rgba(2,6,23,0.85)",
                            border: "1.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            padding: 16,
                            textAlign: "left"
                        }}>
                            <h2 style={{ fontSize: 24, color: "#E5E7EB", marginBottom: 8 }}>{s.title}</h2>
                            <p style={{ fontSize: 18, color: "#D1D5DB", lineHeight: 1.5 }}>{s.body}</p>
                        </div>
                    ))}
                </div>

                {/* Keys */}
                <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
                    <KeyCard keyName="Q" label="Interact" />
                    <KeyCard keyName="E" label="Interact" />
                    <KeyCard keyName="R" label="Interact" />
                </div>

                {/* Primary button */}
                <button
                    onClick={onClose}
                    style={{
                        fontSize: 22,
                        padding: "16px 40px",
                        background: "#111827",
                        color: "#F9FAFB",
                        border: "2px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        cursor: "pointer",
                        marginTop: 24,
                        alignSelf: "center"
                    }}
                >
                    {isBoot ? "Start" : "Close"}
                </button>
            </div>
        </div>
    );
}

function KeyCard({ keyName, label }) {
    return (
        <IconContext.Provider value={{ size: "36px", color: "#F9FAFB" }}>
            <div style={{
                background: "rgba(2,6,23,0.9)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: 16,
                width: 120,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8
            }}>
                <MdKeyboard />
                <div style={{ fontSize: 20 }}>{keyName}</div>
                <div style={{ fontSize: 16, color: "#D1D5DB" }}>{label}</div>
            </div>
        </IconContext.Provider>
    );
}
