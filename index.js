
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
        .then(data => displayLessons(data.data))

};
const removeActive = () => {
    const LessonBtn = document.querySelectorAll(".Lesson-btn");
    LessonBtn.forEach(btn => btn.classList.remove("active"))
}
const loadLevelword = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive();
            const clickbtn = document.getElementById(`lesson-btn-${id}`);

            clickbtn.classList.add("active");
            displayWords(data.data);
        });
}

const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}


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
    `
    document.getElementById("word_modal").showModal();
}

displayWords = (words) => {
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
        console.log(word);
        const card = document.createElement("div");
        card.innerHTML = `<div class="px-5 py-10 text-center bg-white shadow-sm rounded-xl">
            <h2 class="text-2xl font-bold">
                ${word.word ? word.word : "Word not available"}
            </h2>
            <p class="font-semibold">
                Meaning/Pronunciation
            </p>

            <div class="text-2xl font-medium font-bangla">
               ${word.meaning ? word.meaning : "Meaning not available "} / ${word.pronunciation ? word.pronunciation : "Pronunciation not available"}
            </div>

            <div class="flex items-center justify-between">

                <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#4f34ff]">
                    <i class="fa-solid fa-circle-info"></i>

                </button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#4f34ff]">
                    <i class="fa-solid fa-volume-high"></i>
                </button>

            </div>

        </div>`
        wordContainer.append(card);
        setTimeout(() => { manageSpinner(false); }, 400);
    });
}
displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");

    levelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelword(${lesson.level_no})"class="btn btn-outline text-sky-500 Lesson-btn hover:bg-sky-300 ">
        <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
        </button>`
        levelContainer.append(btnDiv);
    };
}
loadLessons();


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
