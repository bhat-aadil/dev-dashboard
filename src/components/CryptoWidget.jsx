import { useEffect, useState } from "react";

const cryptos = [
  "bitcoin",
  "ethereum",
  "cardano",
  "solana",
  "dogecoin",
  "polkadot",
  "litecoin",
  "polygon",
  "avalanche-2",
  "tron",
];

const CryptoWidget = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptos.join(
            ","
          )}`
        );
        const data = await res.json();
        setCoins(data);
        console.log(cryptos.join(","));
      } catch (err) {
        console.error("Error fetching cryptos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-700 text-gray-200 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-3">💰 Crypto Prices</h2>
      {coins.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {coins.map((coin) => (
            <li
              key={coin.id}
              className={`flex justify-between p-2 rounded ${
                coin.price_change_percentage_24h >= 0
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              <span className="flex items-center space-x-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                <span className="font-semibold text-gray-950">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </span>
              </span>
              <span className="font-semibold text-gray-900">
                ${coin.current_price.toLocaleString()}{" "}
                <span
                  className={`ml-2 ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CryptoWidget;
