// Elemente aus dem HTML abgreifen
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');

// Funktion zur Ausführung der Online-Suche (Asynchron, da wir auf den Server warten)
async function performSearch() {
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = ""; // Vorherige Ergebnisse löschen

    if (query === "") {
        resultsContainer.innerHTML = "<p class='no-results'>Bitte gib einen Suchbegriff ein.</p>";
        return;
    }

    try {
        // Lade-Anzeige für den Nutzer (optional, aber cool für die Usability)
        resultsContainer.innerHTML = "<p class='loading'>Suche läuft...</p>";

        // Anfrage an deinen Express-Server senden
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Fehler bei der Server-Anfrage');
        }

        const data = await response.json();
        resultsContainer.innerHTML = ""; // Lade-Anzeige entfernen

        // Ergebnisse auswerten und anzeigen (Erwartet die Struktur deines Servers: { results: [...] })
        if (!data.results || data.results.length === 0) {
            resultsContainer.innerHTML = "<p class='no-results'>Keine Angebote zu diesem Spiel gefunden.</p>";
            return;
        }

        data.results.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <div>
                    <h3>${game.title}</h3>
                    <small>Shop: ${game.store || 'Unbekannt'}</small>
                </div>
                <div class="price">${game.price || 'N/A'}</div>
            `;
            resultsContainer.appendChild(gameCard);
        });

    } catch (error) {
        console.error("Suchfehler:", error);
        resultsContainer.innerHTML = "<p class='error-results'>Verbindung zum Server fehlgeschlagen.</p>";
    }
}

// Event-Listener für den Button-Klick und die Enter-Taste
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();

}
});
