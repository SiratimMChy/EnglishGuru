const createElements = arr => {
    const htmlElements = arr.map(el => `<span class="btn">${el}</span>)`);
    console.log(htmlElements.join(" "));

};

const syn = ["e1", "e2", "e3"];