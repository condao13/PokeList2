document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById('pokemon-list');
    const modal = document.getElementById('pokemon-modal');
    const modalContent = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close');
    const pokemonDetails = document.getElementById('pokemon-details');

    const loadPokemon = async () => {
        const url = 'https://pokeapi.co/api/v2/pokemon?limit=151';
        const response = await fetch(url);
        const data = await response.json();
        const pokemons = data.results;

        pokemons.forEach(async (pokemon) => {
            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();

            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');

            pokemonCard.innerHTML = `
                <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
                <h2>${capitalize(pokemonDetails.name)}</h2>
            `;

            pokemonCard.addEventListener('click', () => {
                showPokemonDetails(pokemonDetails);
            });

            pokemonList.appendChild(pokemonCard);
        });
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const showPokemonDetails = (pokemon) => {
        pokemonDetails.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${capitalize(pokemon.name)}</h2>
            <p><strong>Height:</strong> ${pokemon.height}</p>
            <p><strong>Weight:</strong> ${pokemon.weight}</p>
            <p><strong>Type:</strong> ${pokemon.types.map(typeInfo => capitalize(typeInfo.type.name)).join(', ')}</p>
        `;
        modal.style.display = 'block';
    };

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    loadPokemon();
});
