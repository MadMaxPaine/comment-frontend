import { useContext, useEffect, useState } from "react";
import { ctx } from "../store/Context";
import {
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import CommentItem from "../components/Comment/CommentItem";
import  Reply  from "../components/Reply/Reply";

const LoadComments = observer(() => {
  const { comment } = useContext(ctx);
  const [sortOption, setSortOption] = useState("createdAt-asc"); // Один селект
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    const [sortBy, sortOrder] = sortOption.split("-");
    comment.fetchComments(comment.page, sortBy, sortOrder);
  }, [sortOption, comment.page]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  if (comment.isLoading) {
    return <CircularProgress />;
  }
  /*
  if (comment.error) {
    return <div>{Не вдалося завантажити коментарі: ${comment.error}}</div>;
  }

  if (!comment.comments || comment.comments.length === 0) {
    return <div>Немає коментарів для відображення.</div>;
  }
*/
  return (
    <div>
      <FormControl sx={{ m: 2 }}>
        <InputLabel id="sort-label">Сортувати</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          value={sortOption}
          label="Сортувати"
          onChange={handleSortChange}
        >
          <MenuItem value="createdAt-asc">Дата створення (зростання)</MenuItem>
          <MenuItem value="createdAt-desc">Дата створення (спадання)</MenuItem>
          <MenuItem value="username-asc">Автор (А-Я)</MenuItem>
          <MenuItem value="username-desc">Автор (Я-А)</MenuItem>
          <MenuItem value="email-asc">Email (А-Я)</MenuItem>
          <MenuItem value="email-desc">Email (Я-А)</MenuItem>
        </Select>
      </FormControl>
      {//<Reply parentId={null}/>
      }
      {comment.comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          activeCommentId={activeCommentId}
          setActiveCommentId={setActiveCommentId}
        />
      ))}
      
      {/* Пагінація */}
      {comment.totalPages && comment.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => comment.changePage(comment.page - 1)}
            disabled={comment.page <= 1}
          >
            Попередня
          </Button>
          <span style={{ margin: "0 20px" }}>
            Сторінка {comment.page} з {comment.totalPages}
          </span>
          <Button
            variant="contained"
            onClick={() => comment.changePage(comment.page + 1)}
            disabled={comment.page >= comment.totalPages}
          >
            Наступна
          </Button>
        </div>
      )}
    </div>
  );
});

export default LoadComments;
