import giveYourSoul from './animations/give-your-soul/manifest.js';
import planetB from './animations/planet-b/manifest.js';
import planetBChallenge from './animations/planet-b-challenge/manifest.js';

// Paths in `files` are relative to the package root, not a specific server.
// The host decides how to serve/copy those files and construct public URLs.
export const DANCE_MANIFESTS = Object.freeze([giveYourSoul, planetB, planetBChallenge]);
export default DANCE_MANIFESTS;
