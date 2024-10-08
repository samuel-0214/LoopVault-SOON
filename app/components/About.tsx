'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import { TracingBeam } from './ui/tracing-beam';

const sections = [
  {
    id: '#about',
    title: 'About LoopVault',
    content: "LoopVault revolutionizes decentralized finance by modernizing the traditional chit fund system using blockchain technology. Our platform offers secure, transparent, and efficient ways for communities to pool resources, manage loans, and invest without intermediaries."
  },
  {
    id: '#mission',
    title: 'Our Mission',
    content: 'Our mission is to empower communities worldwide by providing a trustless, transparent, and accessible financial platform. By leveraging blockchain, we aim to modernize community-based saving and lending, offering secure and efficient solutions that eliminate traditional banking barriers.'
  },
  {
    id: '#how-it-works',
    title: 'How LoopVault Works',
    content: 'LoopVault integrates traditional chit fund principles with decentralized finance (DeFi). Users join or create chit groups, contribute to the fund in cycles, and access pooled funds. Smart contracts automate contributions and disbursements, ensuring fairness and security for every participant.'
  },
  {
    id: '#ecosystem',
    title: 'The LoopVault Ecosystem',
    content: "LoopVault's ecosystem brings together participants, borrowers, and investors. Participants contribute to chit funds, borrowers access funds when needed, and investors participate for potential returns. Our ecosystem fosters a global community focused on financial empowerment and growth."
  },
  {
    id: '#vision',
    title: 'Future Vision',
    content: 'LoopVault aims to expand its platform with advanced features like staking, decentralized borrowing, and strategic partnerships. Our vision is to build a global community where everyone can save, invest, and manage finances efficiently, transforming decentralized finance into an accessible solution for all.'
  }
];

const AboutSection = () => {
  return (
    <div className="bg-gradient-to-b from-black via-[#100a14] to-black" id='about_section'>
      <TracingBeam>
        <div className="max-w-4xl mx-auto py-16">
          {sections.map((section, index) => (
            <InView key={section.id} threshold={0.5}>
              {({ ref, inView }) => (
                <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="mb-16 bg-opacity-5 p-6 rounded-lg shadow-lg border border-[#1d142b]"
                >
                  <h2 className="text-3xl font-bold mb-4 text-white">{section.title}</h2>
                  {Array.isArray(section.content) ? (
                    <ul className="list-disc pl-6 space-y-2 text-white">
                      {section.content.map((item, i) => (
                        <li key={i} className="hover:text-gray-300 transition-all duration-300">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white text-lg hover:text-gray-300 transition-all duration-300">{section.content}</p>
                  )}
                </motion.div>
              )}
            </InView>
          ))}
        </div>
      </TracingBeam>
    </div>
  );
};

export default AboutSection;
