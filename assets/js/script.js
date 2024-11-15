const BASE_URL = "https://pokeapi.co/api/v2/pokemon"
let offset = 0;
let limit = 40;
let dataArray = {};

async function onload() {
    let data = await getLimitPokemon(limit, offset);
    await renderPokedex(data, false, "pokedex");
    dataArray = await getLimitPokemon(100000, 0);
    document.getElementById('search-bar').disabled = false;
    document.getElementById('search-bar').placeholder = "Search...";
}


async function renderPokedex(data, loadMore, element) {
    try {
        let contentHTML = "";
        if (loadMore === true) {
            contentHTML = document.getElementById(element).innerHTML;
        }
        for (const result of data.results) {
            let pokemon = await getSinglePokemon(result.url);
            let bgColor = pokemon.types[0].type.name;
            let icons = addElementIcons(pokemon.types);
            let pokeName = pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1);
            contentHTML += renderPokeCard(pokeName, pokemon, bgColor, icons);
        }
        document.getElementById(element).innerHTML = contentHTML;
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
    await renderPokedex(data, true, "pokedex");
}

async function getPopupData(id) {
    let response = await fetch(BASE_URL + `/${id}`);
    let responseToJson = await response.json();
    return responseToJson;
}

function bubblingPrevention(event) {
    event.stopPropagation();
}

async function togglePopUp(id, pokeName, bgColor) {
    if (id > 0) {
        document.getElementById("poke-popup").classList.remove("d-none");
        let data = await getPopupData(id);
        renderPopUp(data, pokeName, bgColor);
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


async function getEvolutionChain(pokeID) {
    // Abrufen der Pokémon-Spezies-Daten
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeID}`);
    const speciesData = await speciesResponse.json();

    // Abrufen der Evolutionskette
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

    // Evolutionskette auslesen
    const evolutionChain = [];
    let currentEvolution = evolutionData.chain;

    // Iteriere durch die Kette
    while (currentEvolution) {
        evolutionChain.push(currentEvolution.species);
        currentEvolution = currentEvolution.evolves_to[0]; // Nächste Evolution
    }
    let evoData = await getEvolutionData(evolutionChain);
    return evoData;
}

async function getEvolutionData(evolutionChain) {
    let evolutionSVG = [];
    for (let i = 0; i < evolutionChain.length; i++) {
        const pokeData = await getSinglePokemon(BASE_URL + `/${evolutionChain[i].name}`);
        evolutionSVG.push(
            {
                name: evolutionChain[i].name,
                upperName: evolutionChain[i].name.charAt(0).toUpperCase() + evolutionChain[i].name.slice(1),
                svg: pokeData.sprites.other.dream_world.front_default
            }
        );
    }
    return evolutionSVG;
}

function searchInput(event) {
    const input = event.target.value.toLowerCase(); // Eingabetext (Kleinschreibung)
    let searchedPokemon = {
        results: []
    };
    // Prüfen, ob `dataArray.results` existiert und ein Array ist
    if (!dataArray || !Array.isArray(dataArray.results)) {
        console.error("Fehler: dataArray.results ist nicht definiert oder kein Array.");
        return;
    }

    if (input.length >= 3) {
        // Filter Pokémon im `results`-Array
        const filteredPokemon = dataArray.results.filter(pokemon =>
            pokemon.name.startsWith(input) // Name beginnt mit der Eingabe
        );

        if (filteredPokemon.length > 0) {
            // Gefilterte Pokémon ausgeben
            for (i = 0; i < filteredPokemon.length; i++) {
                searchedPokemon.results.push(filteredPokemon[i]);
            }
            showSearchResults();
            renderPokedex(searchedPokemon, false, "search-pokedex");
        } else {
            // Keine Treffer gefunden
            renderError(1); // Fehler anzeigen
        }
    } else {
        renderError(0); // Eingabe zu kurz
    }
}
