document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loading-screen');
    const tableSelection = document.getElementById('table-selection');
    const mainContent = document.getElementById('main-content');
    const selectTableButton = document.getElementById('select-table');
    
    // Sahifa yuklanganda yuklanish animatsiyasi 3 soniya davom etadi
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        tableSelection.classList.remove('hidden');
    }, 3000);

    // Stol tanlangandan keyin asosiy sahifaga o'tish
    selectTableButton.addEventListener('click', () => {
        const selectedTable = document.getElementById('table-select').value;
        if (selectedTable) {
            // Yuklanish ekranini yashirish
            tableSelection.classList.add('hidden');
            mainContent.classList.remove('hidden');

            // Tanlangan stol raqamini ko'rsatish
            const header = document.createElement('h2');
            header.textContent = `Tanlangan stol: ${selectedTable}`;
            mainContent.insertBefore(header, mainContent.firstChild);
        } else {
            alert("Iltimos, stol raqamini tanlang!");
        }
    });
});
