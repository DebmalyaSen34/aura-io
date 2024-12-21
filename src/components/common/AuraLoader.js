import React from "react";
import { motion } from "framer-motion";

const AuraLoader = () => {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="w-16 h-16 border-4 border-purple-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          borderRadius: ["50%", "40%", "50%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
      >
        <motion.div
          className="w-full h-full bg-purple-500 rounded-full"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
};

export default AuraLoader;
