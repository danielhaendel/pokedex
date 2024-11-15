function renderPokeCard(pokeName, pokemon, bgColor, icons) {
    return `
       <div class="pokemon-card" id="card-${pokemon.id}" onclick="togglePopUp(${pokemon.id}, '${pokeName}', '${bgColor}')">
            <div class="name-div">
                <h2 class="left">#${pokemon.id}</h2>
                <h2 class="center">${pokeName}</h2>
            </div>
            <div class="pokemon-image ${bgColor}">
                <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}-image"/>
            </div>
            <div class="pokemon-icons">${icons}</div>
       </div>
    `;
}

function addElementIcons(types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        let type = types[i].type.name;
        html = html + `
            <i class="${type}-icon icon-size"></i>
        `;
    }
    return html;
}

function addLoadMoreButton() {
    return `
        <button type="button" class="btn btn-light" onclick="loadMore()">Load more</button>
    `;
}

async function renderPopUp(data, pokeName, bgColor) {
    let abilities = "";
    let evoData = await getEvolutionChain(data.id)
    let evoHTML = renderEvoChain(evoData);
    for (let i = 0; i < data.abilities.length; i++) {
        if (i === data.abilities.length - 1) {
            abilities += data.abilities[i].ability.name;
            break;
        }
        abilities += data.abilities[i].ability.name + ", ";
    }
    let icons = addElementIcons(data.types);
    let html = `
        <div class="name-div pad-15"><h2 class="left">#${data.id}</h2><h2 class="center">${pokeName}</h2><i class="x-btn" onclick="closePopUp()">x</i></div>
        <div class="${bgColor} img-center"><img class="card-img-top pad-15" src="${data.sprites.other.dream_world.front_default}" alt="Card image cap"></div>
        <div class="card-body">
            <div class="pokemon-popup-icons">${icons}</div>
            <div class="tab-bar">
                <div class="tab tab-active" id="tab-main" onclick="showTab('main')">Main</div>
                <div class="tab" id="tab-stats" onclick="showTab('stats')">Stats</div>
                <div class="tab" id="tab-evo" onclick="showTab('evo')">Evolution</div>
            </div>    
        </div>
        <div id="tab-content-main" class="tab-content">
            <div class="info-text">
                <h2 class="height-h2">Height:</h2>
                <h2 class="height-h2">Weight:</h2>
                <h2 class="height-h2">Base esperience:</h2>
                <h2 class="height-h2">Abilities:</h2>
            </div>
            <div class="info-text">
                <h2 class="height-h2">${data.height} m</h2>
                <h2 class="height-h2">${data.weight} kg</h2>
                <h2 class="height-h2">${data.base_experience}</h2>
                <h2 class="height-h2">${abilities}</h2>
            </div>
        </div>
        <div id="tab-content-stats" class="tab-content d-none">
            <div class="info">
                <div class="stats">
                    <h2 class="height-h2">HP:</h2>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.stats[0].base_stat}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="stats">
                    <h2 class="height-h2">Attack:</h2>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.stats[1].base_stat}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="stats">
                    <h2 class="height-h2">Defense:</h2>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.stats[2].base_stat}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="stats">
                    <h2 class="height-h2">Special-Attack:</h2>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.stats[3].base_stat}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="stats">
                    <h2 class="height-h2">Special-Defense:</h2>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.stats[4].base_stat}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="stats">
                    <h2 class="height-h2">Speed:</h2>
                    <div class="progress">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.stats[5].base_stat}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="tab-content-evo" class="tab-content d-none">
            <div class="evo-chain">
                ${evoHTML}
            </div>
        </div>
    `;
    document.getElementById("more-infos").innerHTML = html;
}

function renderEvoChain(data) {
    let html = "";
    let arrow = "<i class='arrow-right-icon'></i>";
    for (let i = 0; i < data.length; i++) {
        if (i === data.length - 1) {
            arrow = "";
        }
        html += `
            <div class="evo">
                <img src="${data[i].svg}" alt="${data[i].name}-image"/>
                <h2>${data[i].upperName}</h2>
            </div>
            ${arrow}
        `;
    }
    return html;
}

function closePopUp() {
    document.getElementById("poke-popup").classList.add("d-none");
    document.getElementById("more-infos").innerHTML = `
                <div class="text-center spinner-center overlay">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                `;
}

function renderError(value) {
    if (value === 0){
        document.getElementById("noPokemon").classList.add("d-none");
        document.getElementById("pokedex").classList.remove("d-none");
        document.getElementById("load-more").classList.remove("d-none");
        document.getElementById("search-pokedex").classList.add("d-none");
    } else {
        document.getElementById("noPokemon").classList.remove("d-none");
        document.getElementById("pokedex").classList.add("d-none");
        document.getElementById("load-more").classList.add("d-none");
        document.getElementById("search-pokedex").classList.add("d-none");
    }
}

function showSearchResults() {
    document.getElementById("search-pokedex").classList.remove("d-none");
    document.getElementById("pokedex").classList.add("d-none");
    document.getElementById("load-more").classList.add("d-none");
}