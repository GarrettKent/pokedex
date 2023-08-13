const pokedex = document.getElementById('pokedex');
const pokemonDetail = document.getElementById('pokemonDetail');


const grabAllPokemon = () => {
    const allPokemonArray = [];

    for (let i = 1; i <= 151; i++) {
        allPokemonArray.push(
            fetch('https://pokeapi.co/api/v2/pokemon/' + i + '/').then((response) => response.json()));
    }
    Promise.all(allPokemonArray).then((results) => {
        let allPokemon = []
        results.map(o => {
            let pokemon = {
                'name' : capitalizeName(o.name),
                'image' : o.sprites['front_default'],
                'type' : o.types.map((type) => capitalizeName(type.type.name)).join(', '),
                'id' : o.id,
            }
            allPokemon.push(pokemon);
        })
        createPokemonCard(allPokemon);
    });
};


const createPokemonCard = (allPokemon) => {
    
    const pokemonHTMLString = allPokemon.map((x) => `
        <div class="col-auto mb-3">
            <div class="card shadow-lg" style="width: 16rem;">
                <img src="${x.image}" class="card-img-top" alt="${x.name}">
                <div class="card-body bg-light text-dark">
                    <h4 class="card-title">${x.id}. ${x.name}</h4>
                    <p class="card-text">Type: ${x.type}</p>
                    <button data-toggle="modal" data-target="#myModal" type="button"
                        class="btn btn-info m-0" onclick="getPokemonDetails(${x.id})">Details
                    </button>
                </div>
            </div>
        </div>
        `
    ).join('');
    console.log(pokemonHTMLString);
    pokedex.innerHTML = pokemonHTMLString;
}

const getPokemonDetails = (pokemonId) => {
    // console.log('getPokemonDetails(): ' + event.detail.value);
    console.log('getPokemonDetails(): ' + pokemonId);

    fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonId + '/')
    .then((response) => response.json())
    .then((data) => {
        let pokemon = {
            'name' : capitalizeName(data.name),
            'image' : data.sprites['front_default'],
            'type' : data.types.map((type) => capitalizeName(type.type.name)).join(', '),
            'id' : data.id,
            // 'stats' : data.stats,
            // 'moves' : moveList.sort((a, b) => (a.level > b.level) ? 1 : -1)
        }
        
        let index = 0;
        let moveList = [];
        data.moves.forEach(o => {
            fetch(o.move.url)
            .then((response) => response.json())
            .then((data2) => {
                if(o.version_group_details[0]['move_learn_method'].name == 'level-up'){
                    moveList.push({
                        'name' : capitalizeName(o.move.name),
                        'level' : o.version_group_details[0].level_learned_at,
                        'accuracy' : data2.accuracy == null ? 'N/A' : data2.accuracy,
                        'power' : data2.power == null ? 'N/A' : data2.power,
                        'pp' : data2.pp,
                        'moveType' : capitalizeName(data2.damage_class.name),
                    })
                    index++;

                    // let moveListString = JSON.stringify(moveList)
                }
            })
            .then(() => {

                test(moveList, pokemon)
            })
        })
    })
}

// function test2

const test = (moveList, pokemon) => {
    pokemon.moves = moveList
    console.log('Pokemon: ' + JSON.stringify(pokemon,undefined,3));
}



const capitalizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
