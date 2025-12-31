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

/* ===== Dark Mode ===== */
const toggle = document.getElementById("themeToggle");
if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
}
toggle.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("dark", document.body.classList.contains("dark"));
};

/* ===== Bewertungen ===== */
function getRatings(id) {
    return JSON.parse(localStorage.getItem(`ratings_${id}`)) || [];
}

function getAverage(id) {
    const r = getRatings(id);
    if (r.length === 0) return null;
    return r.reduce((a,b)=>a+b,0) / r.length;
}

function render() {
    list.innerHTML = "";
    rankingDiv.innerHTML = "";

    const ranked = teachers
        .map(t => ({ ...t, avg: getAverage(t.id), count: getRatings(t.id).length }))
        .filter(t => t.avg !== null)
        .sort((a,b)=>b.avg-a.avg);

    teachers.forEach(t => {
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

        const voted = localStorage.getItem(`voted_teacher_${t.id}`) === "true";

        for (let i=1;i<=5;i++){
            const s=document.createElement("span");
            s.textContent="⭐";
            if(!voted){
                s.onclick=()=>{
                    const r=getRatings(t.id);
                    r.push(i);
                    localStorage.setItem(`ratings_${t.id}`,JSON.stringify(r));
                    localStorage.setItem(`voted_teacher_${t.id}`,"true");
                    render();
                };
            } else {
                s.style.opacity="0.4";
            }
            stars.appendChild(s);
        }

        const avg=document.createElement("div");
        avg.className="avg";
        avg.textContent = t.avg
            ? `⭐ ${t.avg.toFixed(1)} / 5 (${t.count})`
            : "Noch keine Bewertung";

        card.append(title,stars,avg);
        list.appendChild(card);
    });

    ranked.slice(0,3).forEach((t,i)=>{
        const row=document.createElement("div");
        const medal=["🥇","🥈","🥉"][i];
        row.textContent=`${medal} ${t.name} – ⭐ ${t.avg.toFixed(1)}`;
        rankingDiv.appendChild(row);
    });
}

render();
