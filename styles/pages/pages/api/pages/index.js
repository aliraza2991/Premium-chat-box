import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const SUGGESTIONS = [
  "Help me brainstorm ideas for a new project",
  "Explain a complex topic simply",
  "Review and improve my writing",
  "Create a strategic plan for my goal",
];

function TypingIndicator() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"12px 16px" }}>
      {[0,1,2].map((i) => (
        <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#a78bfa", animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start", marginBottom:16, animation:"fadeSlideIn 0.3s ease-out" }}>
      {!isUser && (
        <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg, #7c3aed, #a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, marginRight:10, flexShrink:0, marginTop:2, boxShadow:"0 0 12px rgba(124,58,237,0.4)" }}>✦</div>
      )}
      <div style={{ maxWidth:"72%", padding:"12px 16px", borderRadius:isUser?"18px 18px 4px 18px":"18px 18px 18px 4px", background:isUser?"linear-gradient(135deg, #7c3aed, #6d28d9)":"rgba(255,255,255,0.06)", border:isUser?"none":"1px solid rgba(255,255,255,0.08)", color:"#f1f0ff", fontSize:14.5, lineHeight:1.65, whiteSpace:"pre-wrap" }}>
        {msg.content}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setError("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const newMessages = [...messages, { role:"user", content:userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ messages:newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessages([...newMessages, { role:"assistant", content:data.reply }]);
    } catch(e) {
      setError(e.message || "Something went wrong. Please try again.");
      setMessages(messages);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <>
      <Head>
        <title>Premium AI Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 50%, #0d1117 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div style={{ width:"100%", maxWidth:720, height:"88vh", display:"flex", flexDirection:"column", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:24, overflow:"hidden", backdropFilter:"blur(20px)", boxShadow:"0 0 60px rgba(124,58,237,0.15), 0 24px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ padding:"18px 24px", borderBottom:"1px solid rgba(124,58,237,0.15)", display:"flex", alignItems:"center", gap:12, background:"rgba(124,58,237,0.06)" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 20px rgba(124,58,237,0.5)" }}>✦</div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#f1f0ff" }}>Premium AI Assistant</div>
              <div style={{ fontSize:12, color:"rgba(167,139,250,0.7)", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block" }} />
                Online · Always here to help
              </div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"24px 20px" }}>
            {isEmpty ? (
              <div style={{ textAlign:"center", paddingTop:40 }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✦</div>
                <div style={{ fontSize:24, fontWeight:700, marginBottom:8, background:"linear-gradient(135deg, #f1f0ff, #a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>How can I help you today?</div>
                <div style={{ fontSize:14, color:"rgba(167,139,250,0.6)", marginBottom:36 }}>Ask me anything — I am here to inform, inspire, and solve.</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                  {SUGGESTIONS.map((s,i) => (
                    <button key={i} onClick={() => sendMessage(s)} style={{ padding:"10px 18px", borderRadius:100, border:"1px solid rgba(124,58,237,0.3)", background:"rgba(124,58,237,0.08)", color:"rgba(196,181,253,0.9)", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg,i) => <Message key={i} msg={msg} />)}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", marginBottom:16 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg, #7c3aed, #a78bfa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, marginRight:10 }}>✦</div>
                    <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"18px 18px 18px 4px" }}><TypingIndicator /></div>
                  </div>
                )}
              </>
            )}
            {error && <div style={{ textAlign:"center", color:"#f87171", fontSize:13, marginTop:8 }}>{error}</div>}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(124,58,237,0.15)", background:"rgba(124,58,237,0.04)" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:16, padding:"10px 14px" }}>
              <textarea
                ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); } }}
                placeholder="Ask me anything..."
                rows={1}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#f1f0ff", fontSize:14.5, resize:"none", maxHeight:120, lineHeight:1.6, fontFamily:"inherit" }}
                onInput={(e) => { e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim()||loading} style={{ width:38, height:38, borderRadius:10, border:"none", background:input.trim()&&!loading?"linear-gradient(135deg, #7c3aed, #6d28d9)":"rgba(124,58,237,0.2)", color:input.trim()&&!loading?"#fff":"rgba(167,139,250,0.4)", cursor:input.trim()&&!loading?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, fontFamily:"inherit" }}>↑</button>
            </div>
            <div style={{ fontSize:11, color:"rgba(167,139,250,0.35)", textAlign:"center", marginTop:8 }}>Press Enter to send · Shift+Enter for new line</div>
          </div>
        </div>
      </div>
    </>
  );
}
