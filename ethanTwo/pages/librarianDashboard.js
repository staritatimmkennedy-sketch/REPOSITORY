document.addEventListener("DOMContentLoaded", function() {
  fetch("librarianDashboard.php")
    .then(response => response.json())
    .then(data => {
      document.getElementById("totalPublished").textContent = data.totalPublished;
      document.getElementById("totalRequests").textContent = data.totalRequests;
      document.getElementById("totalApproved").textContent = data.totalApproved;

      const tbody = document.querySelector("#borrowTable tbody");
      tbody.innerHTML = "";
      data.borrows.forEach(borrow => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${borrow.studentName}</td>
          <td>${borrow.material}</td>
          <td>${borrow.status}</td>
          <td>${borrow.dateRequested}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => console.error("Error loading dashboard:", error));
});
