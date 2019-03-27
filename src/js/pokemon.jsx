import React, { Component } from 'react';
const request = require('axios');

class Pokemons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            abilitys: [],
            showModal: false,
            image: '',
            name: '',
            type: '',
            profile: {},
            stats: [],

        };
    }

    handleCloseModal(event) {
        if (event.target !== event.currentTarget) {
            return;
        }
        //console.log(event.target);
        //console.log(event.currentTarget);
        this.setState({
            showModal: false,
        });
    }

    showOnePokemon(id, event) {
        request.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
            .then(response => {

                let profile = {}
                profile.height = response.data.height
                profile.weight = response.data.weight
                profile.base_experience = response.data.base_experience

                let abilityArray = [];
                response.data.abilities.forEach((ability) => {
                    abilityArray.push(ability.ability.name)
                });

                let typeArray = [];
                response.data.types.forEach((type) => {
                    typeArray.push(type['type'].name)
                });

                let stats = [];
                response.data.stats.forEach((stat) => {
                    stats.push({ statNum: stat.base_stat, statName: stat.stat.name })
                    console.log(stat.base_stat)
                    console.log(stats)

                });
                console.log(response.data)
                this.setState({
                    abilitys: abilityArray,
                    showModal: true,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    name: response.data.name,
                    type: typeArray,
                    profile: profile,
                    stats: stats,
                })
            });
    }

    render() {
        const { showModal, abilitys, image, name, type, profile, stats } = this.state
        const { height, weight, base_experience } = profile

        return (
            <span style={containerStyles}>
                {showModal && (
                    <div onClick={this.handleCloseModal.bind(this)} style={overlayStyles}>
                        <div style={modalStyles}>
                            <button style={{ float: 'right' }} onClick={this.handleCloseModal.bind(this)}>Close</button>
                            <img alt="" src={image} />
                            <h2 className="pokemonH2">{name}</h2>
                            <div className="flexWrapp">
                                <div className="flexInner2">
                                    <h3>Profile:</h3>
                                    <ul>
                                        <li><strong>Height:</strong> {height}</li>
                                        <li><strong>Weight:</strong> {weight}</li>
                                        <li><strong>Base exp:</strong> {base_experience}</li>
                                    </ul>
                                </div>
                                <div className="flexInner2">
                                    <h3>Abilitys:</h3>
                                    <ul>
                                        {abilitys.map(ability => (
                                            <li>{ability}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flexInner2">
                                    <h3>Type:</h3>
                                    <ul>
                                        {type.map(type => (
                                            <li>{type}</li>
                                        ))}

                                    </ul>
                                </div>
                                <div className="flexInner2">
                                    <h3>Stat:</h3>
                                    <ul>

                                        {stats.map(stat => (
                                            <li><strong>{stat.statName}:</strong> {stat.statNum}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
                <ul style={flexwrapper}>
                    {this.props.pokemons.map((pokemon) => (
                        <li onClick={this.showOnePokemon.bind(this, pokemon.id)} key={pokemon.id} className="pokemonBox">
                            <img alt="" src={pokemon.image} />
                            <p>(#{pokemon.id}) {pokemon.name}</p>
                            <p>{pokemon.type}</p>
                        </li>

                    ))}
                </ul>
            </span>
        );
    }
}
let flexwrapper = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    listStyle: 'none',
    padding: '0'
}
const modalStyles = {
    backgroundColor: '#dae6f7',
    borderRadius: '5px',
    maxWidth: '70vw',
    minHeight: '70vh',
    margin: ' 10px auto',
    padding: '10px',
};
const overlayStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgb(0, 0, 0, 0.3)',
}

const containerStyles = {
    height: '100vh',
    width: '100vw'
};



export default Pokemons;
