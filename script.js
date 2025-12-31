const teachers = [
    { id: 1, name: "Stefan Heuberger" },
    { id: 2, name: "Helena Bauer" },
    { id: 3, name: "Ingrid Vogtenhuber" },
    { id: 4, name: "Markus Anzinger" },
    { id: 5, name: "Christian Danner" },
    { id: 6, name: "Daniela Fellinger" },
    { id: 7, name: "Johann Fellinger" },
    { id: 8, name: "Peter Föttinger" },
    { id: 9, name: "Johannes Gadermaier" },
    { id: 10, name: "Benedikt Griesmayr" },
    { id: 11, name: "Johann Großpointner" },
    { id: 12, name: "Mario Haberfellner" },
    { id: 13, name: "Michael Holly-Schiemer" },
    { id: 14, name: "Franz Kirchgatterer" },
    { id: 15, name: "Christine Kolb" },
    { id: 16, name: "Josef Krammer" },
    { id: 17, name: "Tina Loibl" },
    { id: 18, name: "Caroline Maier" }
];

const list = document.getElementById("teacher-list");
const rankingDiv = document.getElementById("ranking");
const hasVoted = localStorage.getItem("hasVoted") === "true";

teachers.forEach(t => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = t.name;

    const starsDiv = document.createElement("div");
    starsDiv.className = "stars";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = "⭐";

        if (!hasVoted) {
            star.onclick = () => addRating(t.id, i);
        } else {
            star.style.opacity = "0.4";
            star.style.cursor = "not-allowed";
        }

        starsDiv.appendChild(star);
    }

    const avg = document.createElement("div");
    avg.className = "avg";
    avg.id = `avg-${t.id}`;

    card.appendChild(title);
    card.appendChild(starsDiv);
    card.appendChild(avg);

    if (hasVoted) {
        const info = document.createElement("div");
        info.textContent = "Du hast bereits abgestimmt";
        info.style.color = "#888";
        info.style.marginTop = "8px";
        card.appendChild(info);
    }

    list.appendChild(card);
    updateAverage(t.id);
});

updateRanking();

function addRating(id, value) {
    if (localStorage.getItem("hasVoted") === "true") return;

    const key = `ratings_${id}`;
    const ratings = JSON.parse(localStorage.getItem(key)) || [];
    ratings.push(value);
    localStorage.setItem(key, JSON.stringify(ratings));

    localStorage.setItem("hasVoted", "true");
    location.reload();
}

function getAverage(id) {
    const ratings = JSON.parse(localStorage.getItem(`ratings_${id}`)) || [];
    if (ratings.length === 0) return null;

    const sum = ratings.reduce((a, b) => a + b, 0);
    return {
        avg: sum / ratings.length,
        count: ratings.length
    };
}

function updateAverage(id) {
    const data = getAverage(id);
    const avgDiv = document.getElementById(`avg-${id}`);

    if (!data) {
        avgDiv.textContent = "Noch keine Bewertung";
        return;
    }

    avgDiv.textContent = `⭐ ${data.avg.toFixed(1)} / 5 (${data.count} Bewertungen)`;
}

function updateRanking() {
    const ranking = teachers
        .map(t => {
            const data = getAverage(t.id);
            return data ? { name: t.name, ...data } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.avg - a.avg);

    rankingDiv.innerHTML = "";

    if (ranking.length === 0) {
        rankingDiv.textContent = "Noch keine Bewertungen vorhanden.";
        return;
    }

    ranking.forEach((t, index) => {
        const row = document.createElement("div");
        row.textContent =
            `${index + 1}. ${t.name} – ⭐ ${t.avg.toFixed(1)} (${t.count})`;
        rankingDiv.appendChild(row);
    });
}
