"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedSlideInText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [currentText, setCurrentText] = useState(text);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (text !== currentText) {
      setKey(prev => prev + 1);
      setCurrentText(text);
    }
  }, [text, currentText]);

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {currentText}
    </motion.div>
  );
};