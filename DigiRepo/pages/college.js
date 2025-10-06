  const searchCollege = document.getElementById("searchCollege");
  const collegeRows = document.querySelectorAll("#collegeTable tbody tr");

  searchCollege.addEventListener("input", () => {
    const search = searchCollege.value.toLowerCase();
    collegeRows.forEach(row => {
      const matches = row.dataset.id.includes(search) || row.dataset.name.includes(search);
      row.style.display = matches ? "" : "none";
    });
  });

  document.querySelectorAll("#collegeTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });