/*************************
 * 🔥 FIREBASE START
 *************************/
const firebaseConfig = {
    apiKey: "AIzaSyBqbZbD14_YvUSd2V5617P1Nz29S-KGPuE",
    authDomain: "lehrer-bewertung-f2f24.firebaseapp.com",
    databaseURL: "https://lehrer-bewertung-f2f24-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lehrer-bewertung-f2f24",
    storageBucket: "lehrer-bewertung-f2f24.appspot.com",
    messagingSenderId: "454568720300",
    appId: "1:454568720300:web:1c0dd602824b4257c26c09"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/*************************
 * 👨‍🏫 LEHRER
 *************************/
const teachers = [
    { id: 1, name: "Ingrid Vogtenhuber" },
    { id: 2, name: "Markus Anzinger" },
    { id: 3, name: "Christian Danner" },
    { id: 4, name: "Daniela Fellinger" },
    { id: 5, name: "Johann Fellinger" },
    { id: 6, name: "Peter Föttinger" },
    { id: 7, name: "Johannes Gadermaier" },
    { id: 8, name: "Benedikt Griesmayr" },
    { id: 9, name: "Johann Großpointner" },
    { id: 10, name: "Mario Haberfellner" },
    { id: 11, name: "Michael Holly-Schiemer" },
    { id: 12, name: "Franz Kirchgatterer" },
    { id: 13, name: "Christine Kolb" },
    { id: 14, name: "Josef Krammer" },
    { id: 15, name: "Tina Loibl" },
    { id: 16, name: "Caroline Maier" },
    { id: 17, name: "Oberascher Clemens" },
    { id: 18, name: "Oberascher Johannes" },
    { id: 19, name: "Schröcker Bernhard" },
    { id: 20, name: "Waldhör Alois" },
    { id: 21, name: "Weilhartner Marco" },
    { id: 22, name: "Stadlmayr Florian" }
];

const list = document.getElementById("teacher-list");
const rankingDiv = document.getElementById("ranking");

/*************************
 * 🔄 LIVE-DATEN LADEN
 *************************/
db.ref("ratings").on("value", snapshot => {
    const data = snapshot.val() || {};
    render(data);
});

/*************************
 * 🎨 RENDER FUNKTION
 *************************/
function render(data) {
    list.innerHTML = "";
    rankingDiv.innerHTML = "";

    // Durchschnitt berechnen
    const stats = teachers.map(t => {
        const ratingsObj = data[t.id] || {};
        const values = Object.values(ratingsObj);
        const avg = values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : null;

        return {
            ...t,
            avg,
            count: values.length
        };
    });

    // Rangliste
    const ranked = stats
        .filter(t => t.avg !== null)
        .sort((a, b) => b.avg - a.avg);

    // Lehrer-Karten
    stats.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";

        const rankIndex = ranked.findIndex(r => r.id === t.id);
        if (rankIndex === 0) card.classList.add("gold");
        if (rankIndex === 1) card.classList.add("silver");
        if (rankIndex === 2) card.classList.add("bronze");

        const title = document.createElement("h2");
        title.textContent = t.name;

        const stars = document.createElement("div");
        stars.className = "stars";

        const votedKey = `voted_teacher_${t.id}`;
        const alreadyVoted = localStorage.getItem(votedKey) === "true";

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.textContent = "⭐";

            if (!alreadyVoted) {
                star.onclick = () => {
                    db.ref(`ratings/${t.id}`).push(i);
                    localStorage.setItem(votedKey, "true");
                };
            } else {
                star.style.opacity = "0.4";
                star.style.cursor = "not-allowed";
            }

            stars.appendChild(star);
        }

        const avgDiv = document.createElement("div");
        avgDiv.className = "avg";
        avgDiv.textContent = t.avg
            ? `⭐ ${t.avg.toFixed(1)} / 5 (${t.count})`
            : "Noch keine Bewertung";

        card.append(title, stars, avgDiv);
        list.appendChild(card);
    });

    // Top 3 anzeigen
    ranked.slice(0, 3).forEach((t, i) => {
        const row = document.createElement("div");
        row.textContent = ["🥇", "🥈", "🥉"][i] + " " + t.name +
            ` – ⭐ ${t.avg.toFixed(1)}`;
        rankingDiv.appendChild(row);
    });
}
