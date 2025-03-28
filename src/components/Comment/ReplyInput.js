import { useState } from "react";

const ReplyInput = ({ parentId, onReply }) => {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [homepage, setHomepage] = useState("");

  const handleReply = () => {
    if (text.trim()) {
      onReply({ text, username, email, homepage, parentId });
      setText("");
      setUsername("");
      setEmail("");
      setHomepage("");
    }
  };

  return (
    <div style={{ marginTop: "10px", width: "100%", maxWidth: "600px" }}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{ padding: "10px", borderRadius: "25px", border: "1px solid #ddd", width: "calc(33% - 10px)" }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ padding: "10px", borderRadius: "25px", border: "1px solid #ddd", width: "calc(33% - 10px)" }}
      />
      <input
        type="url"
        value={homepage}
        onChange={(e) => setHomepage(e.target.value)}
        placeholder="Homepage"
        style={{ padding: "10px", borderRadius: "25px", border: "1px solid #ddd", width: "calc(33% - 10px)" }}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишіть відповідь..."
        style={{ width: "100%", padding: "10px", borderRadius: "25px", border: "1px solid #ddd", minHeight: "50px", resize: "none" }}
      />
      <button
        onClick={handleReply}
        style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", marginTop: "10px" }}
      >
        Відповісти
      </button>
    </div>
  );
};

export default ReplyInput;
