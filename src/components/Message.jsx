import React from "react";
import DOMPurify from "dompurify";

const Message = React.memo(({ message }) => {
  const isUser = message.role === "user";

  const formatMessageContent = (content) => {
    const formattedContent = content
      .replace(/\n/g, "<br />") // Replace new lines with <br />
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic text

    return DOMPurify.sanitize(formattedContent); // Sanitize to prevent XSS
  };

  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="content" dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
    </div>
  );
});

export default Message; 