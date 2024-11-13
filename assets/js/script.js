const BASE_URL = "https://pokeapi.co/api/v2/pokemon"
let offset = 0;
let limit = 40;

async function onload() {
    let data = await getLimitPokemon(limit, offset);
    await renderPokedex(data, false)
}


async function renderPokedex(data, loadMore) {
    try {
        let contentHTML = "";
        if (loadMore === true) {
            contentHTML = document.getElementById("pokedex").innerHTML;
        }
        for (const result of data.results) {
            let pokemon = await getSinglePokemon(result.url);
            let bgColor = pokemon.types[0].type.name;
            let icons =     addElementIcons(pokemon.types);
            let pokeName = pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1);
            contentHTML += renderPokeCard(pokeName, pokemon, bgColor, icons);
        }
        document.getElementById("pokedex").innerHTML = contentHTML;
        document.getElementById("load-more").innerHTML = addLoadMoreButton();
    } catch (error) {
        console.error("Fehler beim Laden der JSON-Daten:", error);
    }
}


async function getLimitPokemon(limit, offset) {
    let response = await fetch(BASE_URL + `?limit=${limit}&offset=${offset}`);
    let responseToJson = await response.json();
    return responseToJson;
}

async function getSinglePokemon(url) {
    let response = await fetch(url);
    if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadMore() {
    offset += limit;
    let data = await getLimitPokemon(limit, offset);
    await renderPokedex(data, true);
}

async function getPopupData(id) {
    let response = await fetch(BASE_URL + `/${id}`);
    let responseToJson = await response.json();
    return responseToJson;
}

function bubblingPrevention(event) {
  event.stopPropagation();
  console.log('Bubbling is prevented');
}

async function togglePopUp(id, pokeName, bgColor) {
    if (id > 0) {
        document.getElementById("poke-popup").classList.remove("d-none");
        let data = await getPopupData(id);
        renderPopUp(data, pokeName, bgColor);
        console.log(data);
    } else {
        closePopUp();
    }
}

function showTab(tab) {
    let tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("tab-active");
    }
    document.getElementById(`tab-${tab}`).classList.add("tab-active");
    document.getElementById("tab-content-main").classList.add("d-none");
    document.getElementById("tab-content-stats").classList.add("d-none");
    document.getElementById("tab-content-evo").classList.add("d-none");
    document.getElementById(`tab-content-${tab}`).classList.remove("d-none");
}