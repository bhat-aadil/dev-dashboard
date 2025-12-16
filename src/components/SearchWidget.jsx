import { useState } from "react";
import { Search } from "lucide-react";
const defaultLinks = [
  { name: "GitHub", url: "https://github.com" },
  { name: "LinkedIn", url: "https://www.linkedin.com" },
  { name: "YouTube", url: "https://youtube.com" },
];

export default function SearchWidget() {
  const [links, setLinks] = useState(defaultLinks);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      window.open(`https://www.google.com/search?q=${search}`, "_blank");
    }
  };

  return (
    <div className="p-4 text-gray-200 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-2">Quick Links</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex mb-3 items-center">
        <input
          type="text"
          placeholder="Search Google..."
          className="flex-1 p-2 h-10 rounded-l-lg shadow-sm shadow-gray-500 outline-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="py-2  px-3 h-10 bg-gray-800 text-white rounded-r-lg shadow-sm shadow-gray-500 cursor-pointer hover:bg-gray-700"
        >
          <Search />
        </button>
      </form>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
