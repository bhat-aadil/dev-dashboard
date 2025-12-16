import { useState, useEffect } from "react";

const DailyCodingChallenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [difficulty, setDifficulty] = useState("All");

  // Load all challenges once
  useEffect(() => {
    fetch("/data/codingChallenges.json")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        pickRandomChallenge(data, "All");
      })
      .catch((err) => console.error("Error loading coding challenges:", err));
  }, []);

  const pickRandomChallenge = (data, diff) => {
    let filtered = data;
    if (diff !== "All") {
      filtered = data.filter((q) => q.difficulty === diff);
    }
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setChallenge(random);
    setSelected(null);
    setRevealed(false);
  };

  const handleChoice = (choice) => {
    setSelected(choice);
    setRevealed(true);
  };

  const nextChallenge = () => {
    pickRandomChallenge(challenges, difficulty);
  };

  if (!challenge) {
    return (
      <div className="p-4 bg-white shadow rounded-2xl">
        <p>Loading coding challenge...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 text-gray-200 shadow rounded-2xl max-w-xl">
      <h2 className="text-xl font-bold mb-2">💻 Daily Coding Challenge</h2>

      {/* Difficulty Filter */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            pickRandomChallenge(challenges, e.target.value);
          }}
          className="px-2 py-1 border rounded-lg bg-gray-800 "
        >
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <p className="text-gray-400 mb-1">
        <strong>Category:</strong> {challenge.category} |{" "}
        <strong>Difficulty:</strong> {challenge.difficulty}
      </p>
      <p className="text-lg font-medium mb-4">{challenge.question}</p>

      {/* Answer Choices */}
      <div className="space-y-2">
        {challenge.choices.map((choice, idx) => {
          const isCorrect = choice === challenge.answer;
          const isSelected = choice === selected;

          let style =
            "w-full text-left px-4 py-2 rounded-lg border transition bg-gray-900 hover:bg-gray-800 ";
          if (revealed && isCorrect) {
            style += "bg-green-100 border-green-400 text-green-800";
          } else if (revealed && isSelected && !isCorrect) {
            style += "bg-red-100 border-red-400 text-red-800";
          } else {
            style += "bg-gray-50 border-gray-300 hover:bg-gray-100";
          }

          return (
            <button
              key={idx}
              onClick={() => handleChoice(choice)}
              disabled={revealed}
              className={style}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Correct Answer */}
      {revealed && (
        <div className="mt-4 p-3 bg-green-200 border-l-4 border-green-300 text-gray-800 rounded">
          ✅ Correct Answer: <strong>{challenge.answer}</strong>
        </div>
      )}

      {/* Next Challenge Button */}
      {revealed && (
        <button
          onClick={nextChallenge}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transition"
        >
          Next Challenge ➡️
        </button>
      )}
    </div>
  );
};

export default DailyCodingChallenge;
