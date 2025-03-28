import { observer } from "mobx-react-lite";
import { useEffect, useContext, useState } from "react";
import { ctx } from "../store/Context";

// Функція для побудови дерева коментарів
const buildCommentTree = (comments) => {
  const map = {};
  const tree = [];
  
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, children: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId !== null) {
      map[comment.parentId]?.children.push(map[comment.id]);
    } else {
      tree.push(map[comment.id]);
    }
  });

  return tree;
};

// Компонент для відображення даних про автора коментаря (користувач або анонім)
const CommentAuthor = ({ author, anonymousAuthor }) => {
  return (
    <div style={{ marginBottom: "10px", fontSize: "14px", color: "#555" }}>
      <strong>
        {author ? author.username : anonymousAuthor ? anonymousAuthor.username : "Анонім"}
      </strong>
      <p style={{ margin: "5px 0", fontSize: "12px", color: "#777" }}>
        {author ? author.email : anonymousAuthor ? anonymousAuthor.email : "Немає емайлу"}
      </p>
    </div>
  );
};

// Компонент для відображення детальної інформації про коментар
const CommentDetails = ({ comment }) => {
  return (
    <div>
      <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#333" }}>
        <strong>Коментар: </strong>{comment.text || "Немає тексту коментаря"}
      </p>
      <p style={{ fontSize: "10px", color: "#999" }}>
        <strong>Дата додавання: </strong>
        {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Немає дати"}
      </p>
      <p style={{ fontSize: "10px", color: "#999" }}>
        <strong>ID коментаря: </strong>{comment.id || "Немає ID"}
      </p>
      <p style={{ fontSize: "10px", color: "#999" }}>
        <strong>ID батьківського коментаря: </strong>
        {comment.parentId ? comment.parentId : "Цей коментар є кореневим"}
      </p>
    </div>
  );
};

// Компонент для вводу даних користувача
const UserFields = ({ username, setUsername, email, setEmail, homepage, setHomepage }) => {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{
          padding: "10px",
          borderRadius: "25px",
          border: "1px solid #ddd",
          width: "calc(33% - 10px)",  // Щоб рівномірно розподілялось
        }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{
          padding: "10px",
          borderRadius: "25px",
          border: "1px solid #ddd",
          width: "calc(33% - 10px)",  // Щоб рівномірно розподілялось
        }}
      />
      <input
        type="url"
        value={homepage}
        onChange={(e) => setHomepage(e.target.value)}
        placeholder="Homepage"
        style={{
          padding: "10px",
          borderRadius: "25px",
          border: "1px solid #ddd",
          width: "calc(33% - 10px)",  // Щоб рівномірно розподілялось
        }}
      />
    </div>
  );
};

// Компонент для відображення реплай
const ReplyInput = ({ parentId, onReply }) => {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [homepage, setHomepage] = useState("");

  const handleReply = () => {
    if (text.trim()) {
      onReply({ text, username, email, homepage, parentId });  // Викликає функцію для відповіді
      setText("");  // Очищаємо поле
      setUsername("");  // Очищаємо поле username
      setEmail("");  // Очищаємо поле email
      setHomepage("");  // Очищаємо поле homepage
    }
  };

  return (
    <div style={{ marginTop: "5px", width: "100%", maxWidth: "600px" }}>
      {/* Поля для введення даних користувача */}
      <UserFields 
        username={username} 
        setUsername={setUsername}
        email={email} 
        setEmail={setEmail}
        homepage={homepage} 
        setHomepage={setHomepage} 
      />

      {/* Поле для відповіді */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишіть відповідь..."
        style={{
          width: "100%", // Ширина 100% у межах контейнера
          maxWidth: "600px", // Максимальна ширина, як у коментаря
          padding: "10px",
          borderRadius: "25px",
          border: "1px solid #ddd",
          marginBottom: "10px",
          minHeight: "50px",
          resize: "none",  // Забороняє змінювати розмір поля
        }}
      />
      <button
        onClick={handleReply}
        style={{
          width: "100%",  // Тепер кнопка буде такої ж ширини, як і поле вводу
          maxWidth: "600px",  // Максимальна ширина, як у коментаря
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "25px",  // Округлені кути
          cursor: "pointer",
          marginTop: "10px",  // Відступ зверху
        }}
      >
        Відповісти
      </button>
    </div>
  );
};

// Рекурсивний компонент для відображення дерева коментарів
const CommentTree = ({ comment, level = 0, onReply }) => {
  return (
    <div
      style={{
        marginLeft: `${level * 30}px`,
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",  // Максимальна ширина коментаря
          backgroundColor: "#f9f9f9",  // Світло-сірий фон
          
        }}
      >
        {/* Відображаємо дані про автора */}
        <CommentAuthor author={comment.author} anonymousAuthor={comment.anonymousAuthor} />
        
        {/* Відображаємо деталі коментаря */}
        <CommentDetails comment={comment} />
      </div>

      {/* Форма для відповіді */}
      <div
        style={{
          width: "100%",  // Ширина 100% у межах контейнера
          maxWidth: "600px",  // Максимальна ширина, як у коментаря
        }}
      >
        <ReplyInput parentId={comment.id} onReply={onReply} />
      </div>

      {/* Підкоментарі */}
      {comment.children && comment.children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {comment.children.map((child) => (
            <CommentTree key={child.id} comment={child} level={level + 1} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = observer(() => {
  const { comment } = useContext(ctx);

  useEffect(() => {
    comment.fetchComments(); // Отримуємо всі коментарі
  }, [comment]);

  if (comment.isLoading) {
    return <div>Loading...</div>;
  }

  const commentTree = buildCommentTree(comment.comments); // Побудова дерева коментарів

  // Функція для додавання відповіді
  const handleReply = ({ text, username, email, homepage, parentId }) => {
    // Тут має бути логіка для додавання нового коментаря (виклик API або інший механізм)
    console.log(`Відповідь на коментар з ID: ${parentId}, текст: ${text}`);
    console.log(`Username: ${username}, Email: ${email}, Homepage: ${homepage}`);
    // Ви можете додавати коментарі в state або одразу відправляти їх на сервер
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>Коментарі</h2>
      <div>
        {commentTree.map((comment) => (
          <CommentTree key={comment.id} comment={comment} onReply={handleReply} />
        ))}
      </div>
    </div>
  );
});

export default Comments;
