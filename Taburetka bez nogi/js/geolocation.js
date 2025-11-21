// Получение координат пользователя
function getCoordinates() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Геолокация не поддерживается браузером.");
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                });
            },
            () => reject("Не удалось получить доступ к геолокации.")
        );
    });
}

// Определение страны и города через Nominatim (OpenStreetMap) — БЕЗ ключей
async function getLocationByAPI(lat, lon) {
    const url =
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`;

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "GeoNews-Student-Project"
            }
        });

        const data = await res.json();

        const address = data.address;

        const city =
            address.city ||
            address.town ||
            address.village ||
            "Ваш регион";

        const countryCode = (address.country_code || "default").toUpperCase();

        return { city, countryCode };

    } catch (err) {
        console.error("Ошибка Nominatim:", err);
        return { city: null, countryCode: "DEFAULT" };
    }
}
