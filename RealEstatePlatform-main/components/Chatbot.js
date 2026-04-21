"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "Show 2 BHK flats in Tadepalli",
  "What is the price range in Benz Circle?",
  "How do I contact an agent?",
  "What localities are available?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm REALTA Assistant 👋 I can help you find properties in Vijayawada, explain localities, budget ranges, and how to use this platform. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    setInput("");
    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message || "Sorry, I could not get a response.",
        },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#E03A3C",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(224,58,60,0.4)",
          zIndex: 9999,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: 90,
          right: 24,
          width: 360,
          height: 500,
          background: "white",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
          overflow: "hidden",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>

          {/* Header */}
          <div style={{
            background: "#E03A3C",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>🏠</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                REALTA Assistant
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                Powered by Gemini AI • Vijayawada Real Estate
              </div>
            </div>
            <div style={{
              marginLeft: "auto",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#4ade80",
            }}/>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: m.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: m.role === "user" ? "#E03A3C" : "#f5f5f5",
                  color: m.role === "user" ? "white" : "#1a1a1a",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "#f5f5f5",
                  fontSize: 13,
                  color: "#999",
                }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — show only at start */}
          {messages.length === 1 && (
            <div style={{
              padding: "0 14px 10px",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 20,
                    padding: "5px 10px",
                    fontSize: 11,
                    cursor: "pointer",
                    color: "#E03A3C",
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 8,
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about properties..."
              style={{
                flex: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 20,
                padding: "8px 14px",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                background: "#E03A3C",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}