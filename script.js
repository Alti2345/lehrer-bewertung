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

let selectedTeacher = null;
let selectedRating = 0;

const listDiv = document.getElementById("teacher-list");

teachers.forEach(teacher => {
    const btn = document.createElement("button");
    btn.textContent = teacher.name;
    btn.onclick = () => openRating(teacher);
    listDiv.appendChild(btn);
});

function openRating(teacher) {
    selectedTeacher = teacher;
    document.getElementById("teacher-name").textContent = teacher.name;
    document.getElementById("rating-box").classList.remove("hidden");
}

document.querySelectorAll("#stars span").forEach(star => {
    star.onclick = () => {
        selectedRating = star.dataset.value;
        alert(`Du hast ${selectedRating} Sterne gewählt`);
    };
});

function saveRating() {
    if (!selectedRating) {
        alert("Bitte Sterne auswählen!");
        return;
    }

    localStorage.setItem(`rating_${selectedTeacher.id}`, selectedRating);
    alert("Bewertung gespeichert!");
}
