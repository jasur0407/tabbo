const API_KEY = import.meta.env.VITE_NASA_API_KEY
const datepicker = document.querySelector("#datepicker");
const today = new Date().toISOString().split("T")[0]
datepicker.value = today
datepicker.max = today

function loadApod(date) {

    document.querySelector("#app").innerHTML = "<p>loading...</p>"

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
    .then(response => response.json()).then (data => {
        let media;

        if (data.media_type === "image") {
            media = `<img src="${data.url}" />`
        } else if (data.url.includes("youtube")) {
            media = `<iframe src="${data.url}"></iframe>`
        } else {
            media = `<video src="${data.url }" controls></video>`
        }

        document.querySelector(".title").innerHTML = data.title

        document.querySelector("#app").innerHTML = `
            ${media}
            <p>${data.explanation}</p>
        `
    })

    .catch(err => {
        document.querySelector("#app").innerHTML = `<p>Error: ${err.message}</p>`;
    })
}

datepicker.addEventListener("change", (event) => {
    if (event.target.value <= today) {
        loadApod(event.target.value)
    }
})
loadApod(datepicker.value)