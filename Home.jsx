import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, BarChart2, Mail, ArrowUp } from "lucide-react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./Home.css";
import Output1 from "../assets/output1.png";
import Output2 from "../assets/output2.png";
import Output3 from "../assets/output3.png";

const Home = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
        
      const scrollY = window.scrollY;
      setScrolling(scrollY > 50);
      setShowScroll(scrollY > 300); 
      
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || user.email.split("@")[0]);
      } else {
        setUsername("Guest");
      }
    });
    return () => unsubscribe();
  }, []);

  const scrollToDemo = () => {
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top:20, behavior: "smooth" });
  };

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <header className={`header ${scrolling ? "scrolled" : ""}`}>
        <h1 className="logo">MEDIAVERSE - INSIGHTS</h1>
        <span className="user-greeting">Welcome {username}!</span>

        <nav className="nav-icons">
          <span className="nav-icon" onClick={scrollToDemo}>
            <BarChart2 /> Action
          </span>
          <span className="nav-icon" onClick={scrollToFooter}>
            <Mail /> Contact
          </span>
        </nav>

        <div className="menu-container">
          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-btn">
            <Menu />
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
                {darkMode ? <Sun /> : <Moon />}
              </button>
              <Link to="/profile" className="menu-item">
                Profile
              </Link>
              <Link to="http://localhost:5173/" className="menu-item">
                LogOut
              </Link>
            </div>
          )}
        </div>
      </header>
       

      <button
        id="backtotopbutton"
        className={`scroll-to-top ${showScroll ? "show" : "hide"}`} // ✅ Added class toggling
        onClick={scrollToTop}
      >
      </button>
      
      {/* Main Section */}
      <main className="main-section">
        <div className="intro-section">
          <h2>Welcome to AI Comments Detection</h2>
          <p>Ensuring Safer Conversations with AI-Powered Moderation.</p>
        </div>

        <div className="content-container">
          <div className="card-section left">
            <div className="card">
              <div className="text-content1">
                <h3>Word Analysis Section</h3>
                <p>Detecting Spam and Hate Speech – Identify and analyze harmful content.</p>
              </div>
              <Link to="/comments" className="in-card"></Link>
            </div>
          </div>

          <div className="card-section right">
            <div className="card">
              <Link to="/youtube" className="in-card"></Link>
              <div className="text-content2">
                <h3><strong>Social Media Comment Detection</strong></h3>
                <p>AI-powered automated filtering and analyzing of inappropriate comments.</p>
                <p>
                  It is an AI-driven content detection system to identify and filter spam, hate 
                  <p>speech, and misinformation in real-time.</p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Demo Section */}
      <section id="demo" className="demo-section">
        <h2> INSIGHTS</h2>
        <div className="demo-content">
          <div className="demo-grid">
            <div className="demo-card">
              <img src={Output1} alt="YouTube Link Input Example" />
              <p>🔍 Place the ID (YOUTUBE COPYLINK)</p>
            </div>
            <div className="demo-card">
              <img src={Output2} alt="Click Analyze Button" />
              <p>🚨 Click the Analyze button</p>
            </div>
            <div className="demo-card">
              <img src={Output3} alt="Filtered Comments in Excel" />
              <p>✅ Shows the filtered comments in the form of an Excel file</p>
            </div>
          </div>
        </div>
      </section>

    {/* Footer Section */}
<footer id="footer" className="footer">
  <div className="footer-content">
    <div className="quick-links">
      <h3>Quick Links</h3>
      <Link to="/">Home</Link>
      <Link to="/youtube">AI Detection</Link>
    </div>

    <div className="social-media">
      <h3>Follow Us</h3>
      <a href="https://www.linkedin.com/in/prabhakaran-s-r/" target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a href="https://github.com/PrabhaCodz" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </div>

    <div className="newsletter">
      <h3>Stay Updated</h3>
      <input type="email" placeholder="Enter your email" />
      <button>Subscribe</button>
    </div>
  </div>

  {/* Scroll to Top Button Inside Footer */}
  <button id="scrollToTop" className="scroll-to-top" onClick={scrollToTop}>
    ⬆
  </button>


        {/* Team Members Section */}
        <section className="team-members">
          <h3>👥 Meet Our Team</h3>
          <div className="team-grid">
            <div className="team-member">
              <strong>Prabhakaran S R</strong>
              <a href="https://www.linkedin.com/in/prabhakaran-s-r/" target="_blank" rel="noopener noreferrer">
                Project Lead
              </a>
            </div>
            <div className="team-member">
              <strong>Sadhiq Ali S</strong>
              <a href="https://www.linkedin.com/in/sadhiqali04" target="_blank" rel="noopener noreferrer">
                Developer
              </a>
            </div>
            <div className="team-member">
              <strong>Mohan S</strong>
              <a href="https://www.linkedin.com/in/prabhakaran-s-r/" target="_blank" rel="noopener noreferrer">
                Developer
              </a>
            </div>
          </div>
        </section>

       

        <p>© {new Date().getFullYear()} AI-Powered Analysis: MEDIAVERSE - INSIGHTS</p>
      </footer>
    </div>
  );
};

export default Home;

