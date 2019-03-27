
import Pokemons from './pokemon.jsx';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import '../index.css';
const React = require('react');
const sortBy = require('sort-by')
const request = require('axios');

const pokemonTypes = [
  {
    "id": 1,
    "name": "normal",
    "url": "https://pokeapi.co/api/v2/type/1/"
  },
  {
    "id": 2,
    "name": "fighting",
    "url": "https://pokeapi.co/api/v2/type/2/"
  },
  {
    "id": 3,
    "name": "flying",
    "url": "https://pokeapi.co/api/v2/type/3/"
  },
  {
    "id": 4,
    "name": "poison",
    "url": "https://pokeapi.co/api/v2/type/4/"
  },
  {
    "id": 5,
    "name": "ground",
    "url": "https://pokeapi.co/api/v2/type/5/"
  },
  {
    "id": 6,
    "name": "rock",
    "url": "https://pokeapi.co/api/v2/type/6/"
  },
  {
    "id": 7,
    "name": "bug",
    "url": "https://pokeapi.co/api/v2/type/7/"
  },
  {
    "id": 8,
    "name": "ghost",
    "url": "https://pokeapi.co/api/v2/type/8/"
  },
  {
    "id": 9,
    "name": "steel",
    "url": "https://pokeapi.co/api/v2/type/9/"
  },
  {
    "id": 10,
    "name": "fire",
    "url": "https://pokeapi.co/api/v2/type/10/"
  },
  {
    "id": 11,
    "name": "water",
    "url": "https://pokeapi.co/api/v2/type/11/"
  },
  {
    "id": 12,
    "name": "grass",
    "url": "https://pokeapi.co/api/v2/type/12/"
  },
  {
    "id": 13,
    "name": "electric",
    "url": "https://pokeapi.co/api/v2/type/13/"
  },
  {
    "id": 14,
    "name": "psychic",
    "url": "https://pokeapi.co/api/v2/type/14/"
  },
  {
    "id": 15,
    "name": "ice",
    "url": "https://pokeapi.co/api/v2/type/15/"
  },
  {
    "id": 16,
    "name": "dragon",
    "url": "https://pokeapi.co/api/v2/type/16/"
  },
  {
    "id": 17,
    "name": "dark",
    "url": "https://pokeapi.co/api/v2/type/17/"
  },
  {
    "id": 18,
    "name": "fairy",
    "url": "https://pokeapi.co/api/v2/type/18/"
  }
]

const API_URL = 'https://pokeapi.co/api/v2'

function getPokemonsByTypeId(typeId) {
  return fetch(API_URL + '/type/' + typeId)
    .then((response) => response.json())
    .then((data) => data.pokemon);
}


class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          {/* Navigation / Header */}
          <Header />

          {/* Main content */}
          <Route path="/" exact component={AllPokemons} />
          <Route path="/info" component={Info} />
        </div>
      </Router>
    );
  }
}

class AllPokemons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      pokemons: [],
      sortBy: 'name',
      filter: ''
    };
  }
  handleSort(field, event) {
    event.preventDefault();
    this.setState({
      sortBy: field
    })
  }

  handleKeyDown(event) {
    //console.log(this.refs.searchInput.value, event.target.value)
    this.setState({
      filter: event.target.value
    })
  }

  handleFilter(field, event) {
    event.preventDefault();
    this.setState({
      filter: field
    })
  }
  handleFilterByType(typeId, event) {
    getPokemonsByTypeId(typeId)
      .then((pokemons) => {
        const mapPokemonResult = pokemons.map(pokemon => {
          console.log(pokemon.pokemon)
          pokemon.pokemon.id = pokemon.pokemon.url.slice(34, -1)
          pokemon.pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon.id}.png`
          return pokemon.pokemon
        })
        this.setState({
          pokemons: mapPokemonResult
        })
      });
  }

  handleFilterByName() {
    request.get('https://pokeapi.co/api/v2/pokemon/?limit=1000')
      .then(response => {
        const pokemonResult = response.data.results
        const mapPokemonResult = pokemonResult.map((result) => {
          result.id = result.url.slice(34, -1)
          result.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`
          return result
        })
        this.setState({
          pokemons: mapPokemonResult

        })
      });
  }
  componentDidMount() {
    this.handleFilterByName()
  }

  render() {

    const pokemons = this.state.pokemons
      .slice()
      .sort(sortBy(this.state.sortBy))
      .filter(pokemon => this.state.filter === '' ? pokemon : pokemon.name.includes(this.state.filter));

    return (
      <div className="PokemonWrapp">
        <div className="flexWrapp">
          <div className="flexInner">
            <h2>Find by name</h2>
            <input
              ref="searchInput"
              type="text"
              placeholder="Input name"
              className="form-control"
              onKeyUp={this.handleKeyDown.bind(this)}
            />
          </div>
          <div className="flexInner">
            <h2>Sort them: </h2>
            <button onClick={this.handleSort.bind(this, 'name')} > Sort by name</button>
            <button onClick={this.handleSort.bind(this, 'id')} > Sort by id</button>
          </div>
        </div>
        <div className="center">
          <h2>Filter:</h2>
          <button onClick={this.handleFilterByName.bind(this)}>All</button>
          {pokemonTypes.map((type) => (
            <button onClick={this.handleFilterByType.bind(this, type.id)}>{type.name}</button>
          ))}
        </div>
        <Pokemons pokemons={pokemons} />
      </div>
    );
  }
};

export default App;

class Info extends React.Component {
  render() {
    return (
      <div className="center">
        <h1>Info</h1>
        <p>Some info about Pokemons</p>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className="headerWrapp">
        <h1>Pokemon!</h1>
        <ul>
          <li> <Link to="/">Pokemons</Link></li>
          <li><Link to="/info">Info</Link></li>
        </ul>
      </div>
    );
  }
}
