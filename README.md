# Komplekrumah

A browser-based interactive 3D neighborhood exploration project, ready for a new map source.

## Current state: reset

The previous conceptual 3D map and all procedural building/road scene code have been removed at the user's request. The production page now shows a clean placeholder until a replacement map is selected.

**There is currently no active map, house model, real-world site plan, or location dataset in the project.**

## Project infrastructure

- GitHub: [eltonmalumbot/komplekrumah](https://github.com/eltonmalumbot/komplekrumah)
- Vercel: [komplekrumah.vercel.app](https://komplekrumah.vercel.app)
- Hosting: static HTML/CSS on Vercel, auto-deployed from the main branch
- No dependencies or runtime secrets

## Next stage

Use the next user-provided map/site plan and location references to build a grounded 3D reconstruction. Do not assume the old neighborhood, roads, or object coordinates. Confirm source accuracy and permissions before using third-party map data.

Run locally with `python3 -m http.server 8080` or any local static HTTP server.
