import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import data from '../data';
import FavoritePokemons from '../pages/FavoritePokemons';
import renderWithRouter from '../renderWithRouter';

const POKEMONS = [data[0], data[1]];
const FIRST_POKEMON = data[0];

describe('Tests for page FavoritePokemons', () => {
  it('the message No favorite pokemon found is displayed on the screen', () => {
    renderWithRouter(<FavoritePokemons />);

    const notFound = screen.getByText('No favorite pokemon found');
    expect(notFound).toBeInTheDocument();
  });

  it('render pokemons on the screen', () => {
    renderWithRouter(<FavoritePokemons pokemons={ POKEMONS } />);

    POKEMONS.forEach((pokemon, index) => {
      const { averageWeight: { measurementUnit, value }, name, type, image } = pokemon;
      const weightModel = `Average weight: ${value} ${measurementUnit}`;

      const namePokemon = screen.getAllByTestId('pokemon-name');
      const typePokemon = screen.getAllByTestId('pokemon-type');
      const weightPokemon = screen.getAllByTestId('pokemon-weight');
      const imagePokemon = screen.getByAltText(`${name} sprite`);

      expect(namePokemon[index].innerHTML).toBe(name);
      expect(typePokemon[index].innerHTML).toBe(type);
      expect(weightPokemon[index].innerHTML).toBe(weightModel);
      expect(imagePokemon).toBeInTheDocument();
      expect(imagePokemon.src).toBe(image);
    });
  });

  it('adding and removing pokemon to favorites', () => {
    renderWithRouter(<App />);
    const { averageWeight: { measurementUnit, value }, name, type,
      image } = FIRST_POKEMON;

    const favoritePokemonsLink = screen.getByRole('link', { name: /favorite pokémons/i });
    let moreDetailsLink = screen.getByRole('link', { name: /more details/i });
    userEvent.click(moreDetailsLink);

    let favoriteCheckbox = screen.getByLabelText(/pokémon favoritado?/i);
    userEvent.click(favoriteCheckbox);
    expect(moreDetailsLink).not.toBeInTheDocument();

    userEvent.click(favoritePokemonsLink);
    moreDetailsLink = screen.getByRole('link', { name: /more details/i });
    expect(moreDetailsLink).toBeInTheDocument();

    const { innerHTML: namePokemon } = screen.getByTestId('pokemon-name');
    const { innerHTML: typePokemon } = screen.getByTestId('pokemon-type');
    const { innerHTML: weightPokemon } = screen.getByTestId('pokemon-weight');
    const { src: imagePokemon } = screen.getByAltText(`${name} sprite`);
    expect(namePokemon).toBe(name);
    expect(typePokemon).toBe(type);
    expect(weightPokemon).toBe(`Average weight: ${value} ${measurementUnit}`);
    expect(imagePokemon).toBe(image);

    moreDetailsLink = screen.getByRole('link', { name: /more details/i });
    userEvent.click(moreDetailsLink);

    favoriteCheckbox = screen.getByLabelText(/pokémon favoritado?/i);
    userEvent.click(favoriteCheckbox);

    userEvent.click(favoritePokemonsLink);
    const notFound = screen.getByText('No favorite pokemon found');
    expect(notFound).toBeInTheDocument();
  });
});
