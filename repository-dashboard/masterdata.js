
  document.addEventListener("DOMContentLoaded", () => {
    const collegeCodeInput = document.getElementById("collegeCode");
    const collegeNameInput = document.getElementById("collegeName");
    const saveCollegeBtn = document.getElementById("saveCollegeBtn");
    const collegeTable = document.getElementById("collegeTable");
    const emptyMsg = document.querySelector("[data-empty='college']");

    // Update empty message visibility
    function checkEmptyState() {
      emptyMsg.hidden = collegeTable.children.length > 0;
    }

    // Add College
    saveCollegeBtn.addEventListener("click", () => {
      const collegeCode = collegeCodeInput.value.trim();
      const collegeName = collegeNameInput.value.trim();

      if (!collegeCode || !collegeName) {
        alert("Please fill in all fields.");
        return;
      }

      // Create new row
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${collegeCode}</td>
        <td>${collegeName}</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td class="col-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      // Add row to table
      collegeTable.appendChild(row);

      // Clear inputs
      collegeCodeInput.value = "";
      collegeNameInput.value = "";

      // Hide empty message if row added
      checkEmptyState();

      // Edit action
      row.querySelector(".edit-btn").addEventListener("click", () => {
        const newCode = prompt("Edit College Code:", row.cells[0].textContent);
        const newName = prompt("Edit College Name:", row.cells[1].textContent);
        if (newCode && newName) {
          row.cells[0].textContent = newCode;
          row.cells[1].textContent = newName;
        }
      });

      // Delete action
      row.querySelector(".delete-btn").addEventListener("click", () => {
        row.remove();
        checkEmptyState();
      });
    });

    // Initial empty check
    checkEmptyState();
  });

  





  //Auto generate MATERIAL CODE
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("materialForm");
  const tableBody = document.querySelector("#materialTable tbody");
  const emptyMsg = document.getElementById("materialEmpty");
  const addBtn = document.getElementById("saveMaterialBtn");

  let materialCounter = 1; // Auto code counter

  addBtn.addEventListener("click", () => {
    const name = document.getElementById("materialName").value.trim();
    if (!name) return alert("Please enter the material name!");

    // Auto-generate code and date
    const code = "MAT-" + String(materialCounter).padStart(3, "0");
    const date = new Date().toLocaleDateString();
    materialCounter++;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${code}</td>
      <td>${name}</td>
      <td>${date}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
    emptyMsg.style.display = "none";
    form.reset();

    // Delete Row
    row.querySelector(".delete-btn").addEventListener("click", () => {
      row.remove();
      if (!tableBody.children.length) emptyMsg.style.display = "block";
    });

    // Edit Row (keeps the same code & date)
    row.querySelector(".edit-btn").addEventListener("click", () => {
      document.getElementById("materialName").value = name;
      row.remove();
      if (!tableBody.children.length) emptyMsg.style.display = "block";
    });
  });
});



