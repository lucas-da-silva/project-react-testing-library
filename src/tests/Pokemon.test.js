import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import data from '../data';
import renderWithRouter from './renderWithRouter';

describe('Tests for component Pokemon.js', () => {
  it('should be render a letter with the information of a certain pokémon', () => {
    renderWithRouter(<App />);
    const firstPokemon = data[0];
    const { averageWeight: { measurementUnit, value }, name, type, image } = firstPokemon;

    const namePokemon = screen.getByTestId('pokemon-name');
    const typePokemon = screen.getByTestId('pokemon-type');
    const weightPokemon = screen.getByTestId('pokemon-weight');
    const imagePokemon = screen.getByAltText(`${name} sprite`);

    expect(namePokemon.innerHTML).toBe(name);
    expect(typePokemon.innerHTML).toBe(type);
    expect(weightPokemon.innerHTML).toBe(`Average weight: ${value} ${measurementUnit}`);
    expect(imagePokemon).toBeInTheDocument();
    expect(imagePokemon.src).toBe(image);
  });

  it('should be contains a navigation link to view details for this pokemon', () => {
    const { history } = renderWithRouter(<App />);
    const firstPokemon = data[0];
    const { id } = firstPokemon;

    const detailsPokemon = screen.getByRole('link', { name: 'More details' });
    expect(detailsPokemon).toBeInTheDocument();
    userEvent.click(detailsPokemon);

    expect(history.location.pathname).toBe(`/pokemons/${id}`);
  });

  it('should be there a star icon in favorite pokemons', () => {
    renderWithRouter(<App />);

    const { innerHTML: namePokemon } = screen.getByTestId('pokemon-name');
    const detailsPokemon = screen.getByRole('link', { name: 'More details' });
    userEvent.click(detailsPokemon);

    const favoritePokemonLink = screen.getByLabelText('Pokémon favoritado?');
    expect(favoritePokemonLink).toBeInTheDocument();
    userEvent.click(favoritePokemonLink);

    const favoriteIcon = screen.getByAltText(`${namePokemon} is marked as favorite`);
    expect(favoriteIcon).toBeInTheDocument();
    expect(favoriteIcon.src).toBe('http://localhost/star-icon.svg');
  });
});
