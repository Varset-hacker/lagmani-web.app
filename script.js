// Yuklanish ekranini ko'rsatish
document.addEventListener("DOMContentLoaded", function() {
    const loadingOverlay = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');

    // 2 soniya davomida yuklanish ekranini ko'rsatish
    setTimeout(function() {
        loadingOverlay.style.display = 'none';
        mainContent.style.display = 'flex';
    }, 2000);
});

// Stolni tanlash va tasdiqlash funksiyasi
function confirmTable() {
    const select = document.getElementById("table-number");
    const selectedTable = select.options[select.selectedIndex].text;
    const confirmationMessage = document.getElementById("confirmation-message");

    if (selectedTable) {
        confirmationMessage.textContent = `Siz tanlagan stol: ${selectedTable}`;
        confirmationMessage.style.display = 'block';

        // Stol tanlanganidan so'ng, tanlov bo'limini yashirish
        document.getElementById("table-selection").style.display = 'none';

        // Yana asosiy menyuga o'tish, bu yerda animatsiya kiritishingiz mumkin
        setTimeout(() => {
            window.location.href = 'main_menu.html'; // Asosiy menyu sahifangizga yo'naltirish
        }, 3000); // 3 soniyadan keyin o'tish
    } else {
        alert("Iltimos, stolni tanlang!");
    }
}

// Tilni o'zgartirish funksiyasi
function changeLanguage() {
    const languageSelector = document.getElementById("language");
    const selectedLanguage = languageSelector.value;
    // Tilni o'zgartirish logikasini yozing
    // Tarjima qismlarini o'zgartirish kerak bo'ladi
    if (selectedLanguage === "uz") {
        document.querySelector("h1").textContent = "Lagmani Restaurant";
        document.querySelector("#table-selection label").textContent = "Stolni tanlang:";
        document.querySelector("#continue-button").textContent = "Davom etish";
    } else if (selectedLanguage === "ru") {
        document.querySelector("h1").textContent = "Ресторан Лагмани";
        document.querySelector("#table-selection label").textContent = "Выберите стол:";
        document.querySelector("#continue-button").textContent = "Продолжить";
    } else if (selectedLanguage === "en") {
        document.querySelector("h1").textContent = "Lagmani Restaurant";
        document.querySelector("#table-selection label").textContent = "Select a table:";
        document.querySelector("#continue-button").textContent = "Continue";
    }
}
