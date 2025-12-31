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

teachers.forEach(t => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = t.name;

    const starsDiv = document.createElement("div");
    starsDiv.className = "stars";

    const hasVotedForTeacher =
        localStorage.getItem(`voted_teacher_${t.id}`) === "true";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = "⭐";

        if (!hasVotedForTeacher) {
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

    if (hasVotedForTeacher) {
        const info = document.createElement("div");
        info.textContent = "Du hast diesen Lehrer bereits bewertet";
        info.style.color = "#888";
        info.style.marginTop = "6px";
        card.appendChild(info);
    }

    list.appendChild(card);
    updateAverage(t.id);
});

function addRating(id, value) {
    if (localStorage.getItem(`voted_teacher_${id}`) === "true") {
        return;
    }

    const key = `ratings_${id}`;
    const ratings = JSON.parse(localStorage.getItem(key)) || [];
    ratings.push(value);
    localStorage.setItem(key, JSON.stringify(ratings));

    localStorage.setItem(`voted_teacher_${id}`, "true");

    location.reload();
}

function updateAverage(id) {
    const ratings = JSON.parse(localStorage.getItem(`ratings_${id}`)) || [];
    const avgDiv = document.getElementById(`avg-${id}`);

    if (ratings.length === 0) {
        avgDiv.textContent = "Noch keine Bewertung";
        return;
    }

    const sum = ratings.reduce((a, b) => a + b, 0);
    const avg = (sum / ratings.length).toFixed(1);

    avgDiv.textContent = `⭐ ${avg} / 5 (${ratings.length} Bewertungen)`;
}
