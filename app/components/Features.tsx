"use client";

import data from "../data/features.json";
import { BackgroundGradient } from "./ui/background-gradient";
import styles from "../styles/Features.module.css";


interface Feature {
  id: number;
  feature: string;
  description: string;
  isit: boolean;
}

function Features() {
  const feature = data.features.filter((features: Feature) => features.isit);

  return (
    <div className={styles.featuresSection} id="features">
      <div className="text-center mb-8">
        <h2 className="text-base text-teal-600 text-2xl font-semibold tracking-wide uppercase">
          FEATURES OFFERED
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
          Secure, Transparent, and Community-Driven Finance
        </p>
      </div>

      {/* Infinite Moving Cards */}
      <div className="relative overflow-hidden h-[30rem]">
        <div className={styles.cardsContainer}>
          {feature.concat(feature).map((features: Feature, index) => (
            <div
              key={index}
              className={styles.cardContainer}
            >
              <BackgroundGradient className="card flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-[28rem] w-[350px] max-w-sm ">
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center text-center flex-grow">
                  <p className={styles.cardTitle}>{features.feature}</p>
                  <p className={styles.cardDescription}>
                    {features.description}
                  </p>
                </div>
              </BackgroundGradient>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
