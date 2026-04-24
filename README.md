# WaunaMesh Website

Static website for WaunaMesh, a Waunakee-area community mesh radio project and extension of the Madison Mesh community.

The site explains what WaunaMesh is and how neighbors can get started with MeshCore.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Main public landing page for WaunaMesh. |
| `getting-started.html` | Beginner guide for joining Discord, picking hardware, flashing MeshCore, installing the app, and sending a first message. |
| `hosting.html` | Property owners who may be able to host a node. |
| `other-meshes.html` | Links to Madison Mesh, MeshCore, Meshconsin, and other mesh communities for inspiration and learning. |
| `LICENSE.md` | License and attribution notes for the site content. |

## Project structure

```text
.
|-- index.html
|-- getting-started.html
|-- hosting.html
|-- other-meshes.html
|-- LICENSE.md
|-- favicon.ico
`-- assets
    |-- css
    |   `-- styles.css
    |-- js
    |   `-- site.js
    `-- img
        |-- madmesh
        `-- waunamesh
```

## Local development

Nothing to build. This is a static site.

## Editing notes

- Main styles are in `assets/css/styles.css`.
- Shared navigation behavior is in `assets/js/site.js`.
- WaunaMesh-specific images are in `assets/img/waunamesh/`.
- Madison Mesh images and logo are in `assets/img/madmesh/`.
- The footer is repeated in each HTML file. Update all pages when changing footer links, attribution, or resource links.
- Keep MeshCore resource links pointed to the official MeshCore site at `https://meshcore.io/`.
- Keep the site focused on general onboarding, not full technical build documentation.

## Key links used by the site

- Madison Mesh: https://madmesh.net/
- Madison Mesh Discord: https://discord.gg/fd3JUZc2CN
- MeshMapper: https://msn.meshmapper.net/
- MeshCore: https://meshcore.io/
- MeshCore Web Flasher: https://flasher.meshcore.io/
- WaunaMesh GitHub: https://github.com/thatdecade/waunamesh.net

## License and attribution

Website content is licensed under CC BY-SA 4.0 unless otherwise noted. See `LICENSE.md`.

This site includes adapted content and design inspiration from Madison Mesh. The Madison Mesh logo is used to show WaunaMesh as the Waunakee-area extension of the Madison Mesh community.

Some included assets may come from third-party templates or icon sources. Those assets retain their original licenses and should not be treated as CC BY-SA unless their source license explicitly allows it.
