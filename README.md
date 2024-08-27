# @waitwhile/waitwhile-embed

Integrate [Waitwhile](https://waitwhile.com)'s queueing and booking registration flows seamlessly into any page.

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
