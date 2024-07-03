const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};


function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    if (page === "results") {
        resultsNav.classList.remove("hidden");
        favoritesNav.classList.add("hidden");
    } else {
        resultsNav.classList.add("hidden");
        favoritesNav.classList.remove("hidden");

    }
    loader.classList.add("hidden");
}


function createDOMNodes(page) {

    const currentArray = page === "results" ? resultsArray : Object.values(favorites);

    currentArray.forEach(result => {
        // Card Container
        const card = document.createElement("div");
        card.classList.add("card");

        // Link
        const link = document.createElement("a");
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = "_blank";

        // Image
        const image = document.createElement("img");
        image.src = result.url;
        image.altf = "NASA Picture of the Day";
        image.loading = "lazy";
        image.classList.add("card-img-top");

        // Card body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Card title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = result.title;

        // Save Text
        const saveText = document.createElement("p");
        saveText.classList.add("clickable");

        if (page === "results") {
            saveText.textContent = "Add to Favorites";
            saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = "Remove from Favorites";
            saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
        }

        // Card text
        const cardText = document.createElement("p");
        cardText.textContent = result.explanation;

        // Footer Container
        const footer = document.createElement("small");
        footer.classList.add("text-muted");

        // Date
        const date = document.createElement("strong");
        date.textContent = result.date;

        // Copyright
        const copyRightResult = result.copyRight === undefined ? "" : result.copyRight;
        const copyRight = document.createElement("span");
        copyRight.textContent = ` ${copyRightResult}`;

        // Append
        footer.append(date, copyRight);
        cardBody.append(cardTitle, cardText, saveText, footer);
        link.appendChild(image);
        card.append(link, cardBody);

        imagesContainer.appendChild(card);
    })
};


function updateDOM(page) {

    // Get Favorites from localstorage
    if (localStorage.getItem("nasaFavorites")) {
        favorites = JSON.parse(localStorage.getItem("nasaFavorites"))
    }
    imagesContainer.textContent = "";
    createDOMNodes(page);
    showContent(page);
}


// Get images from NASA API
async function getNasaPictures() {

    // Show Loader
    loader.classList.remove("hidden");

    try {

        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM("results");

    } catch (err) {
        console.error(err);
    }

}


function saveFavorite(itemUrl) {
    // Loop through results Array to select Favorite

    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {

            favorites[itemUrl] = item;

            // Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000)

            // Set Favorites in localStorage
            localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        }
    })

}


function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
        updateDOM("favorites");
    }
}

getNasaPictures();