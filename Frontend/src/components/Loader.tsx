import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center gap-1.5 h-full">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-white"
          animate={{
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
