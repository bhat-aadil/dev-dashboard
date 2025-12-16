import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Greet from "./components/Greet";

export default function App() {
  const [greet, setGreet] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setGreet(false);
    }, 7000);
  }, []);
  return (
    <div className="p-6 min-h-screen">{greet ? <Greet /> : <Dashboard />}</div>
  );
}
