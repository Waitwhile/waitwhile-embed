# @waitwhile/waitwhile-embed

This JavaScript widget allows you to seamlessly integrate [Waitwhile](https://waitwhile.com)’s powerful platform for queuing, appointments, and events directly into your website.
Whether you choose to embed Waitwhile inline or in a modal, you can now offer your customers a streamlined experience for managing their interactions with your business.

By embedding Waitwhile, you can create and manage customer journeys at scale, all from your website.
This [documentation](https://waitwhile-embed.web.app/getting-started/) will walk you through the steps to implement the Waitwhile Embed Widget, enabling you to unlock its full potential in just minutes.

## Requirements

Public Waitwhile registration pages.

## Usage

1. Include the script.
2. Create an instance of `Waitwhile.Embed` or `Waitwhile.Modal`.
3. Render it on the page using `instance.render()` or show modal using `dialog.show()`.

**Important:**

- Always use the "Latest Major" version from [JsDelivr](https://www.jsdelivr.com/package/npm/@waitwhile/waitwhile-embed).
- Do not self-host the script.

### Example: Embed

```html
<!-- The div where the Waitwhile widget will be rendered -->
<div id="waitwhile"></div>

<!-- Include the script -->
<script src="https://cdn.jsdelivr.net/npm/@waitwhile/waitwhile-embed/dist/waitwhile-embed.min.js"></script>

<!-- Create an instance of Waitwhile and render it on the page -->
<script>
  const waitwhile = Waitwhile.Embed({
    locationId: 'WAITWHILE_LOCATION_ID',
  });

  waitwhile.render('#waitwhile');
</script>
```

### Example: Modal

```html
<!-- Include the script -->
<script src="https://cdn.jsdelivr.net/npm/@waitwhile/waitwhile-embed/dist/waitwhile-embed.min.js"></script>

<button id="btn">Open Waitwhile</button>

<script>
  const { dialog } = Waitwhile.Modal({
    locationId: 'WAITWHILE_LOCATION_ID',
  });

  const btn = document.getElementById('btn');
  btn.addEventListener('click', () => {
    dialog.show();
  });
</script>
```

See the `/examples` directory for more examples.

## Contribute

We welcome contributions! If you have ideas for new features or spot any bugs, please [create an issue](https://github.com/Waitwhile/waitwhile-embed/issues/new).

Feel free to submit pull requests as well.

### Deploying a New Version

The following instructions are for users listed as owners of the npm package.

To check ownership, run `npm owner ls`.

1. Build the project:  
   `npm run build`

1. Update the package version (use semver `major`, `minor`, or `patch`):  
   `npm version [major | minor | patch]`

1. Commit your changes and push them, including the tag:  
   `git push && git push --tags`

1. Publish the new version to npm:  
   `npm publish`

1. Update docs in [Waitwhile/waitwhile-embed-docs](https://github.com/Waitwhile/waitwhile-embed-docs).
