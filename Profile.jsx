import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Home.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getCustomName = (user) => {
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const namePart = user.email.split("@")[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return "User";
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const toggleFlip = (index) => {
    setFlippedCardIndex(flippedCardIndex === index ? null : index);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="profile-header">
        <h1>USER PROFILE</h1>
        
      </header>

      <section className="profile-section">
        {user ? (
          <>
            {/* Card 1 */}
            <div
              className={`profile-card ${flippedCardIndex === 0 ? "flipped" : ""}`}
              onClick={() => toggleFlip(0)}
            >
              <div className="profile-card-inner">
                <div className="profile-card-front">
                  <h2>PERSONAL INFO'S</h2>
                 
                </div>
                <div className="profile-card-back">
                  <h2>Welcome back {getCustomName(user)} !</h2>
                  <p><strong>Email:</strong> {user.email}</p>
                
                  <p><strong>Joined:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className={`profile-card ${flippedCardIndex === 1 ? "flipped" : ""}`}
              onClick={() => toggleFlip(1)}
            >
              <div className="profile-card-inner">
                <div className="profile-card-front">
                  <h2>ABOUT US</h2>
                  
                </div>
                <div className="profile-card-back">
                  <p>This project, <strong>MEDIAVERSE - INSIGHTS</strong>, ensures safer online communication by detecting spam and hate speech using AI.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className={`profile-card ${flippedCardIndex === 2 ? "flipped" : ""}`}
              onClick={() => toggleFlip(2)}
            >
              <div className="profile-card-inner">
                <div className="profile-card-front">
                  <h2>Do's AND Don'ts</h2>
                 
                </div>
                <div className="profile-card-back">
                  <ul className="dos-donts">
                    <li>✅ Use ethically and responsibly.</li>
                    <li>✅ Respect others’ privacy.</li>
                    <li>❌ Don’t misuse AI analysis.</li>
                    <li>❌ Don’t upload confidential content.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Please log in to view your profile information.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
