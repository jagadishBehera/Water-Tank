import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import tankImage from "../../Assets/Logos/efmMeter (2).png";

const Dashboard = () => {
  const [flow, setFlow] = useState(false);
  const [flowRate, setFlowRate] = useState(12.6);
  const [totalizer, setTotalizer] = useState(245.32);

  // Simulate water flow
  useEffect(() => {
    const interval = setInterval(() => {
      setFlow((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let t;
    if (flow) {
      t = setInterval(() => {
        setFlowRate((v) => v + Math.random() * 0.8); // keep number
        setTotalizer((v) => v + 0.05); // keep number
      }, 800);
    }
    return () => clearInterval(t);
  }, [flow]);

  return (
    <div className="bg-black  flex flex-col items-center justify-center text-white pb-20">
      {/* Analog Data Box */}
      <motion.div
        className="absolute top-26 left-24 bg-black/70 backdrop-blur-md text-white rounded-xl p-5 w-64 z-[100] border border-white/30 shadow-2xl"
        animate={{
          boxShadow: [
            "0 0 10px rgba(255,255,255,0.3)",
            "0 0 25px rgba(255,255,255,0.8)",
            "0 0 10px rgba(255,255,255,0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <h2 className="text-lg font-semibold mb-3 text-center tracking-wide">
          Analog Data
        </h2>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Flow Rate</span>
          <span className="font-bold text-blue-400">{flowRate} m³/h</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Totalizer</span>
          <span className="font-bold text-green-400">{totalizer} m³</span>
        </div>
      </motion.div>
      <div className="flex flex-col border border-white/30 justify-between absolute bottom-48 right-80 bg-black/70 backdrop-blur-md text-white rounded-xl p-2 text-sm">
        <span className="text-sm font-medium">Flow Rate</span>
        <span className="font-bold text-blue-400">0.00</span>
      </div>

      {/* Tank Image */}
      <div className="relative ml-9 top-[8.40rem] text-center mb-10">
        <img
          src={tankImage}
          alt="ESR Tank"
          className="relative w-110 z-50 object-contain shadow-lg"
        />
      </div>

      {/* Pipes */}
      <div className="flex items-center gap-4">
        {/* INLET PIPE */}
        <div className="flex items-baseline">
          {/* Horizontal Pipe */}
          <div className="relative left-[2rem] w-60 h-[1rem] bg-gray-700 rounded-full overflow-hidden">
            {flow && (
              <div className="absolute inset-0 overflow-hidden">
                {/* Water base */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #00bfff, #0077ff, #00bfff)",
                    opacity: 0.9,
                  }}
                  animate={{ backgroundPosition: ["200% 0", "0% 0"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />

                {/* Moving wave highlight */}
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 50%, white 8%, transparent 9%)",
                    backgroundSize: "40px 40px",
                  }}
                  animate={{ x: [-40, 40] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                />

                {/* Forward dotted direction particles */}
                <motion.div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(white 2px, transparent 2px)",
                    backgroundSize: "20px 20px",
                  }}
                  animate={{ x: [-20, 20] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear",
                  }}
                />
              </div>
            )}
          </div>

          {/* Vertical Connector */}
          <div className="w-6 h-16 bg-gray-700 rounded-full mx-2"></div>
        </div>

        {/* Tank connector */}
        {/* <div className="w-12 h-32 bg-gray-700 rounded-full"></div> */}

        {/* OUTLET PIPE */}
        <div className="flex items-baseline">
          {/* Vertical Connector */}
          <div className="w-6 h-16  bg-gray-700 rounded-full -mx-5"></div>

          {/* Horizontal Pipe */}
          <div className="relative w-60  h-[1rem] bg-gray-700 rounded-full overflow-hidden">
            {flow && (
              <div className="absolute inset-0 overflow-hidden">
                {/* Water base */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, #00bfff, #0077ff, #00bfff)",
                    backgroundSize: "200% 100%",
                    opacity: 0.9,
                  }}
                  animate={{ backgroundPosition: ["0% 0", "200% 0"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />

                {/* Wave highlight (reverse) */}
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 50%, white 8%, transparent 9%)",
                    backgroundSize: "40px 40px",
                  }}
                  animate={{ x: [40, -40] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                />

                {/* Dotted reverse flow */}
                <motion.div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(white 2px, transparent 2px)",
                    backgroundSize: "20px 20px",
                  }}
                  animate={{ x: [-20, 20] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      {/* <div className="my-6">
        <span
          className={`px-4 py-2 rounded-full ${flow ? "bg-green-500" : "bg-red-500"}`}
        >
          {flow ? "Water Flowing" : "No Flow"}
        </span>
      </div> */}
    </div>
  );
};

export default Dashboard;
