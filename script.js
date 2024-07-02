const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [
    {
        date: "2002-06-26",
        explanation: "Clouds of glowing gas mingle with lanes of dark dust in the Trifid Nebula, a star forming region toward the constellation of Sagittarius.  In the center, the three huge dark dust lanes that give the Trifid its name all come together. Mountains of opaque dust appear on the lower left, while filaments of dust are visible threaded throughout the nebula.  A single massive star visible near the center causes much of the Trifid's glow.  The Trifid, also known as M20, is only about 300,000 years old, making it among the youngest emission nebula known.  The nebula lies about 5000 light years away and part pictured above spans about 20 light years.  The above false-color digitally enhanced image was taken with the Gemini North telescope earlier this month.",
        hdurl: "https://apod.nasa.gov/apod/image/0206/trifid_gemini_big.jpg",
        title: "In the Center of the Trifid Nebula",
        url: "https://apod.nasa.gov/apod/image/0206/trifid_gemini.jpg"
    },
    {
        copyright: "\nWang Jin\n",
        date: "2022-06-27",
        explanation: "The Gum Nebula is so large and close it is actually hard to see. This interstellar expanse of glowing hydrogen gas frequently evades notice because it spans 35 degrees -- over 70 full Moons -- while much of it is quite dim. This featured spectacular 90-degree wide mosaic, however, was designed to be both wide and deep enough to bring up  the Gum -- visible in red on the right. The image was acquired late last year with both the foreground -- including Haba Snow Mountain -- and the background -- including the Milky Way's central band -- captured by the same camera and from the same location in Shangri-La, Yunnan, China. The Gum Nebula is so close that we are only about 450 light-years from the front edge, while about 1,500 light-years from the back edge. Named for a cosmic cloud hunter, Australian astronomer Colin Stanley Gum (1924-1960), the origin of this complex nebula is still being debated. A leading theory for the origin of the Gum Nebula is that  it is the remnant of a million year-old supernova explosion, while a competing theory holds that the Gum is a molecular cloud shaped over eons by multiple supernovas and the outflowing winds of several massive stars.",
        hdurl: "https://apod.nasa.gov/apod/image/2206/GumMountain_WangJin_2400.jpg",
        media_type: "image",
        service_version: "v1",
        title: "The Gum Nebula over Snowy Mountains",
        url: "https://apod.nasa.gov/apod/image/2206/GumMountain_WangJin_1080.jpg"
    }
];
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

        // const response = await fetch(apiUrl);
        // resultsArray = await response.json();
        // console.log(resultsArray);
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