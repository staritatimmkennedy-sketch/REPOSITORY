// pages/logs.js - Filtering (NO IP)
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchLogs");
    const actionFilter = document.getElementById("actionFilter");
    const dateFilter = document.getElementById("dateFilter");
    const clearBtn = document.getElementById("clearFilters");
    const rows = document.querySelectorAll("#auditTable tbody tr");

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function filterRows() {
        const search = searchInput.value.trim().toLowerCase();
        const action = actionFilter.value.toLowerCase();
        const date = dateFilter.value;

        let visible = 0;
        let noResultsRow = document.getElementById("noResultsRow");

        rows.forEach(row => {
            if (row.id === "noResultsRow") return;

            const data = {
                search: (row.dataset.search || "").toLowerCase(),
                action: (row.dataset.action || "").toLowerCase(),
                date: row.dataset.date || ""
            };

            const matches = 
                (!search || data.search.includes(search)) &&
                (!action || data.action === action) &&
                (!date || data.date === date);

            row.style.display = matches ? "" : "none";
            if (matches) visible++;
        });

        if (visible === 0 && !noResultsRow) {
            const tbody = document.querySelector("#auditTable tbody");
            const tr = document.createElement("tr");
            tr.id = "noResultsRow";
            tr.innerHTML = `<td colspan="5" class="px-4 py-8 text-center text-gray-500 italic">No logs match your filters.</td>`;
            tbody.appendChild(tr);
        } else if (visible > 0 && noResultsRow) {
            noResultsRow.remove();
        }
    }

    const debouncedFilter = debounce(filterRows, 300);

    searchInput.addEventListener("input", debouncedFilter);
    actionFilter.addEventListener("change", filterRows);
    dateFilter.addEventListener("change", filterRows);
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        actionFilter.value = "";
        dateFilter.value = "";
        filterRows();
    });

    filterRows();
    
});