const newsContainer = document.getElementById("newsContainer");
const locationTitle = document.getElementById("locationTitle");
const refreshBtn = document.getElementById("refreshLocationBtn");

// Старт приложения
init();

async function init() {
    showLoading();

    try {
        const coords = await getCoordinates();
        const loc = await getLocationByAPI(coords.lat, coords.lon);

        loadNews(loc.countryCode, loc.city);

    } catch (err) {
        console.warn("Ошибка геолокации:", err);
        loadNews("DEFAULT", null);
    }
}

async function loadNews(country, city) {
    try {
        const response = await fetch("data/news.json");
        const allNews = await response.json();

        // Выбор новостей по стране или DEFAULT
        const news = allNews[country] || allNews["DEFAULT"];

        renderNews(news, country, city);

    } catch (e) {
        console.error("Ошибка загрузки JSON:", e);
        newsContainer.innerHTML = `<p>Не удалось загрузить новости.</p>`;
    }
}

function renderNews(list, country, city) {
    newsContainer.innerHTML = "";

    // Заголовок местоположения
    if (city)
        locationTitle.textContent = `Новости для: ${city}`;
    else if (country !== "DEFAULT")
        locationTitle.textContent = `Новости для страны: ${country}`;
    else
        locationTitle.textContent = "Новости со всего мира";

    // Создание карточек новостей
    list.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        card.innerHTML = `
            <img src="${item.image}" alt="" />
            <div class="news-card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
            <a href="${item.link}" class="read-more">Читать полностью</a>
        `;

        newsContainer.appendChild(card);
    });
}

// Показывает «Загрузка...»
function showLoading() {
    newsContainer.innerHTML = `<div class="spinner"></div>`;
}



// Обновление через кнопку
refreshBtn.addEventListener("click", init);
