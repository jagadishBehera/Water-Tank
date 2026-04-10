import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Activity, Gauge, MapPin, Wifi } from "lucide-react";
import SkeletonCard from "../../Components/Admin/SkeletonCard";

// Generate Data
const generateData = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Tank ${i + 1}`,
    location: ["Odisha", "Delhi", "Mumbai", "Bangalore"][i % 4],
    image: `https://picsum.photos/600/300?random=${i + 1}`,
  }));
};

const allData = generateData();

function Report() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Filter
  const filteredData = useMemo(() => {
    return allData.filter(
      (item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.location.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setVisibleCount((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // simulate API loading
  }, []);

  return (
    <div className="min-h-screen bg-white/90 backdrop-blur-xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-700"> Monitoring</h1>

        <input
          type="text"
          placeholder="Search tank or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
          : filteredData.slice(0, visibleCount).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-md border border-blue-100 rounded-2xl cursor-pointer shadow-md overflow-hidden"
            >
              {/* Image */}
              <div className="h-20 w-full">
                <img 
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {item.location}
                </p>

                {/* Icons */}
                <div className="grid grid-cols-5 gap-2 mt-3 text-blue-600">
                  <Droplet size={16} />
                  <Activity size={16} />
                  <Gauge size={16} />
                  <Wifi size={16} />
                  <Droplet size={16} />
                </div>

                {/* Footer */}
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[10px] text-green-500">● Active</span>
                  <button className="text-[10px] px-2 py-1 bg-blue-500 text-white rounded-lg">
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Empty */}
      {filteredData.length === 0 && (
        <div className="text-center mt-10 text-gray-400">No data found</div>
      )}
    </div>
  );
}

export default Report;