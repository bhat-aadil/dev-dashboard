import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_STOCKS_KEY;

const companies = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Google" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "META", name: "Meta" },
  { symbol: "NVDA", name: "NVIDIA" },
];

const StocksWidget = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (const c of companies) {
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${c.symbol}&token=${API_KEY}`
          );
          const json = await res.json();
          data.push({
            name: c.name,
            symbol: c.symbol,
            price: json.c,
            change: json.d,
            percent: json.dp,
          });
        } catch (err) {
          console.error("Error fetching stock:", err);
        }
      }
      setStocks(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-700 text-gray-200 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-3">📈 Tech Stocks</h2>
      {stocks.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {stocks.map((s, idx) => (
            <li
              key={idx}
              className={`flex gap-5 justify-between p-2 rounded ${
                s.change >= 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <span className="text-gray-950 font-semibold">{s.name}</span>
              <span className="font-semibold text-gray-900 flex">
                ${s.price.toFixed(2)}{" "}
                <span
                  className={`ml-2 ${
                    s.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {s.change.toFixed(2)} ({s.percent.toFixed(2)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
// ({s.symbol})

export default StocksWidget;
