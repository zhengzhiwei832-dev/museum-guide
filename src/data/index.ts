import { forbiddenCity } from './museums/forbidden-city';
import { uffizi } from './museums/uffizi';
import { britishMuseum } from './museums/british-museum';
import { shaanxiHistory } from './museums/shaanxi-history';
import { sanxingdui } from './museums/sanxingdui';
import type { Museum } from './types';

export const museums: Museum[] = [forbiddenCity, shaanxiHistory, sanxingdui, uffizi, britishMuseum];

export function getMuseumById(id: string): Museum | undefined {
  return museums.find((m) => m.id === id);
}

export function getExhibitById(museumId: string, exhibitId: string) {
  const museum = getMuseumById(museumId);
  if (!museum) return undefined;
  const allExhibits = [...museum.highlights, ...museum.hiddenGems];
  return allExhibits.find((e) => e.id === exhibitId);
}

export type { Museum, Exhibit, Route, RouteStop, Floor, ExhibitPopularGuide, ExhibitEnthusiastGuide } from './types';
