"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const faqData = [
  {
    question: "What is LoopVault?",
    answer: "LoopVault is a decentralized platform built on the Solana blockchain that modernizes traditional chit funds (ROSCA). It offers a transparent, secure, and efficient way for communities to manage savings and loans using blockchain technology.",
  },
  {
    question: "How does LoopVault work?",
    answer: "Participants can join or create chit groups, contribute to the fund in cycles, and access pooled funds. Smart contracts automate contributions and disbursements, ensuring fairness and security.",
  },
  {
    question: "Is LoopVault safe to use?",
    answer: "Yes, LoopVault uses blockchain technology and smart contracts to automate and secure transactions, minimizing the risk of fraud and ensuring transparency.",
  },
  {
    question: "What are the fees associated with using LoopVault?",
    answer: "LoopVault charges minimal transaction fees due to its use of the Solana blockchain, which is known for its low-cost and high-speed transactions.",
  },
  {
    question: "How can I join LoopVault?",
    answer: "To join LoopVault, simply visit the platform, create an account, and join or create a chit group based on your preferences.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black py-16 px-4 md:px-8 lg:px-10 max-w-5xl mx-auto rounded-md" id="faqsection">
      <h2 className="text-4xl font-bold mb-8 text-white text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => handleToggle(index)}
              className={`w-full text-left px-4 py-3 flex justify-between items-center bg-[#5e2d8a] hover:bg-[#4a216e] transition-all duration-300 ${activeIndex === index ? "text-white" : "text-white"}`}
            >
              <span className="text-lg font-semibold">{item.question}</span>
              <motion.span
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl"
              >
                ▼
              </motion.span>
            </button>
            {activeIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 px-4 py-2 text-white"
              >
                {item.answer}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
