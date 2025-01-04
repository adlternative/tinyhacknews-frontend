import React from "react";
import "./NavBar.css";

interface NavBarProps {
  username: string | null;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ username, onLogout }) => {
  const links = [
    { label: "new", href: "/news" },
    { label: "threads", href: "/threads" },
    { label: "past", href: "/past" },
    { label: "comments", href: "/comments" },
    { label: "ask", href: "/ask" },
    { label: "show", href: "/show" },
    { label: "jobs", href: "/jobs" },
    { label: "submit", href: "/submit" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* 包装图标和标题，使其都可点击跳转到首页 */}
        <a href="/" className="navbar-home-link">
          <img src="/public/y18.svg" alt="Y18N Icon" className="navbar-icon" />
          <span className="navbar-title">
            <b>Tiny Hacker News</b>
          </span>
        </a>
        {links.map((link, index) => (
          <React.Fragment key={index}>
            <a href={link.href} className="navbar-link">
              {link.label}
            </a>
            {index !== links.length - 1 && (
              <span className="navbar-separator">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="navbar-right">
        {username ? (
          <>
            <span className="navbar-username">{username}</span>
            <span className="navbar-separator">|</span>
            <button className="navbar-logout" onClick={onLogout}>
              logout
            </button>
          </>
        ) : (
          <a href="/login" className="navbar-link">
            login
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
