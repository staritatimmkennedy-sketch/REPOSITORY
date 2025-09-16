document.addEventListener("DOMContentLoaded", () => {
    // --- USER SECTION ---
    const addUserBtn = document.getElementById("addUserBtn");
    const userModal = document.getElementById("userModal");
    const modalTitle = document.getElementById("modalTitle");
    const saveUserBtn = document.getElementById("saveUserBtn");
    const cancelUserBtn = document.getElementById("cancelUserBtn");
    const userTable = document.getElementById("userTable").getElementsByTagName("tbody")[0];
    const searchInput = document.getElementById("searchInput");

    let editRow = null;

    addUserBtn.addEventListener("click", () => {
      modalTitle.innerText = "Add User";
      clearModalFields();
      editRow = null;
      userModal.style.display = "flex";
    });

    cancelUserBtn.addEventListener("click", () => {
      userModal.style.display = "none";
    });

    saveUserBtn.addEventListener("click", () => {
      const userData = getModalData();

      if (!userData.userId || !userData.firstName || !userData.lastName || !userData.username) {
        alert("Please fill out required fields");
        return;
      }

      if (editRow) {
        updateRow(editRow, userData);
      } else {
        addNewRow(userData);
      }

      userModal.style.display = "none";
    });

    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      const rows = userTable.getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) {
          if (cells[j] && cells[j].innerText.toLowerCase().includes(filter)) {
            match = true;
            break;
          }
        }

        rows[i].style.display = match ? "" : "none";
      }
    });

    function getModalData() {
      return {
        userId: document.getElementById("userId").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        middleName: document.getElementById("middleName").value,
        username: document.getElementById("username").value,
        userRole: document.getElementById("userRole").value,
        college: document.getElementById("college").value,
        course: document.getElementById("course").value,
        yearLevel: document.getElementById("yearLevel").value
      };
    }

    function clearModalFields() {
      document.querySelectorAll("#userModal input").forEach(input => input.value = "");
    }

    function addNewRow(data) {
      const newRow = userTable.insertRow();
      fillRow(newRow, data);
    }

    function updateRow(row, data) {
      fillRow(row, data);
    }

    function fillRow(row, data) {
      row.innerHTML = `
        <td>${data.userId}</td>
        <td>${data.firstName}</td>
        <td>${data.lastName}</td>
        <td>${data.middleName}</td>
        <td>${data.username}</td>
        <td>${data.userRole}</td>
        <td>${data.college}</td>
        <td>${data.course}</td>
        <td>${data.yearLevel}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      row.querySelector(".edit-btn").addEventListener("click", () => editUser(row));
      row.querySelector(".delete-btn").addEventListener("click", () => row.remove());
    }

    function editUser(row) {
      editRow = row;
      modalTitle.innerText = "Edit User";

      const cells = row.getElementsByTagName("td");
      document.getElementById("userId").value = cells[0].innerText;
      document.getElementById("firstName").value = cells[1].innerText;
      document.getElementById("lastName").value = cells[2].innerText;
      document.getElementById("middleName").value = cells[3].innerText;
      document.getElementById("username").value = cells[4].innerText;
      document.getElementById("userRole").value = cells[5].innerText;
      document.getElementById("college").value = cells[6].innerText;
      document.getElementById("course").value = cells[7].innerText;
      document.getElementById("yearLevel").value = cells[8].innerText;

      userModal.style.display = "flex";
    }

    document.querySelectorAll("#userTable .edit-btn").forEach(btn => btn.addEventListener("click", () => editUser(btn.closest("tr"))));
    document.querySelectorAll("#userTable .delete-btn").forEach(btn => btn.addEventListener("click", () => btn.closest("tr").remove()));

    // --- ROLE SECTION ---
    const addRoleBtn = document.getElementById("addRoleBtn");
    const roleModal = document.getElementById("roleModal");
    const roleModalTitle = document.getElementById("roleModalTitle");
    const saveRoleBtn = document.getElementById("saveRoleBtn");
    const cancelRoleBtn = document.getElementById("cancelRoleBtn");
    const roleTable = document.getElementById("roleTable").getElementsByTagName("tbody")[0];
    const roleSearchInput = document.getElementById("roleSearchInput");

    let editRoleRow = null;

    addRoleBtn.addEventListener("click", () => {
      roleModalTitle.innerText = "Add Role";
      clearRoleModalFields();
      editRoleRow = null;
      roleModal.style.display = "flex";
    });

    cancelRoleBtn.addEventListener("click", () => {
      roleModal.style.display = "none";
    });

    saveRoleBtn.addEventListener("click", () => {
      const roleData = getRoleModalData();

      if (!roleData.roleId || !roleData.roleName) {
        alert("Please fill out required fields");
        return;
      }

      if (editRoleRow) {
        updateRoleRow(editRoleRow, roleData);
      } else {
        addNewRoleRow(roleData);
      }

      roleModal.style.display = "none";
    });

    roleSearchInput.addEventListener("keyup", () => {
      const filter = roleSearchInput.value.toLowerCase();
      const rows = roleTable.getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        let match = false;

        for (let j = 0; j < cells.length - 1; j++) {
          if (cells[j] && cells[j].innerText.toLowerCase().includes(filter)) {
            match = true;
            break;
          }
        }

        rows[i].style.display = match ? "" : "none";
      }
    });

    function getRoleModalData() {
      return {
        roleId: document.getElementById("roleId").value,
        roleName: document.getElementById("roleName").value,
        roleDescription: document.getElementById("roleDescription").value
      };
    }

    function clearRoleModalFields() {
      document.querySelectorAll("#roleModal input").forEach(input => input.value = "");
    }

    function addNewRoleRow(data) {
      const newRow = roleTable.insertRow();
      fillRoleRow(newRow, data);
    }

    function updateRoleRow(row, data) {
      fillRoleRow(row, data);
    }

    function fillRoleRow(row, data) {
      row.innerHTML = `
        <td>${data.roleId}</td>
        <td>${data.roleName}</td>
        <td>${data.roleDescription}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      row.querySelector(".edit-btn").addEventListener("click", () => editRole(row));
      row.querySelector(".delete-btn").addEventListener("click", () => row.remove());
    }

    function editRole(row) {
      editRoleRow = row;
      roleModalTitle.innerText = "Edit Role";

      const cells = row.getElementsByTagName("td");
      document.getElementById("roleId").value = cells[0].innerText;
      document.getElementById("roleName").value = cells[1].innerText;
      document.getElementById("roleDescription").value = cells[2].innerText;

      roleModal.style.display = "flex";
    }

    document.querySelectorAll("#roleTable .edit-btn").forEach(btn => btn.addEventListener("click", () => editRole(btn.closest("tr"))));
    document.querySelectorAll("#roleTable .delete-btn").forEach(btn => btn.addEventListener("click", () => btn.closest("tr").remove()));

    // --- TAB SWITCHING ---
    const allSections = document.querySelectorAll(".section");

    function showOnlySection(hash) {
      // hash is "#user" or "#role"
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
      window.location.hash = "#user";
      showOnlySection("#user");
    }
});   