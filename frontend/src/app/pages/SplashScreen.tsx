import React, { useEffect, useState } from "react";


const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>
        {`
          .splash-container {
            position: fixed;
            inset: 0;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: splashFadeOut 0.6s ease-in-out forwards;
            animation-delay: 1.2s;
          }

          .splash-logo {
            width: 160px;
            max-width: 70%;
            animation: logoFadeInScale 0.8s ease-in-out;
          }

          @keyframes logoFadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes splashFadeOut {
            to {
              opacity: 0;
              visibility: hidden;
            }
          }
        `}
      </style>

      <div className="splash-container">
        <img
          src="/favicon.ico"
          alt="Devasahayam Mount Shrine"
          className="splash-logo"
        />
      </div>
    </>
  );
};

export default SplashScreen;
