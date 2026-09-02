# Student records

A small React CRUD app (Create, Read, Update, Delete) for managing student records — built for the Student Management System assignment.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Notes

`src/App.jsx` holds all the CRUD logic:
- **Create** — the "Add student" modal appends a new object to state.
- **Read** — the table renders straight from the `students` array.
- **Update** — "Edit" pre-fills the same form and replaces the matching item by `id`.
- **Delete** — "Delete" shows a confirm popup before filtering the item out of state.

It uses plain React + inline styles rather than the `antd` package. To use real Ant Design components instead, run:

```bash
npm install antd
```

and swap the hand-built `<table>`, `Modal`, and confirm popup for antd's `Table`, `Form`, `Modal`, and `Popconfirm`.
