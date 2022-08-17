import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import data from '../data';
import renderWithRouter from '../renderWithRouter';

describe('Tests for page Pokedex', () => {
  it('contains an h2 heading with text Encountered pokémons', () => {
    renderWithRouter(<App />);

    const foundPokemons = screen.getByRole('heading', { name: 'Encountered pokémons',
      level: 2 });
    expect(foundPokemons).toBeInTheDocument();
  });

  it('when clicked on Próximo pokémon button, change pokemon', () => {
    renderWithRouter(<App />);
    const firstPokemon = data[0].name;

    const filterAll = screen.getByRole('button', { name: 'All' });
    expect(filterAll).toBeInTheDocument();
    userEvent.click(filterAll);

    const buttonNextPokemon = screen.getByRole('button', { name: 'Próximo pokémon' });
    expect(buttonNextPokemon).toBeInTheDocument();

    data.forEach(({ name }) => {
      const pokemon = screen.getByText(name);
      expect(pokemon).toBeInTheDocument();
      userEvent.click(buttonNextPokemon);
    });

    expect(screen.getByText(firstPokemon)).toBeInTheDocument();
  });

  it('There must be a filter button for each type of pokemon, without repetition', () => {
    renderWithRouter(<App />);
    const NUMBER_OF_FILTERS = 7;
    const FILTERS = ['Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];

    const filterButtons = screen.getAllByTestId('pokemon-type-button');
    expect(filterButtons).toHaveLength(NUMBER_OF_FILTERS);

    filterButtons.forEach((filter, index) => {
      expect(filter.innerHTML).toBe(FILTERS[index]);
    });
  });
});
