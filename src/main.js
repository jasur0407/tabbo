const API_KEY = import.meta.env.VITE_NASA_API_KEY
const datepicker = document.querySelector("#datepicker");
const today = new Date().toISOString().split("T")[0]
datepicker.value = today
datepicker.max = today

function typeWordByWord(elementId, text, speed) {
    return new Promise((resolve) => {
        let index = 0;
        const words = text.split(" ");
        let element = document.getElementById(elementId);

        const interval = setInterval(() => {
            if (index < words.length) {
                element.textContent += (index === 0 ? "" : " " + words[index]);
                index += 1;
            } else {
                clearInterval(interval)
                resolve()
            }
        }, speed)
    })  
}


async function typeAnimation(titleText, bodyText) {
    await typeWordByWord("title", titleText, 150);
    await typeWordByWord("explanation", bodyText, 40);
}

async function loadApod(date) {

    document.querySelector("#media").innerHTML = "<p>loading...</p>"
    document.querySelector("#title").textContent = "";
    document.querySelector("#explanation").textContent = "";

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
    .then(response => response.json()).then (data => {
        let titleText = data.title;
        let bodyText = data.explanation
        let media;

        if (data.media_type === "image") {
            media = `<img src="${data.url}" />`
        } else if (data.url.includes("youtube")) {
            media = `<iframe src="${data.url}" allow="autoplay; fullscreen;" allowfullscreen></iframe>`
        } else {
            media = `<video src="${data.url }" controls autoplay></video>`
        }

        document.querySelector("#media").innerHTML = `
            ${media}
        `

        typeAnimation(titleText, bodyText)
    })

    .catch(err => {
        document.querySelector("#media").innerHTML = `<p>Error: ${err.message}</p>`;
    })
}

datepicker.addEventListener("change", (event) => {
    if (event.target.value <= today) {
        loadApod(event.target.value)
    }
})
loadApod(datepicker.value)