# Temporary gallery images

These photos are bundled locally for the static frontend preview. They are replaceable placeholders, not outputs of AILOUVRE's configured image models. Five presentation entries reuse three photos to mirror the repeated outer frames in the prototype.

| Local file | Original image source |
| --- | --- |
| `lavender-field.jpg` | [Lavender field on Unsplash](https://images.unsplash.com/photo-1499002238440-d264edd596ec) |
| `botanical-blossoms.jpg` | [Golden flowers on Unsplash](https://images.unsplash.com/photo-1490750967868-88aa4486c946) |
| `botanical-foliage.jpg` | [Green foliage on Unsplash](https://images.unsplash.com/photo-1518531933037-91b2f5f229cc) |

Downloaded as square JPEG crops at 1000px for the featured lavender image and 900px for the neighbours. See the [Unsplash license](https://unsplash.com/license) for the source terms. The frontend loads these files from `/artworks` and makes no requests to Unsplash at runtime.
