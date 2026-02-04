# Game Assets

Store your static game assets here.

## Structure
- `/tilesets`: Images for maps, buildings, and UI sprites.
- `/sounds`: Audio files for sfx and music.

## Usage in Next.js
Files in `public` are served at the root path.

Example:
If you have a file at `public/assets/tilesets/grass.png`, access it in your code as:
```tsx
<img src="/assets/tilesets/grass.png" alt="Grass" />
```
