document.addEventListener("DOMContentLoaded", () => {
  // Fake database (replace with PHP+MySQL later)
  const materials = {
    "1": {
      type: "Thesis",
      title: "AI in Education",
      user: "John Doe (BSCS 4th Year)",
      desc: "A study on AI tutoring systems.",
      date: "2025-09-05",
      file: "files/thesis-ai.pdf",
      thumb: "assets/thesis.png"
    },
    "2": {
      type: "Video",
      title: "Data Structures Lecture",
      user: "Jane Smith (Faculty)",
      desc: "Lecture on linked lists and trees.",
      date: "2025-09-04",
      file: "files/data-structures.mp4",
      thumb: "assets/video.png"
    }
  };

  // Get URL parameters (id)
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
  }
});
