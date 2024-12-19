import { motion } from "framer-motion";

const PostLoader = () => {
  return (
    <div className="bg-slate-700/50 border border-slate-700 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="w-8 h-8 bg-purple-600/50 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-4 bg-purple-400/30 rounded w-3/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
      </div>
      <motion.div
        className="h-4 bg-purple-400/30 rounded w-full mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      <motion.div
        className="h-4 bg-purple-400/30 rounded w-2/3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </div>
  );
};

export default PostLoader;
