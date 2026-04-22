const createElements = arr => {
    const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ");
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";
    window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(data => displayLessons(data.data));
};

const removeActive = () => {
    const LessonBtn = document.querySelectorAll(".Lesson-btn");
    LessonBtn.forEach(btn => btn.classList.remove("active"));
};

// --- Special Lesson 7 Local Data ---
const specialLesson7Words = [
    { id: 2001, word: "Eloquent", meaning: "সুভাষী/বাকপটু", pronunciation: "el-uh-kwent", sentence: "He made an eloquent speech that moved the entire audience.", synonyms: ["fluent", "persuasive", "expressive"] },
    { id: 2002, word: "Pragmatic", meaning: "বাস্তবধর্মী", pronunciation: "prag-mat-ik", sentence: "We need a pragmatic approach to solve this complex problem.", synonyms: ["practical", "realistic", "sensible"] },
    { id: 2003, word: "Resilient", meaning: "সহনশীল", pronunciation: "ri-zil-yuhnt", sentence: "The community was resilient and rebuilt quickly after the storm.", synonyms: ["tough", "strong", "flexible"] },
    { id: 2004, word: "Meticulous", meaning: "অতি সতর্ক", pronunciation: "muh-tik-yuh-luhs", sentence: "She is meticulous about her work, checking every detail twice.", synonyms: ["careful", "precise", "thorough"] },
    { id: 2005, word: "Benevolent", meaning: "পরোপকারী", pronunciation: "buh-nev-uh-luhnt", sentence: "The benevolent billionaire donated millions to the local hospital.", synonyms: ["kind", "generous", "charitable"] }
];

const loadLevelword = (id) => {
    manageSpinner(true);
    
    // Intercept Lesson 7 for local injection
    if (id === 7) {
        setTimeout(() => {
            removeActive();
            const clickbtn = document.getElementById(`lesson-btn-${id}`);
            clickbtn.classList.add("active");
            displayWords(specialLesson7Words);
        }, 300);
        return;
    }

    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();
            const clickbtn = document.getElementById(`lesson-btn-${id}`);
            clickbtn.classList.add("active");
            displayWords(data.data);
        });
};

const loadWordDetails = async (id) => {
    // Intercept custom IDs for Lesson 7
    if (id >= 2001 && id <= 2005) {
        const word = specialLesson7Words.find(w => w.id === id);
        displayWordDetails(word);
        return;
    }

    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
        <div class="">
            <h2 class="text-2xl font-bold">
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i>${word.pronunciation})
            </h2>
        </div>
        <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
        </div>
        <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
        </div>
        <div class="">
            <h2 class="font-bold">Synonym</h2>
            <div class="">${createElements(word.synonyms)}</div>
        </div>
    `;
    document.getElementById("word_modal").showModal();
};

const displayWords = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if (words.length == 0) {
        wordContainer.innerHTML = `
            <div class="py-10 space-y-6 text-center col-span-full rounded-xl">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="text-xl font-medium text-gray-400"> এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bold text-4x1">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        setTimeout(() => { manageSpinner(false); }, 300);
        return;
    }
    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="px-5 py-10 text-center bg-white shadow-sm rounded-xl">
                <h2 class="text-2xl font-bold">${word.word ? word.word : "Word not available"}</h2>
                <p class="font-semibold">Meaning/Pronunciation</p>
                <div class="text-2xl font-medium font-bangla">
                    ${word.meaning ? word.meaning : "Meaning not available "} / ${word.pronunciation ? word.pronunciation : "Pronunciation not available"}
                </div>
                <div class="flex items-center justify-between">
                    <button onclick="loadWordDetails(${word.id})" class="btn bg-sky-500/10 hover:bg-sky-600 hover:text-white transition-all text-sky-600 border-none">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-sky-500/10 hover:bg-sky-600 hover:text-white transition-all text-sky-600 border-none">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
            </div>`;
        wordContainer.append(card);
        setTimeout(() => { manageSpinner(false); }, 400);
    });
};

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelword(${lesson.level_no})" class="btn btn-outline text-sky-500 Lesson-btn hover:bg-sky-300 ">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>`;
        levelContainer.append(btnDiv);
    }
};

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            const filterWords = allWords.filter(word =>
                word.word.toLowerCase().includes(searchValue)
            );
            displayWords(filterWords);
        });
});

const faqCheckboxes = document.querySelectorAll('input[name="faq"]');
faqCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            faqCheckboxes.forEach(other => {
                if (other !== checkbox) {
                    other.checked = false;
                }
            });
        }
    });
});

// --- Dynamic Common Mistakes Logic ---
const loadDailyMistakes = async () => {
    try {
        const response = await fetch("./mistakes.json");
        const commonMistakesList = await response.json();
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const index1 = (dayOfYear * 2) % commonMistakesList.length;
        const index2 = (dayOfYear * 2 + 1) % commonMistakesList.length;
        const mistake1 = commonMistakesList[index1];
        const mistake2 = commonMistakesList[index2];
        document.getElementById("mistake1-wrong").innerText = mistake1.wrong;
        document.getElementById("mistake1-right").innerText = mistake1.right;
        document.getElementById("mistake1-reason").innerText = mistake1.reason;
        document.getElementById("mistake2-wrong").innerText = mistake2.wrong;
        document.getElementById("mistake2-right").innerText = mistake2.right;
        document.getElementById("mistake2-reason").innerText = mistake2.reason;
    } catch (error) {
        console.error("Error loading daily mistakes:", error);
    }
};

// --- Dynamic Day Label Update ---
const updateDailyLabels = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    const mistakeLabel = document.getElementById("mistake-day-label");
    const mythLabel = document.getElementById("myth-day-label");
    if (mistakeLabel) mistakeLabel.innerText = `${todayName}'s`;
    if (mythLabel) mythLabel.innerText = `${todayName}'s`;
};

// --- Dynamic Grammar Mythbusters Logic ---
const loadDailyMyths = async () => {
    try {
        const response = await fetch("./myths.json");
        const mythsList = await response.json();
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const index1 = (dayOfYear * 3) % mythsList.length;
        const index2 = (dayOfYear * 3 + 1) % mythsList.length;
        const index3 = (dayOfYear * 3 + 2) % mythsList.length;
        const m1 = mythsList[index1];
        const m2 = mythsList[index2];
        const m3 = mythsList[index3];
        document.getElementById("myth1-front-text").innerText = m1.myth;
        document.getElementById("myth1-back-fact").innerText = m1.fact;
        document.getElementById("myth1-back-example").innerText = m1.example;
        document.getElementById("myth2-front-text").innerText = m2.myth;
        document.getElementById("myth2-back-fact").innerText = m2.fact;
        document.getElementById("myth2-back-example").innerText = m2.example;
        document.getElementById("myth3-front-text").innerText = m3.myth;
        document.getElementById("myth3-back-fact").innerText = m3.fact;
        document.getElementById("myth3-back-example").innerText = m3.example;
    } catch (error) {
        console.error("Error loading daily myths:", error);
    }
};

// --- YouTube Video Modal Logic ---
const playVideo = (videoId) => {
    const player = document.getElementById("youtube-player");
    const modal = document.getElementById("video_modal");
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.showModal();
};

const stopVideo = () => {
    const player = document.getElementById("youtube-player");
    player.src = ""; // Stop the video and audio
};

// Start initialization
loadLessons();
document.addEventListener("DOMContentLoaded", () => {
    loadDailyMistakes();
    loadDailyMyths();
    updateDailyLabels();
});
