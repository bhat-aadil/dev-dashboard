import { useState } from "react";
export default function VoiceWidget() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleCommand(text.toLowerCase());
    };

    recognition.start();
  };

  const handleCommand = (cmd) => {
    if (cmd.includes("search")) {
      const query = cmd.replace("search", "").trim();
      if (query)
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
    } else if (cmd.includes("open youtube")) {
      window.open("https://youtube.com", "_blank");
    } else {
      alert(`Command not recognized: ${cmd}`);
    }
  };

  return (
    <div className="p-4 rounded-2xl">
      <h2 className="text-lg text-gray-200 font-bold mb-2">Voice Command</h2>

      <button
        onClick={startListening}
        className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
          listening ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {listening ? "Listening... 🔊" : `Start Voice Command 🎙️`}
      </button>

      {transcript ? (
        <p className="text-gray-400 mt-2">
          <strong>You said:</strong> {transcript}
        </p>
      ) : (
        <p className="text-gray-400 mt-2">(search xyz/open youtube)</p>
      )}
    </div>
  );
}
