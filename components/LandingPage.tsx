import React from 'react';
import { LinkedInLogo } from './LinkedInLogo';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-[#F3F2EF]">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-100/40 to-transparent blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-purple-100/40 to-transparent blur-3xl" />
      </div>

      <div className="z-10 flex flex-col items-center max-w-5xl mx-auto px-6 text-center pt-10">
        <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
           <LinkedInLogo size="lg" />
        </div>

        {/* Main Heading */}
        {/* Requirement: "make the first instance of 'Bold' bold, format 'Ideas Deserve' in plain text, and then bold the last 'Bold' word again." */}
        <h1 className="text-5xl md:text-7xl tracking-tight text-gray-900 mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <span className="block font-normal"><span className="font-bold">Bold</span> Ideas Deserve</span>
          <span className="block mt-2">
            <span className="font-bold">Bold</span> <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black">Formatting</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-500 mb-16 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 fill-mode-both">
          Break the formatting barriers of LinkedIn. Transform plain text into engaging, viral content with AI-driven styling and real-time previews.
        </p>

        {/* Animated Custom CSS Button */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          <button className="button-custom" onClick={onStart}>
            <div className="outline"></div>
            <div className="state state--default">
              <div className="icon">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g style={{filter: "url(#shadow)"}}>
                    <path
                      d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.92 9.24 14.21 9.53C14.5 9.82 14.5 10.29 14.21 10.58L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <filter
                      id="shadow"
                      x="-12.73"
                      y="-13.23"
                      width="37.46"
                      height="57.81"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      ></feColorMatrix>
                      <feOffset dy="4"></feOffset>
                      <feGaussianBlur stdDeviation="3.75"></feGaussianBlur>
                      <feComposite in2="hardAlpha" operator="out"></feComposite>
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                      ></feColorMatrix>
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_311_1143"
                      ></feBlend>
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_311_1143"
                        result="shape"
                      ></feBlend>
                    </filter>
                  </defs>
                </svg>
              </div>
              <p>
                {/* Start Formatting -> "Formatting" in italic */}
                <span style={{ "--i": 0 } as React.CSSProperties}>S</span>
                <span style={{ "--i": 1 } as React.CSSProperties}>t</span>
                <span style={{ "--i": 2 } as React.CSSProperties}>a</span>
                <span style={{ "--i": 3 } as React.CSSProperties}>r</span>
                <span style={{ "--i": 4 } as React.CSSProperties}>t</span>
                <span style={{ "--i": 5, marginLeft: '5px', fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>F</span>
                <span style={{ "--i": 6, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>o</span>
                <span style={{ "--i": 7, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>r</span>
                <span style={{ "--i": 8, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>m</span>
                <span style={{ "--i": 9, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>a</span>
                <span style={{ "--i": 10, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>t</span>
                <span style={{ "--i": 11, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>t</span>
                <span style={{ "--i": 12, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>i</span>
                <span style={{ "--i": 13, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>n</span>
                <span style={{ "--i": 14, fontStyle: 'italic', fontFamily: 'serif' } as React.CSSProperties}>g</span>
              </p>
            </div>
            <div className="state state--sent">
               {/* Icon for success state */}
               <div className="icon">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
               </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;