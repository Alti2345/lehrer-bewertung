// 🔥 Firebase Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyBqbZbD14_YvUSd2V5617P1Nz29S-KGPuE",
    authDomain: "lehrer-bewertung-f2f24.firebaseapp.com",
    databaseURL: "https://lehrer-bewertung-f2f24-default-rtdb.firebaseio.com",
    projectId: "lehrer-bewertung-f2f24",
    storageBucket: "lehrer-bewertung-f2f24.firebasestorage.app",
    messagingSenderId: "454568720300",
    appId: "1:454568720300:web:1c0dd602824b4257c26c09"
};

// Firebase starten
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Lehrer
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

// 🔄 LIVE-DATEN LADEN
db.ref("ratings").on("value", snap => {
    const data = snap.val() || {};
    render(data);
});

function render(data) {
    list.innerHTML = "";
    rankingDiv.innerHTML = "";

    const ranked = teachers.map(t => {
        const r = data[t.id] || [];
        const avg = r.length ? r.reduce((a,b)=>a+b,0)/r.length : null;
        return { ...t, avg, count: r.length };
    }).filter(t=>t.avg!==null).sort((a,b)=>b.avg-a.avg);

    teachers.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("h2");
        title.textContent = t.name;

        const stars = document.createElement("div");
        stars.className = "stars";

        const voted = localStorage.getItem(`voted_${t.id}`) === "true";

        for (let i=1;i<=5;i++){
            const s=document.createElement("span");
            s.textContent="⭐";
            if(!voted){
                s.onclick=()=>{
                    db.ref(`ratings/${t.id}`).push(i);
                    localStorage.setItem(`voted_${t.id}`,"true");
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
        row.textContent = ["🥇","🥈","🥉"][i]+" "+t.name;
        rankingDiv.appendChild(row);
    });
}
