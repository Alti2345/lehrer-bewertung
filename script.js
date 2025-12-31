const teachers = [
    { id: 1, name: "Herr M. – Mathematik" },
    { id: 2, name: "Frau S. – Deutsch" },
    { id: 3, name: "Herr K. – Physik" }
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
