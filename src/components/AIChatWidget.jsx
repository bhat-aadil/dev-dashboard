import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function AIChatWidget() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const key = import.meta.env.VITE_AI_CHAT_KEY;

  // scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, loading]);

  async function fetchAnswer() {
    if (query.trim() === "") return;

    // Append user message
    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: query }] },
    ];
    setChatHistory(updatedHistory);
    setQuery("");
    setLoading(true);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: updatedHistory }),
      });

      const data = await response.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      // Append bot response
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: botText }] },
      ]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, something went wrong. Try again later." }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative p-4 bg-gray-800 text-gray-200 rounded-2xl shadow flex flex-col h-96 w-full max-w-md mx-auto">
      <h2 className="text-lg text-gray-400 font-bold mb-2">AI Chat</h2>

      <div className="flex flex-col gap-2 mb-14 overflow-y-auto h-full pr-1">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] break-words ${
              msg.role === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.parts[0].text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 italic self-start">Typing...</div>
        )}

        {/* invisible div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchAnswer();
        }}
        className="absolute bottom-0 left-0 right-0 bg-gray-900 p-2 flex items-center gap-2 rounded-t-lg"
      >
        <input
          type="text"
          placeholder="Enter a prompt"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-gray-800 p-2 rounded text-white outline-none"
        />
        <FaPaperPlane
          className="cursor-pointer text-blue-400 hover:text-blue-300"
          onClick={fetchAnswer}
        />
      </form>
    </div>
  );
}
