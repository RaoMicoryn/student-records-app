import React, { useState } from "react";

const initialStudents = [
  { id: 1, name: "Andi", class: "XI RPL 1", score: 85 },
  { id: 2, name: "Budi", class: "XI RPL 1", score: 90 },
  { id: 3, name: "Citra", class: "XI RPL 2", score: 88 },
];

function StudentForm({ initialValues, onCancel, onSubmit, submitLabel }) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [studentClass, setStudentClass] = useState(initialValues?.class ?? "");
  const [score, setScore] = useState(initialValues?.score ?? "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !studentClass.trim() || score === "") {
      setError("Please fill in every field.");
      return;
    }
    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      setError("Score must be a number between 0 and 100.");
      return;
    }
    onSubmit({ name: name.trim(), class: studentClass.trim(), score: numericScore });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#3a3a36" }}>
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dewi"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#3a3a36" }}>
          Class
        </label>
        <input
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          placeholder="e.g. XI RPL 1"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#3a3a36" }}>
          Score
        </label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="e.g. 85"
          style={inputStyle}
        />
      </div>
      {error && <p style={{ color: "#b3441e", fontSize: 13, margin: 0 }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
        <button onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
        <button onClick={handleSubmit} style={primaryBtnStyle}>{submitLabel}</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #d8d5c9",
  fontSize: 14,
  outline: "none",
};

const primaryBtnStyle = {
  background: "#d99a3a",
  color: "#3a2a10",
  border: "none",
  borderRadius: 6,
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const cancelBtnStyle = {
  background: "#fff",
  color: "#3a3a36",
  border: "1px solid #d8d5c9",
  borderRadius: 6,
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

function Modal({ title, subtitle, children, onClose }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(30,30,25,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "24px 28px",
          width: 340,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "#2c2c28" }}>{title}</h2>
        <p style={{ margin: "0 0 18px", fontSize: 13, color: "#7a7a72" }}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function DeleteConfirm({ student, onCancel, onConfirm }) {
  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        background: "#2c2c28",
        color: "#fff",
        borderRadius: 8,
        padding: "12px 14px",
        width: 230,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        zIndex: 30,
      }}
    >
      <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.4 }}>
        Remove <strong>{student.name}</strong> from the records? This can't be undone.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={onCancel}
          style={{ background: "transparent", border: "1px solid #565650", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{ background: "#c14b3a", border: "none", color: "#fff", borderRadius: 6, padding: "5px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function StudentRecords() {
  const [students, setStudents] = useState(initialStudents);
  const [modalMode, setModalMode] = useState(null); // null | "add" | "edit"
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  const studentCount = students.length;
  const classCount = new Set(students.map((s) => s.class)).size;
  const avgScore = studentCount
    ? (students.reduce((sum, s) => sum + s.score, 0) / studentCount).toFixed(1)
    : "0.0";

  const handleAdd = (values) => {
    const newId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    setStudents((prev) => [...prev, { id: newId, ...values }]);
    setModalMode(null);
  };

  const handleEdit = (values) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === editingStudent.id ? { ...s, ...values } : s))
    );
    setModalMode(null);
    setEditingStudent(null);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmingDeleteId(null);
  };

  return (
    <div style={{ background: "#eceadf", minHeight: 500, padding: 32, fontFamily: "system-ui, sans-serif", position: "relative" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#f4f2e9", borderRadius: 14, padding: 28, position: "relative" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: "#2c2c28" }}>Student records</h1>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "#7a7a72" }}>
          Add, edit, or remove students from the class list. This is what your finished app should do.
        </p>

        <button onClick={() => setModalMode("add")} style={{ ...primaryBtnStyle, padding: "10px 18px", marginBottom: 22 }}>
          + Add student
        </button>

        <div style={{ display: "flex", gap: 16, marginBottom: 22 }}>
          <StatCard value={studentCount} label="Students" />
          <StatCard value={classCount} label="Classes" />
          <StatCard value={avgScore} label="Average score" />
        </div>

        <div style={{ background: "#fff", borderRadius: 10, overflow: "visible" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eceadf", color: "#7a7a72", textAlign: "left" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Class</th>
                <th style={thStyle}>Score</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1efe6", position: "relative" }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#2c2c28" }}>{s.name}</td>
                  <td style={tdStyle}>{s.class}</td>
                  <td style={tdStyle}>
                    <span style={{ background: "#e3f0e5", color: "#2f6b3a", borderRadius: 6, padding: "2px 10px", fontWeight: 600 }}>
                      {s.score}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", position: "relative" }}>
                    <button
                      onClick={() => {
                        setEditingStudent(s);
                        setModalMode("edit");
                      }}
                      style={linkBtnStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(s.id)}
                      style={{ ...linkBtnStyle, color: "#c14b3a", marginLeft: 14 }}
                    >
                      Delete
                    </button>
                    {confirmingDeleteId === s.id && (
                      <DeleteConfirm
                        student={s}
                        onCancel={() => setConfirmingDeleteId(null)}
                        onConfirm={() => handleDelete(s.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "#a3a297" }}>
                    No students yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalMode === "add" && (
        <Modal title="Add student" subtitle="Fill in the student's details below." onClose={() => setModalMode(null)}>
          <StudentForm onCancel={() => setModalMode(null)} onSubmit={handleAdd} submitLabel="Add student" />
        </Modal>
      )}

      {modalMode === "edit" && editingStudent && (
        <Modal title="Edit student" subtitle={`Update ${editingStudent.name}'s details.`} onClose={() => setModalMode(null)}>
          <StudentForm
            initialValues={editingStudent}
            onCancel={() => setModalMode(null)}
            onSubmit={handleEdit}
            submitLabel="Save changes"
          />
        </Modal>
      )}
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#2c2c28" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#7a7a72" }}>{label}</div>
    </div>
  );
}

const thStyle = { padding: "10px 16px", fontWeight: 600, fontSize: 13 };
const tdStyle = { padding: "12px 16px", color: "#4a4a44" };
const linkBtnStyle = {
  background: "none",
  border: "none",
  color: "#c9822f",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  padding: 0,
};
