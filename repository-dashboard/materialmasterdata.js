document.addEventListener("DOMContentLoaded", () => {
  const materialForm = document.getElementById("materialForm");
  const materialTableBody = document.querySelector("#materialTable tbody");
  const materialEmpty = document.getElementById("materialEmpty");

  const editModal = document.getElementById("editMaterialModal");
  const editType = document.getElementById("editMaterialType");
  const editName = document.getElementById("editMaterialName");
  const editDescription = document.getElementById("editMaterialDescription");
  const editFile = document.getElementById("editMaterialFile");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  let materials = [];
  let editIndex = null; // track which row is being edited

  function renderMaterialTable() {
    materialTableBody.innerHTML = "";

    if (materials.length === 0) {
      materialEmpty.style.display = "block";
      return;
    } else {
      materialEmpty.style.display = "none";
    }

    materials.forEach((mat, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>M-${index + 1}</td>
        <td>${mat.type}</td>
        <td>${mat.name}</td>
        <td>${mat.description || "-"}</td>
        <td>${mat.fileName || "-"}</td>
        <td>${mat.date}</td>
        <td class="col-actions">
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      materialTableBody.appendChild(row);
    });

    // Delete functionality
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.index;
        materials.splice(idx, 1);
        renderMaterialTable();
      });
    });

    // EDIT functionality - OPEN modal
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        editIndex = btn.dataset.index;
        const mat = materials[editIndex];

        // Pre-fill modal fields
        editType.value = [...editType.options].find(opt => opt.text === mat.type)?.value || "";
        editName.value = mat.name;
        editDescription.value = mat.description;
        editFile.value = ""; // file inputs can't be set programmatically

        // Show modal
        editModal.style.display = "flex";
      });
    });
  }

  // Save edited material
  saveEditBtn.addEventListener("click", () => {
    if (editIndex !== null) {
      const typeText = editType.options[editType.selectedIndex].text;
      const name = editName.value.trim();
      const description = editDescription.value.trim();
      const file = editFile.files[0];

      if (!editType.value || !name) {
        alert("Please select a material type and enter a name.");
        return;
      }

      materials[editIndex] = {
        type: typeText,
        name,
        description,
        fileName: file ? file.name : materials[editIndex].fileName,
        date: materials[editIndex].date
      };

      editModal.style.display = "none";
      editIndex = null;
      renderMaterialTable();
    }
  });

  // Cancel editing
  cancelEditBtn.addEventListener("click", () => {
    editModal.style.display = "none";
    editIndex = null;
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.style.display = "none";
      editIndex = null;
    }
  });

  // Add new material
  document.getElementById("saveMaterialBtn").addEventListener("click", () => {
    const typeSelect = document.getElementById("materialType");
    const nameInput = document.getElementById("materialName");
    const descriptionInput = document.getElementById("materialDescription");
    const fileInput = document.getElementById("materialFile");

    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const file = fileInput.files[0];

    if (!typeSelect.value || !name) {
      alert("Please select a material type and enter a name.");
      return;
    }

    const newMaterial = {
      type: typeText,
      name,
      description,
      fileName: file ? file.name : "",
      date: new Date().toLocaleDateString()
    };

    materials.push(newMaterial);

    // Reset form
    materialForm.reset();

    // Re-render table
    renderMaterialTable();
  });

  // Initial render
  renderMaterialTable();
});





document.addEventListener("DOMContentLoaded", () => {
  // ===== Material Type Section =====
  const materialTypeForm = document.getElementById("materialTypeForm");
  const materialTypeTable = document.getElementById("materialTypeTable").querySelector("tbody");
  const saveMaterialTypeBtn = document.getElementById("saveMaterialTypeBtn");

  const editMaterialTypeModal = document.getElementById("editMaterialTypeModal");
  const editMaterialTypeName = document.getElementById("editMaterialTypeName");
  const saveMaterialTypeEditBtn = document.getElementById("saveMaterialTypeEditBtn");
  const cancelMaterialTypeEditBtn = document.getElementById("cancelMaterialTypeEditBtn");

  let editRow = null; // Row being edited

  // ===== Add Material Type =====
  saveMaterialTypeBtn.addEventListener("click", () => {
    const name = document.getElementById("materialTypeName").value.trim();
    if (!name) return alert("Please enter a Material Type Name");

    const newRow = document.createElement("tr");
    const code = "MT" + (materialTypeTable.rows.length + 1).toString().padStart(3, "0");
    const dateAdded = new Date().toLocaleDateString();

    newRow.innerHTML = `
      <td>${code}</td>
      <td>${name}</td>
      <td>${dateAdded}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    materialTypeTable.appendChild(newRow);
    materialTypeForm.reset();
    toggleEmptyState();
  });

  // ===== Table Actions (Edit/Delete) =====
  materialTypeTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      editRow = e.target.closest("tr");
      editMaterialTypeName.value = editRow.cells[1].textContent;
      editMaterialTypeModal.style.display = "flex";
    }

    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this material type?")) {
        e.target.closest("tr").remove();
        toggleEmptyState();
      }
    }
  });

  // ===== Save Edited Material Type =====
  saveMaterialTypeEditBtn.addEventListener("click", () => {
    if (!editRow) return;
    const newName = editMaterialTypeName.value.trim();
    if (!newName) return alert("Please enter a new Material Type Name");

    editRow.cells[1].textContent = newName;
    editMaterialTypeModal.style.display = "none";
    editRow = null;
  });

  // ===== Cancel Edit =====
  cancelMaterialTypeEditBtn.addEventListener("click", () => {
    editMaterialTypeModal.style.display = "none";
    editRow = null;
  });

  // ===== Empty State =====
  function toggleEmptyState() {
    const emptyState = document.querySelector('[data-empty="materialtype"]');
    emptyState.hidden = materialTypeTable.rows.length > 0;
  }

  toggleEmptyState();
});
