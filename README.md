# @waitwhile/waitwhile-embed

Integrate [Waitwhile](https://waitwhile.com)'s queueing and booking registration flows seamlessly into any page.

## Requirements

Public Waitwhile registration pages.

## Usage

1. Include the snippet (check for latest version in package.json).
2. Create an instance of `Waitwhile.Embed`.
3. Render it on the page using `instance.render()`.

```html
<!-- The div where the Waitwhile widget will be rendered -->
<div id="waitwhile"></div>

<!-- Include the snippet -->
<script src="https://cdn.jsdelivr.net/npm/@waitwhile/waitwhile-embed@1.1.0/dist/waitwhile-embed.min.js"></script>

<!-- Create an instance of Waitwhile and render it on the page -->
<script>
  const waitwhile = Waitwhile.Embed({
    locationId: 'WAITWHILE_LOCATION_ID',
  });

  waitwhile.render('#waitwhile');
</script>
```

See the `/examples` directory for more examples.
