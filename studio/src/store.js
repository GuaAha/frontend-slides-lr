import { clone } from './core.js';

const SESSION_KEY = 'lr-brand-studio:session:v1';
const VERSIONS_KEY = 'lr-brand-studio:versions:v1';
const MAX_VERSIONS = 24;

export function loadSession() {
  try {
    const value = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return value?.deck || null;
  } catch {
    return null;
  }
}

export function saveSession(deck) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ deck, savedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export function listVersions() {
  try {
    return JSON.parse(localStorage.getItem(VERSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function commitVersion(deck, label) {
  const versions = listVersions();
  const signature = JSON.stringify(deck);
  if (versions[0]?.signature === signature) return versions;
  versions.unshift({
    id: crypto.randomUUID(),
    label,
    createdAt: new Date().toISOString(),
    signature,
    deck: clone(deck),
  });
  const limited = versions.slice(0, MAX_VERSIONS);
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(limited));
  } catch {
    // The current document remains editable even when an embedded image exhausts storage.
  }
  saveSession(deck);
  return limited;
}

export function restoreVersion(id) {
  const version = listVersions().find((item) => item.id === id);
  return version ? clone(version.deck) : null;
}

export function clearStudioStorage() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(VERSIONS_KEY);
}
