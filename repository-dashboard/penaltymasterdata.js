document.addEventListener("DOMContentLoaded", () => {
  const penaltyTable = document.getElementById("penaltyTable").querySelector("tbody");
  const addPenaltyBtn = document.getElementById("addPenaltyBtn");
  const penaltyModal = document.getElementById("penaltyModal");
  const savePenaltyBtn = document.getElementById("savePenaltyBtn");
  const cancelPenaltyBtn = document.getElementById("cancelPenaltyBtn");

  const penaltyNameInput = document.getElementById("penaltyNameInput");
  const penaltyAmountInput = document.getElementById("penaltyAmountInput");
  const perDayInput = document.getElementById("perDayInput");

  let editRow = null;

  // Show modal
  addPenaltyBtn.addEventListener("click", () => {
    penaltyModal.style.display = "flex";
    document.getElementById("penaltyModalTitle").textContent = "Add Penalty";
    penaltyNameInput.value = "";
    penaltyAmountInput.value = "";
    perDayInput.value = "";
    editRow = null;
  });

  // Save penalty
  savePenaltyBtn.addEventListener("click", () => {
    const name = penaltyNameInput.value.trim();
    const amount = penaltyAmountInput.value.trim();
    const perDay = perDayInput.value.trim() || "NULL";

    if (!name || !amount) {
      alert("Penalty Name and Amount are required!");
      return;
    }

    if (editRow) {
      // Update existing row
      editRow.cells[1].textContent = name;
      editRow.cells[2].textContent = amount;
      editRow.cells[3].textContent = perDay;
    } else {
      // Add new row
      const row = penaltyTable.insertRow();
      row.innerHTML = `
        <td>${penaltyTable.rows.length}</td>
        <td>${name}</td>
        <td>${amount}</td>
        <td>${perDay}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;
    }

    penaltyModal.style.display = "none";
  });

  // Cancel modal
  cancelPenaltyBtn.addEventListener("click", () => {
    penaltyModal.style.display = "none";
  });

  // Edit/Delete actions
  penaltyTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      editRow = e.target.closest("tr");
      penaltyNameInput.value = editRow.cells[1].textContent;
      penaltyAmountInput.value = editRow.cells[2].textContent;
      perDayInput.value = editRow.cells[3].textContent;
      document.getElementById("penaltyModalTitle").textContent = "Edit Penalty";
      penaltyModal.style.display = "flex";
    }

    if (e.target.classList.contains("delete-btn")) {
      e.target.closest("tr").remove();
    }
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === penaltyModal) {
      penaltyModal.style.display = "none";
    }
  });

  // --- TAB SWITCHING ---
  const allSections = document.querySelectorAll(".section");

  function showOnlySection(hash) {
    const id = hash.replace("#", "");
    allSections.forEach(sec => sec.classList.remove("is-active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("is-active");
  }

  window.addEventListener("hashchange", () => {
    showOnlySection(window.location.hash);
  });

  // Initial load
  if (window.location.hash) {
    showOnlySection(window.location.hash);
  } else {
    window.location.hash = "#penalty";
    showOnlySection("#penalty");
  }
});
