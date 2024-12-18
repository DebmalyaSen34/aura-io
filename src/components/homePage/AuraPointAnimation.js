import { motion } from "framer-motion";

const AuraPointsAnimation = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-6 h-6 bg-purple-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-6 h-6 bg-blue-500 rounded-full ml-2"
        animate={{
          scale: [1.5, 1, 1.5],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      <motion.div
        className="w-6 h-6 bg-green-500 rounded-full ml-2"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </div>
  );
};

export default AuraPointsAnimation;
