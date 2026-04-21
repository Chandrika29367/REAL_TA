"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";

function ContactRequestsContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inquiryId, setInquiryId] = useState(null);
  const [inquiry, setInquiry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const id = searchParams.get("inquiry");
    if (id) setInquiryId(id.trim());
  }, [searchParams]);

  useEffect(() => {
    if (!inquiryId) {
      setLoading(false);
      return;
    }

    // Fetch inquiry details
    fetch(`/api/inquiries/${inquiryId}`)
      .then(r => r.json())
      .then(d => {
        setInquiry(d.inquiry);
        setMessages(d.messages || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [inquiryId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !inquiryId) return;

    setSending(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage, userId: session?.user?.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!inquiryId) return;

    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });

      if (res.ok) {
        setInquiry(prev => ({ ...prev, status: "resolved" }));alert("Inquiry marked as resolved");
      }
    } catch (error) {
      alert("Failed to update inquiry");
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!inquiryId || !inquiry) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Contact Requests</h1>
          <p style={{ color: "#666" }}>Select an inquiry to view conversation</p>
        </div>
      </>
    );
  }

  const isAgent = session?.user?.role === "agent" || session?.user?.role === "admin";
  const isInitiator = inquiry.userId === session?.user?.id;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
            {inquiry.property?.title} in {inquiry.property?.location}
          </h1>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#666" }}>
              {isAgent ? (
                <>
                  <strong>From:</strong> {inquiry.user?.name}
                </>
              ) : (
                <>
                  <strong>Agent:</strong> {inquiry.property?.agent || "Not specified"}
                </>
              )}
            </span>
            <span
              style={{
                background: inquiry.status === "resolved" ? "#E0F2F1" : "#FFF3F0",
                color: inquiry.status === "resolved" ? "#00897B" : "#E03A3C",
                padding: "6px 12px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {inquiry.status?.toUpperCase() || "PENDING"}
            </span>
          </div>
        </div>

        {/* Messages Container */}
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: 20,
            background: "#fafafa",
            minHeight: 400,
            maxHeight: 500,
            overflowY: "auto",
            marginBottom: 20,
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#999", paddingTop: 40 }}>
              <p>No messages yet. Start the conversation below.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 15 }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    background: msg.senderId === session?.user?.id ? "#E03A3C" : "white",
                    color: msg.senderId === session?.user?.id ? "white" : "black",
                    padding: 15,
                    borderRadius: 8,
                    marginLeft: msg.senderId === session?.user?.id ? "auto" : 0,
                    marginRight: msg.senderId === session?.user?.id ? 0 : "auto",
                    maxWidth: "70%",
                    border: msg.senderId === session?.user?.id ? "none" : "1px solid #e0e0e0",
                  }}
                >
                  <p style={{ margin: 0, marginBottom: 4 }}>
                    <strong>{msg.sender?.name}</strong>
                  </p>
                  <p style={{ margin: 0, marginBottom: 4 }}>{msg.content}</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        {inquiry.status !== "resolved" && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "grid", gap: 10 }}>
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #e0e0e0",
                  borderRadius: 6,
                  fontFamily: "inherit",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  style={{
                    flex: 1,
                    background: "#E03A3C",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: 6,
                    cursor: sending ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
                {isAgent && (
                  <button
                    onClick={handleMarkResolved}
                    style={{
                      background: "#00897B",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Initial Message */}
        <div style={{ background: "#f0f0f0", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Initial Message</h3>
          <p style={{ color: "#555" }}>{inquiry.message}</p>
          <p style={{ fontSize: 12, color: "#999", marginTop: 10 }}>
            Sent on {new Date(inquiry.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}

export default function ContactRequestsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "sans-serif",
        color: "#999",
        fontSize: 16,
      }}>
        Loading...
      </div>
    }>
      <ContactRequestsContent />
    </Suspense>
  );
}
