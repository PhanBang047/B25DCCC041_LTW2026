
import { useState } from "react";
const getRank = (score) => {
  if (score >= 8) return "Giỏi";
  if (score >= 6.5) return "Khá";
  if (score >= 5) return "Yếu";
  return "Trượt môn";
};
 
// hiển thị sv 
const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{className}</td>
      <td>{getRank(score)}</td>
      <td>
        <button className="btn-del" onClick={() => onDelete(id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <p className="empty">Không có sinh viên nào.</p>;
  }
  return (
    <table>
      <thead>
        <tr>
  <th>ID</th>
  <th>Họ tên</th>
  <th>Điểm</th>
  <th>Lớp</th>
  <th>Trạng thái</th>
  <th>Thao tác</th>

        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <StudentItem key={s.id} student={s} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};
 
// com quản lí state 
const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Lương Văn Dương", score: 8.5, class: "CNTT1" },
    { id: 2, name: "Ngô Tuấn Cường", score: 4.5, class: "CNTT2" },
    { id: 3, name: "Phạm Quang Duy", score: 6.5, class: "CNTT1" },
  ]);
  const [filter, setFilter] = useState("all"); // all | good | fail
  const [form, setForm] = useState({ name: "", score: "", class: "" });
  const [error, setError] = useState("");
 
  const { name, score, class: className } = form;
 
  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
 
  const handleAdd = (e) => {
    e.preventDefault();
    const scoreNum = Number(String(score).replace(",", "."));
 
    if (!name.trim() || !String(score).trim() || !className.trim()) {
      setError("Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp!");
      return;
    }
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số phải nằm trong khoảng từ 0 đến 10!");
      return;
    }
 
    const newId = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const newStudent = {
      id: newId,
      name: name.trim(),
      score: scoreNum,
      class: className.trim(),
    };
 
    // giữ dl thêm sv 
    setStudents((prev) => [...prev, newStudent]);
    setForm({ name: "", score: "", class: "" });
    setError("");
  };
 
  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };
 
  // lọc ds 
  const displayed = students.filter((s) => {
    if (filter === "good") return s.score >= 8;
    if (filter === "fail") return s.score < 5;
    return true;
  });
 
  // tk lớp
  const total = students.length;
  const average =
    total === 0 ? 0 : students.reduce((sum, s) => sum + s.score, 0) / total;
 
  return (
    <div className="container">
      <style>{css}</style>
      <h1>Quản lý Điểm Sinh viên</h1>
 
      <form onSubmit={handleAdd} className="form" noValidate>
        <input
          name="name"
          placeholder="Họ tên"
          value={name}
          onChange={handleChange}
        />
        <input
          name="score"
          type="text"
          inputMode="decimal"
          placeholder="Điểm số"
          value={score}
          onChange={handleChange}
        />
        <input
          name="class"
          placeholder="Lớp"
          value={className}
          onChange={handleChange}
        />
        <button type="submit" className="btn-add">
          Thêm
        </button>
      </form>
      {error && <p className="error">{error}</p>}
 
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={filter === "good" ? "active" : ""}
          onClick={() => setFilter("good")}
        >
          Loại Giỏi (≥ 8)
        </button>
        <button
          className={filter === "fail" ? "active" : ""}
          onClick={() => setFilter("fail")}
        >
          Trượt môn (&lt; 5)
        </button>
      </div>
 
      <StudentList students={displayed} onDelete={handleDelete} />
 
      <div className="stats">
        <span>{`Tổng số sinh viên: ${total}`}</span>
        <span>{`Điểm trung bình lớp: ${average.toFixed(2)}`}</span>
      </div>
    </div>
  );
};
const css = `
button { border: 1px solid black; padding: 6px 12px; cursor: pointer; }
input { border: 1px solid black; padding: 6px; }
table { border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid black; padding: 6px; }
.error { color: red; }
.active { background: lightgray; }
`;
export default App;
 
