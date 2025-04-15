
import React from "react";

interface LogoProps {
  className?: string;
  type?: "full" | "icon";
}

const AgentLogo: React.FC<LogoProps> = ({ className = "", type = "full" }) => {
  if (type === "icon") {
    return (
      <div className={`relative ${className}`}>
        <img 
          src="/lovable-uploads/f2aa1eca-b46a-4b1c-8dfe-8f075a26228d.png" 
          alt="Agent Automation Icon" 
          className="h-full w-auto"
        />
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      <img 
        src="/lovable-uploads/e2f590c3-fb38-4556-a842-29a0d4076d56.png" 
        alt="Agent Automation" 
        className="h-full w-auto"
      />
    </div>
  );
};

export default AgentLogo;
