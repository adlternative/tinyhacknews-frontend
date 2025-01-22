import React from "react";
import "./FaqPage.css";

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
    <div className="faq-container">
      {/* Large icon at the top of the page */}
      <img src="/y18.svg" alt="FAQ Icon" className="faq-icon" />

      {/* FAQ list */}
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="qa-box">
            <div className="question">{item.question}</div>
            <div className="answer">{item.answer}</div>
          </div>
        ))}
        <hr className="divider-line" />
      </div>
    </div>
  );
};

export default FaqPage;
