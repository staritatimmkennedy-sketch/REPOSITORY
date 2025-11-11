let modalTimer = null;
function startModalTimeout() {
    clearTimeout(modalTimer);
    modalTimer = setTimeout(() => {
        $('#viewModal').addClass('hidden');
        $('#pdfContainer').empty();
        alert('Session timed out – PDF closed for security.');
    }, 30 * 60 * 1000); // 30 min
}
function resetModalTimeout() { startModalTimeout(); }