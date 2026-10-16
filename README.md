# Sizzle & Crisp Diner · Fast Food & Beverage Menu 🍔🍹

A modern, responsive fast food restaurant menu and contactless table-ordering web application built with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed specifically for fast-casual diners, featuring localized Kenyan Shillings (**KSh**) pricing, **Lipa na M-Pesa** mobile payment flows, and dynamic **QR Scan-to-Order** capabilities.

---

## ✨ Features

### 1. Complete Fast Food & Local Street Food Menu
- **Smash Burgers**: Double beef smash cheeseburgers, spicy crispy zinger chicken burgers, BBQ bacon stacks, and halloumi avocado veggie burgers.
- **Crispy Fried Chicken**: 24-hour marinated buttermilk fried chicken buckets, spicy wings, and hand-breaded tenderloins with signature dipping sauces.
- **Loaded Fries & Street Snacks**: Loaded peri-peri masala crinkle fries, cheesy garlic fries, crispy beef samosas, and potato bhajias with tamarind (*ukwaju*) chutney.
- **Nairobi Street Smocha**: Flaky chapati wrapped around a flame-grilled smoked sausage with fresh tomato-onion *kachumbari* and spicy pili pili sauce.
- **Value Combos & Family Feasts**: Multi-item meals with fries and drinks with built-in combo savings.

### 2. Comprehensive Beverage Lounge
- **Fresh Cold-Pressed Juices**: Pure Kenyan Passion Fruit, Sunshine Mango & Ginger, Watermelon Lime Hydrator, and Pineapple Mint Crush.
- **Chilled Sodas & Floats**: Chilled Stoney Tangawizi, Coca-Cola Zero Sugar, Fanta Passion, and old-school Vanilla Ice Cream Soda Floats.
- **Zero-Proof Mocktails (0.0% ABV)**: Passion & Mint Mojito Mocktail, Hibiscus Berry Spritz, and Tropical Sunrise Citrus Fizz.
- **Diner Cocktails**: The Original Nairobi Dawa Cocktail (with acacia honey and traditional wooden dawa stick), Spiced Rum Passion Punch, and Classic Long Island Iced Tea.
- **Cellar Wines & Sangria**: Cape Chenin Blanc, Robertson Cabernet Sauvignon, and Chilled Citrus-Berry Sangria carafes.

### 3. 📱 Contactless "Scan to Order on Phone"
- **Table QR Code Generator**: Generates clean, scannable SVG QR codes for every dining table (`Table 01`, `Table 04`, `Terrace 02`, etc.).
- **URL Parameter Detection**: Direct links (e.g., `?table=Table+04`) automatically assign the customer's table on mobile arrival with a welcome notification.
- **Copy Direct Link**: Share or bookmark table links for fast testing or digital guest directories.

### 4. 🇰🇪 Localized Kenyan Currency & M-Pesa Integration
- **Kenyan Shillings (KSh)**: Standardized currency formatting with tabular numeral alignment across all cards, modals, and drawers.
- **Payment Methods**:
  - **Lipa na M-Pesa Express**: Prompts for Kenyan phone number (`07XX...` / `+254...`) with automated STK push notification confirmation.
  - **Debit/Credit Card**: Visa and Mastercard support.
  - **Cash**: Pay at table or pickup counter.
- **Printable Thermal Receipt**: Dedicated "Print Receipt" button on the order confirmation screen formatting a clean, high-contrast, printer-friendly receipt using CSS print media queries.
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
