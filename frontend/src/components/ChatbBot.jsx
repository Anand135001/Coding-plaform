import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

function ChatAi({ problem }) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: "Hey! I'm Root AI. Ask me anything about this problem — hints, approach, debugging, or concepts." }] },
  ]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);
  const inputValue = watch("message", "");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    const userMessage = { role: "user", parts: [{ text: data.message }] };
    const updatedMessage = [...messages, userMessage];
    setMessages(updatedMessage);
    reset();
    setIsLoading(true);

    try {
      const response = await fetch("/ai/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessage,
          title: problem.title,
          description: problem.description,
          testCases: problem.visibleTestCases,
          startCode: problem.startCode,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiMessage = { role: "model", parts: [{ text: "" }] };
      setMessages((prev) => [...prev, aiMessage]);

      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessage.parts[0].text += decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...aiMessage };
          return updated;
        });
        await sleep(200);
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Sorry, something went wrong. Please try again." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "90vh", minHeight: "520px", maxHeight: "740px",
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "10px",
        background: "var(--surface-2)", flexShrink: 0,
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", flexShrink: 0,
        }}>✦</div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Root AI</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Context-aware coding assistant</div>
        </div>
        {isLoading && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: "var(--accent)",
                  animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <style>{`
              @keyframes bounce-dot {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                40% { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
        className="custom-scroll">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={index} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: "8px", alignItems: "flex-end" }}>
              {!isUser && (
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, var(--accent), #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0, marginBottom: "2px" }}>✦</div>
              )}
              <div style={{
                maxWidth: "78%",
                padding: "10px 14px",
                borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                fontSize: "13.5px", lineHeight: "1.65",
                color: isUser ? "#fff" : "var(--text-primary)",
                background: isUser
                  ? "var(--accent)"
                  : "var(--surface-3)",
                border: isUser ? "none" : "1px solid var(--border)",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}>
                {msg.parts[0].text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)} style={{
        padding: "12px 14px",
        borderTop: "1px solid var(--border)",
        background: "var(--surface-2)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--surface-0)", border: `1px solid ${errors.message ? "var(--red)" : "var(--border)"}`, borderRadius: "10px", padding: "6px 6px 6px 14px", transition: "border-color 0.2s" }}>
          <input
            placeholder="Ask about approach, hints, debugging…"
            {...register("message", { required: true, minLength: 2 })}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: "13px", color: "var(--text-primary)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button
            type="submit"
            disabled={!inputValue?.trim() || isLoading}
            style={{
              width: "32px", height: "32px", borderRadius: "7px",
              background: (!inputValue?.trim() || isLoading) ? "var(--surface-3)" : "var(--accent)",
              border: "none", cursor: (!inputValue?.trim() || isLoading) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, transform 0.15s",
              flexShrink: 0,
            }}
            onMouseDown={e => { if (inputValue?.trim() && !isLoading) e.currentTarget.style.transform = "scale(0.92)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <Send size={14} color={(!inputValue?.trim() || isLoading) ? "var(--text-muted)" : "#fff"} />
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", paddingLeft: "2px" }}>
          Root AI has context of this problem's title, description, and test cases.
        </p>
      </form>
    </div>
  );
}

export default ChatAi;