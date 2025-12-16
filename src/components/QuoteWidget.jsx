import { useState, useEffect } from "react";

const QuotesWidget = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState(null);

  // Load quotes from local JSON file
  useEffect(() => {
    fetch("/data/codingQuotes.json")
      .then((res) => res.json())
      .then((data) => {
        setQuotes(data);
        pickRandomQuote(data);
      })
      .catch((err) => console.error("Error loading quotes:", err));
  }, []);

  const pickRandomQuote = (data) => {
    const random = data[Math.floor(Math.random() * data.length)];
    setQuote(random);
  };

  const handleNewQuote = () => {
    pickRandomQuote(quotes);
  };

  if (!quote) {
    return (
      <div className="p-4 bg-white shadow rounded-2xl">
        <p>Loading quote...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 text-gray-200 shadow rounded-2xl max-w-xl">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-5">
        💡 Dev Quote of the Day
      </h2>
      <p className="italic text-lg text-gray-150 mb-2">"{quote.quote}"</p>
      <p className="text-sm font-semibold text-gray-500 text-right mb-4">
        — {quote.author}
      </p>
      <button
        onClick={handleNewQuote}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer"
      >
        New Quote 🔄
      </button>
    </div>
  );
};

export default QuotesWidget;
