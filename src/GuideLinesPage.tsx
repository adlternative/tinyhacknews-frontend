import React from "react";
import "./GuideLinesPage.css";

interface GuidelineItem {
  title: string;
  description: string;
}

const guidelinesData: GuidelineItem[] = [
  {
    title: "Be Friendly and Respectful",
    description:
      "Ensure your interactions are friendly and respectful towards others.",
  },
  {
    title: "Avoid Sensitive Topics",
    description:
      "Try to avoid discussing sensitive topics that may cause discomfort or conflict.",
  },
  {
    title: "Stay on Topic",
    description:
      "Keep discussions focused on the topic at hand to maintain relevance and clarity.",
  },
  {
    title: "Use Constructive Feedback",
    description:
      "Provide constructive feedback when appropriate, focusing on improving the discussion rather than criticizing individuals.",
  },
];

const GuideLinesPage: React.FC = () => {
  return (
    <div className="guide-lines-container">
      {/* Large icon at the top of the page */}
      <img src="/y18.svg" alt="Guidelines Icon" className="guide-lines-icon" />

      {/* Guidelines list */}
      <div className="guide-lines-list">
        {guidelinesData.map((item, index) => (
          <div key={index} className="guideline-box">
            <div className="title">{item.title}</div>
            <div className="description">{item.description}</div>
          </div>
        ))}
        <hr className="divider-line" />
      </div>
    </div>
  );
};

export default GuideLinesPage;
