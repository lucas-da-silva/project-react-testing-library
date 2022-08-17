import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import data from '../data';
import renderWithRouter from './renderWithRouter';

describe('Tests for page PokemonDetails', () => {
  it('the detailed information of the selected pokemon is shown on the screen', () => {
    renderWithRouter(<App />);
    const firstPokemon = data[0];
    const { name, summary } = firstPokemon;

    const detailsPokemonLink = screen.getByRole('link', { name: /more details/i });
    userEvent.click(detailsPokemonLink);

    const pokemonDetailsText = screen.getByText(`${name} Details`);
    expect(pokemonDetailsText).toBeInTheDocument();
    expect(detailsPokemonLink).not.toBeInTheDocument();

    const summaryHeading = screen.getByRole('heading', { name: 'Summary', level: 2 });
    const summaryResumeText = screen.getByText(summary);
    expect(summaryHeading).toBeInTheDocument();
    expect(summaryResumeText).toBeInTheDocument();
  });

  it('there is a section on the page with maps containing the pokémons locations', () => {
    renderWithRouter(<App />);
    const firstPokemon = data[0];
    const { foundAt, name: namePokemon } = firstPokemon;

    const detailsPokemonLink = screen.getByRole('link', { name: /more details/i });
    userEvent.click(detailsPokemonLink);

    const locationsHeading = screen.getByRole('heading', {
      name: `Game Locations of ${namePokemon}`,
      level: 2,
    });
    expect(locationsHeading).toBeInTheDocument();

    foundAt.forEach(({ location }) => {
      const nameMap = screen.getByText(location);
      expect(nameMap).toBeInTheDocument();
    });

    const imagesMaps = screen.getAllByAltText(`${namePokemon} location`);
    imagesMaps.forEach(({ src }, index) => {
      expect(src).toBe(foundAt[index].map);
    });

    expect(imagesMaps).toHaveLength(foundAt.length);
  });

  it('the user can favorite a pokemon through the details page', () => {
    renderWithRouter(<App />);

    const detailsPokemonLink = screen.getByRole('link', { name: /more details/i });
    userEvent.click(detailsPokemonLink);

    const favoritePokemonInput = screen.getByLabelText('Pokémon favoritado?');
    expect(favoritePokemonInput).toBeInTheDocument();
  });
});
