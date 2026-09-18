# Kent Furniture — kentfurniture.pk

Website for Kent Furniture, Hyderabad. Making furniture since 1999, Kent Furniture since 2005.

## What's in here

```
site/                    Static Theme D homepage — the approved design
  index.html
  assets/css/site.css    All styling and design tokens
  assets/js/site.js      Reveal animations, search filter, cart counter
  assets/img/            Watermarked product photography
  assets/logo/

wordpress/
  kent-child/            Blocksy child theme — the live site
    style.css            Kent design tokens, buttons, badges, mobile bar
    functions.php        Product codes, dimensions, two buying journeys,
                         sticky WhatsApp, PKR formatting

data/
  woocommerce-products.csv   15 products ready to import
  product-images/            Images referenced by the CSV
  catalogue.json             Source data
```

## Installing on WordPress

1. Install and activate **Blocksy** (free) from Appearance → Themes → Add New
2. Install **Blocksy Companion** when prompted
3. Zip the `wordpress/kent-child/` folder and upload it via Appearance → Themes → Add New → Upload Theme
4. Activate **Kent Furniture**
5. Install **WooCommerce**
6. WooCommerce → Products → Import → upload `data/woocommerce-products.csv`
7. Upload everything in `data/product-images/` to Media Library first, or place it in `wp-content/uploads/` before importing

## Two buying journeys

- **Product has a price** → Add to Cart → Checkout → COD or bank transfer
- **Product has no price** → "Price on request" + WhatsApp enquiry button with the product name and code pre-filled

This is handled automatically in `functions.php`. To move a product from one journey to the other, add or remove its price.

## ⚠️ Before going live

Every **price** and every **dimension** in `woocommerce-products.csv` is a **placeholder**.
They exist so the layout and import can be tested. Replace all 15 with real measured
values before the site accepts a single order.

## Standing rules

- Never claim "warranty" — say after-sales support
- Never claim free delivery or home assembly
- Product widths stay at or under 48 inches
- All product images carry the centered Kent watermark
- Published dimensions must be measured, never estimated

## Contact

WhatsApp +92 335 7779940 · kentfurniture007@gmail.com
Shop #2145, Hilltop Incline, Cantt, Hyderabad, Sindh
