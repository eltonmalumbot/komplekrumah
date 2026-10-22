# Pasai Timur — Neighborhood Explorer

Interactive 3D web exploration concept based on the road rhythm in a user-provided Google Maps screenshot of Cluster Pasai Timur, Modernland Cilejit (approximate map center -6.3478562, 106.5167093).

## Current release

- Orbiting 3D drone camera and ground-level free exploration
- Procedurally modeled one-storey house massing and plotted neighborhood, garden plants, access roads, lamps, entry gateway, and approximate peripheral water channel
- Mini-map, clickable house inspection, day/evening toggle, touch joystick for mobile
- Vercel-ready static files; zero build step

## Sources

- [Google Maps reference](https://www.google.com/maps/@-6.3478562,106.5167093,17.75z)
- [Street View / place reference](https://www.google.com/maps/place/Cluster+Pasai+Timur+-+Modernland+Cilejit/@-6.347368,106.5171061,54a,75y,230.16h,85.97t/)
- SiKumbang Modernland Cilejit housing descriptions: reference to RS 22/60 and RS 27/72 roof and wall materials.

## Accuracy disclaimer

**This is a conceptual reconstruction, not surveyed GIS, cadastral layout, photogrammetry, a parcel ownership dataset, or literal Street View reproduction.** House IDs #001–#096 are internal scene objects, not actual addresses. The input screenshot identifies general road rhythm only, not verified parcel positions, road widths or exact building types.

## Development

Serve repository root over HTTP, for example:

```bash
python3 -m http.server 8080
```

Visit http://localhost:8080. Network access to jsDelivr is required for Three.js ES modules, and Google Fonts for optional typefaces.

## Next modeling milestones

1. Obtain an authoritative site plan or licensed orthophoto; rectify the road network with real dimensions.
2. Obtain consented reference photos of typical house frontage and model reusable GLB assets.
3. Optimize draw calls with instancing, occlusion and lod; benchmark real mid-range mobile phones.
4. Add walk-mode collisions, route navigation and location labels aligned to a verified plan.
5. Add browser automated tests and deployment preview checks.

## Stack

HTML5 / CSS / JavaScript ES modules / Three.js (CDN). No server, database, authentication, or commercial offerings.
