import { useState, useEffect } from "react";

const InterviewPrepWidget = () => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load questions from JSON file
  useEffect(() => {
    fetch("/data/interviewQuestions_full.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        pickRandomQuestion(data);
      })
      .catch((err) => console.error("Error loading questions:", err));
  }, []);

  function pickRandomQuestion(data) {
    setShowAnswer(false);
    setShowHint(false);
    const random = data[Math.floor(Math.random() * data.length)];
    setQuestion(random);
  }

  if (!question) {
    return (
      <div className="p-4 bg-white shadow rounded-2xl">
        <p>Loading interview question...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 text-gray-200 shadow rounded-2xl max-w-xl">
      <h2 className="text-xl font-bold mb-2">Interview Prep</h2>
      <p className="text-gray-400 mb-2">
        <strong>Category:</strong> {question.category}
      </p>
      <p className="text-lg font-medium mb-4">{question.question}</p>

      {/* Hint Button */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="mr-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
      >
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>

      {/* Answer Button */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
      >
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </button>

      {/* Hint Section */}
      {showHint && (
        <div className="mt-3 p-3 bg-gray-900 border-l-4 border-yellow-200 text-gray-200 rounded">
          <strong>Hint:</strong> {question.hint}
        </div>
      )}

      {/* Answer Section */}
      {showAnswer && (
        <div className="mt-3 p-3 bg-gray-900 border-l-4 border-blue-200 text-gray-200 rounded">
          <strong>Answer:</strong> {question.answer}
        </div>
      )}

      {/* Resources */}
      <div className="mt-4">
        <h3 className="font-semibold">Resources:</h3>
        <ul className="list-disc pl-6 text-blue-200">
          {question.resources.map((r, index) => (
            <li key={index}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition"
        onClick={() => pickRandomQuestion(questions)}
      >
        Next
      </button>
    </div>
  );
};

export default InterviewPrepWidget;
