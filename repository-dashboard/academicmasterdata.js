
document.addEventListener("DOMContentLoaded", () => {
  const collegeCode = document.getElementById("collegeCode");
  const collegeName = document.getElementById("collegeName");
  const collegeBtn = document.getElementById("saveCollegeBtn");
  const collegeTable = document.getElementById("collegeTableBody");

  const courseCode = document.getElementById("courseCode");
  const courseName = document.getElementById("courseName");
  const courseBtn = document.getElementById("saveCourseBtn");
  const courseTable = document.getElementById("courseTable");

  // Modal Elements
  const editModal = document.getElementById("editModal");
  const editCode = document.getElementById("editCode");
  const editName = document.getElementById("editName");
  const saveEdit = document.getElementById("saveEdit");
  const cancelEdit = document.getElementById("cancelEdit");

  let editingRow = null; // Row being edited

  // Date format
  function getCurrentDate() {
    const d = new Date();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }

  // Add new row
  function addRow(table, code, name) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${code}</td>
      <td>${name}</td>
      <td>${getCurrentDate()}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    // Edit Button → Open Modal
    tr.querySelector(".edit-btn").addEventListener("click", () => {
      editingRow = tr;
      editCode.value = tr.cells[0].textContent;
      editName.value = tr.cells[1].textContent;
      editModal.style.display = "flex";
    });

    // Delete Button
    tr.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this entry?")) {
        tr.remove();
      }
    });

    table.appendChild(tr);
  }

  // Save Edit
  saveEdit.addEventListener("click", () => {
    if (editingRow && editCode.value && editName.value) {
      editingRow.cells[0].textContent = editCode.value;
      editingRow.cells[1].textContent = editName.value;
      closeModal();
    }
  });

  // Cancel Edit
  cancelEdit.addEventListener("click", closeModal);

  function closeModal() {
    editModal.style.display = "none";
    editingRow = null;
  }

  // Add College
  collegeBtn.addEventListener("click", () => {
    if (collegeCode.value && collegeName.value) {
      addRow(collegeTable, collegeCode.value, collegeName.value);
      collegeCode.value = "";
      collegeName.value = "";
    }
  });

  // Add Course
  courseBtn.addEventListener("click", () => {
    if (courseCode.value && courseName.value) {
      addRow(courseTable, courseCode.value, courseName.value);
      courseCode.value = "";
      courseName.value = "";
    }
  });
});
