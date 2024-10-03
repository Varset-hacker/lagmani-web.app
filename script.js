document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loading-screen');
    const tableSelection = document.getElementById('table-selection');
    const mainContent = document.getElementById('main-content');
    const confirmation = document.getElementById('confirmation');
    const selectedTableText = document.getElementById('selected-table-text');
    const selectTableButton = document.getElementById('select-table');
    const continueToMainButton = document.getElementById('continue-to-main');

    // Sahifa yuklanganda yuklanish animatsiyasi 3 soniya davom etadi
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        tableSelection.classList.remove('hidden');
    }, 3000);

    // Stol tanlangandan keyin tasdiqlash sahifasiga o'tish
    selectTableButton.addEventListener('click', () => {
        const selectedTable = document.getElementById('table-select').value;
        if (selectedTable) {
            tableSelection.classList.add('hidden');
            selectedTableText.textContent = `Tanlangan stol: ${selectedTable}`;
            confirmation.classList.remove('hidden');
        } else {
            alert("Iltimos, stol raqamini tanlang!");
        }
    });

    // Asosiy menyuga o'tish
    continueToMainButton.addEventListener('click', () => {
        confirmation.classList.add('hidden');
        mainContent.classList.remove('hidden');
    });
});
