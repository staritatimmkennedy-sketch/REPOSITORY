document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("customModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("modalCancel");
  const confirmBtn = document.getElementById("modalConfirm");

  if (!modal) return; // safety check

  // Attach click event to all action buttons
  document.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const row = btn.closest("tr");
      const id = row?.querySelector("td:first-child")?.textContent;
      const title = row?.querySelector("td:nth-child(2)")?.textContent;

      modal.style.display = "flex";
      modalTitle.textContent = action.charAt(0).toUpperCase() + action.slice(1);

      // Change modal content depending on action
      switch (action) {
        case "view":
          modalBody.innerHTML = `
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p>Viewing details…</p>`;
          break;
        case "edit":
          modalBody.innerHTML = `
            <label>Title: <input type="text" value="${title}"></label>`;
          break;
        case "review":
          modalBody.innerHTML = `<p>Review submission <strong>${id}</strong></p>`;
          break;
        case "comment":
          modalBody.innerHTML = `<textarea rows="4" style="width:100%" placeholder="Write comment..."></textarea>`;
          break;
        case "publish":
          modalBody.innerHTML = `<p>Publish <strong>${title}</strong>?</p>`;
          break;
        case "approve":
          modalBody.innerHTML = `<p>Approve <strong>${title}</strong>?</p>`;
          break;
        default:
          modalBody.innerHTML = `<p>Action: ${action}</p>`;
      }
    });
  });

  // Close modal
  closeModal.addEventListener("click", () => modal.style.display = "none");
  cancelBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Confirm button (example only)
  confirmBtn.addEventListener("click", () => {
    alert(`✅ Confirmed: ${modalTitle.textContent}`);
    modal.style.display = "none";
  });
});
