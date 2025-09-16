document.addEventListener("DOMContentLoaded", () => {
  // Fake thesis/document database
  const materials = {
    "10": {
      type: "Thesis",
      title: "Machine Learning in Healthcare",
      user: "Alice Cruz (BSIT 4th Year)",
      desc: "A thesis on predictive analysis for healthcare data.",
      date: "2025-09-01",
      file: "files/thesis-health.pdf",
      thumb: "assets/thesis.png"
    },
    "11": {
      type: "Document",
      title: "Library Research Guide",
      user: "Librarian Staff",
      desc: "Guidelines on how to conduct academic research.",
      date: "2025-08-28",
      file: "files/library-guide.pdf",
      thumb: "assets/document.png"
    }
  };

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id && materials[id]) {
    const mat = materials[id];
    document.getElementById("material-title").textContent = mat.title;
    document.getElementById("material-type").textContent = mat.type;
    document.getElementById("material-user").textContent = mat.user;
    document.getElementById("material-desc").textContent = mat.desc;
    document.getElementById("material-date").textContent = mat.date;
    document.getElementById("material-file").href = mat.file;
    document.getElementById("material-thumb").src = mat.thumb;
  } else {
    document.querySelector(".material-details").innerHTML = "<p>❌ Material not found.</p>";
    document.querySelector(".borrow-actions").style.display = "none";
  }

  // Borrow button click
  document.getElementById("borrowBtn").addEventListener("click", () => {
    // For now just simulate success (later you will connect to PHP + MySQL)
    document.getElementById("borrowStatus").textContent =
      "✅ Successfully requested borrowing! Please wait for librarian approval.";
    document.getElementById("borrowBtn").disabled = true;
  });
});
