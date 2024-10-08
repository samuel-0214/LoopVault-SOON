"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "./ui/background-beams";

export function ContactPage() {
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, message }),
      });

      if (response.ok) {
        setStatus("Email sent successfully!");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("Failed to send email. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("An error occurred while sending the email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 relative">
      <BackgroundBeams />
      <div className="max-w-4xl w-full h-[48rem] mt-32 p-8 bg-neutral-900 rounded-xl shadow-lg flex flex-col justify-center relative z-10">
        <h1 className="relative z-20 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
          Contact Us
        </h1>
        <form className="space-y-6 mt-8 relative z-20" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={handleEmailChange}
              required
              className="block w-full p-4 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-[#924ad8] focus:outline-none placeholder-neutral-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={handleSubjectChange}
              required
              className="block w-full p-4 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-[#924ad8] focus:outline-none placeholder-neutral-500"
            />
          </div>
          <div className="mb-6">
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={handleMessageChange}
              required
              className="block w-full p-4 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-[#924ad8] focus:outline-none placeholder-neutral-500"
              rows={10}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#924ad8] text-white font-bold py-3 rounded-lg hover:bg-[#7740b2] transition duration-300"
          >
            Send
          </button>
        </form>
        {status && <p className="mt-4 text-center text-white">{status}</p>}
      </div>
    </div>
  );
}

export default ContactPage;
