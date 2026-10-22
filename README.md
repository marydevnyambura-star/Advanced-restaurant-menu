# Sizzle & Crisp Diner · Fast Food & Beverage Menu 🍔🍹

A modern, responsive fast food restaurant menu and contactless table-ordering web application built with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed specifically for fast-casual diners, featuring localized Kenyan Shillings (**KSh**) pricing, **Lipa na M-Pesa** mobile payment flows, and dynamic **QR Scan-to-Order** capabilities.

---

## ✨ Features

### 1. Complete Fast Food, African Cuisine & Sharing Platters
- **African Cuisine (Kenyan Specialties)**: Authentic charcoal-grilled *Nyama Choma* (beef/goat), *Mbuzi Choma*, *Ugali & Sukuma Wiki*, *Ugali with Lake Victoria Tilapia*, *Swahili Pilau*, *Mukimo*, *Githeri Special*, *Matoke Stew*, *Irio*, *Kuku Wet Fry*, *Kenyan Beef Wet Fry*, and *Traditional Power Breakfast* with portion sizes and accompaniments.
- **Food Platters & Sharing Boards**: *Sizzle Mega Family Feast Platter* (serves 4–6), *Nyama Choma Mixed Grill Board*, *24-piece Crispy Wings Platter* in 3 glazes, *Burger & Sliders Combo Platter*, *Coastal Seafood Platter*, *Garden Harvest Vegetarian Platter*, and *Nairobi Party Snack Platter*.
- **Premium Ice Cream & Desserts**: Golden Belgian buttermilk waffles with ice cream, fudgy brownie sizzler, 3-scoop artisan ice cream cups, New York berry cheesecake, classic banana splits, fluffy pancakes, and fresh tropical fruit salad with customizable scoops, flavors, and sauces.
- **Fast Food Smashers & Street Kings**: Double smash cheeseburgers, spicy zinger burgers, 24-hr buttermilk fried chicken buckets, loaded peri-peri masala crinkle fries, and authentic Nairobi smocha rolls.

### 2. Upgraded High-Resolution Beverage Lounge
- **Fresh Cold-Pressed Juices**: Pure Kenyan Passion Fruit, Thick Ripe Mango Juice, Sweet Watermelon & Lime, Fresh Squeezed Orange Juice, Pineapple Mint Crush, and Tropical Mixed Fruit Splash.
- **Milkshakes & Smoothies**: Rich Dark Chocolate Milkshakes, Madagascar Vanilla Bean Milkshakes, and Strawberry Bliss Greek Yogurt Smoothies.
- **Artisan Zero-Proof Mocktails**: Electric Blue Lagoon Mocktail, Virgin Passion & Mint Mojito, Pineapple & Coconut Virgin Colada, and Hibiscus Berry Spritz.
- **Diner Cocktails & Cellar Wines**: The Original Nairobi Dawa Cocktail (with pure acacia honey & dawa stick), Spiced Rum Passion Punch, Cape Chenin Blanc, and Robertson Cabernet Sauvignon.

### 3. 📱 Contactless "Scan to Order on Phone"
- **Real Camera-Scannable QR Codes**: Generates authentic, standards-compliant (ISO/IEC 18004) high-resolution QR codes that scan directly from any iPhone camera, Google Lens, or Android scanner without requiring any special app.
- **Table QR Code Generator**: Generates clean, scannable QR codes for every dining table (`Table 01`, `Table 04`, `Terrace 02`, etc.) with one-click PNG download for printing physical table tent cards.
- **URL Parameter Detection**: Direct links (e.g., `?table=Table+04`) automatically assign the customer's table on mobile arrival with a welcome notification.
- **Copy Direct Link**: Share or bookmark table links for fast testing or digital guest directories.

### 4. 🇰🇪 Localized Kenyan Currency & M-Pesa Integration
- **Kenyan Shillings (KSh)**: Standardized currency formatting with tabular numeral alignment across all cards, modals, and drawers.
- **Payment Methods**:
  - **Lipa na M-Pesa Express**: Prompts for Kenyan phone number (`07XX...` / `+254...`) with automated STK push notification confirmation.
  - **Debit/Credit Card**: Visa and Mastercard support.
  - **Cash**: Pay at table or pickup counter.
- **Printable Thermal Receipt**: Dedicated "Print Receipt" button on the order confirmation screen formatting a clean, high-contrast, printer-friendly receipt using CSS print media queries.
- **Recent Orders Log**: Stores the last 5 placed orders on the device in `localStorage`, accessible both from a dedicated footer section and an interactive modal. Users can view timestamps, item breakdowns, reprint receipts, or re-order past meals with a single click.
- **Bill Split Calculator**: Split totals evenly in KSh among 2 to 8 guests.
- **Crew Gratuity**: Quick tip selection (`50/=`, `100/=`, `150/=`, `200/=`, or custom).

### 5. 🛠 Kitchen & Bar Manager Mode
- **Live Inventory Toggle**: Mark any dish or beverage as *Available* or *86'd / Sold Out for Today*.
- **Quick Price Editing**: Inline adjustment of KSh prices in real time.
- **Menu Publisher**: Add new seasonal meals and drinks with custom pricing, categories, and tags.
- **Local Persistence**: All changes automatically sync to browser `localStorage`.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Builds the optimized production bundle in `dist/` |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with meta tags & Google fonts
├── metadata.json                # Project configuration & capabilities
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── index.css                # Tailwind CSS imports & global typography
│   ├── App.tsx                  # Master application component & state orchestrator
│   ├── types/
│   │   └── menu.ts              # Type definitions (Dish, CartItem, Order, DiningDetails)
│   ├── data/
│   │   └── initialMenu.ts       # Menu catalog with fast food & beverage inventory
│   ├── assets/
│   │   └── images/              # High-fidelity culinary photography assets
│   └── components/
│       ├── Header.tsx           # 3-zone top navigation bar
│       ├── Hero.tsx             # Hero banner with table assignment & mode switcher
│       ├── CategoryNav.tsx      # Segmented category filter tabs
│       ├── FilterBar.tsx        # Search, dietary tag buttons, and price sort
│       ├── DishCard.tsx         # Product presentation card with unboxed metadata
│       ├── DishModal.tsx        # Dish & drink customizer (PDP)
│       ├── CombosSection.tsx    # Value combos & meal deals showcase
│       ├── DrinksShowcaseSection.tsx # Dedicated beverage lounge explorer
│       ├── OrderDrawer.tsx      # Slide-over order tray, split calculator & M-Pesa
│       ├── OrderSuccessModal.tsx # Kitchen ticket tracker with live prep timer
│       ├── ScanToOrderModal.tsx # Dynamic SVG table QR code generator & link copy
│       ├── ManagerModal.tsx     # Kitchen inventory & pricing control panel
│       └── Footer.tsx           # Restaurant operating hours, contact & location
```

---

## 📄 License

This project is licensed under the **Apache-2.0** License.
