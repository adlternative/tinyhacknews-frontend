import React from "react";
import shardStyles from "styles/shared.module.css";
import styles from "./FaqPage.module.css";

interface QAItem {
  question: string;
  answer: string;
}

const faqData: QAItem[] = [
  {
    question: "What is the difference between TinyHackerNews and HackerNews?",
    answer:
      "TinyHackerNews is a personal project aimed at learning and implementing web projects, while HackerNews is a popular news aggregator website.",
  },
  {
    question: "Which features have not yet been implemented?",
    answer:
      "Currently, some features such as search and news ranking have not been implemented in TinyHackerNews. These features are planned to be added soon.",
  },
  {
    question: "How can I post jobs on the Jobs page?",
    answer:
      "To post jobs on the Jobs page, submit news with titles starting with 'Jobs HN'. This differs from Hacker News, which primarily provides job listings for YC startups.",
  },
];

const FaqPage: React.FC = () => {
  return (
    <div className={styles.faqContainer}>
      {/* Large icon at the top of the page */}
      <img src="/y18.svg" alt="FAQ Icon" className={styles.faqIcon} />

      {/* FAQ list */}
      <div className={styles.faqList}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.qaBox}>
            <div className={styles.question}>{item.question}</div>
            <div className={styles.answer}>{item.answer}</div>
          </div>
        ))}
        <hr className={shardStyles.dividerLine} />
      </div>
    </div>
  );
};

export default FaqPage;
