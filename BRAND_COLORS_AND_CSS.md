# Bridge Champions - Brand Colors & CSS

## Color Palette

### Primary Colors (Green - Main Brand)
- **Primary Green**: `#0F4C3A`
- **Primary Light**: `#1B6B52`
- **Primary Dark**: `#083426`

### Secondary Colors (Gold)
- **Gold**: `#D4AF37`
- **Gold Light**: `#E8C767`
- **Gold Dark**: `#B8941F`

### Accent Colors (Red - Card Suits)
- **Red/Hearts/Diamonds**: `#C41E3A`
- **Red Light**: `#E63956`
- **Red Dark**: `#8D0018`

### Neutral Colors
- **Dark Text**: `#1A1D23`
- **Gray Text**: `#64748B`
- **Light Gray**: `#E2E8F0`
- **Background**: `#F8FAFC`
- **White**: `#FFFFFF`

### Card Suits Colors
- **Hearts/Diamonds (Red)**: `#C41E3A`
- **Clubs/Spades (Black)**: `#1A1D23`

## CSS Variables (Complete)

```css
:root {
  /* Colors - Championship Theme */
  --color-primary: #0F4C3A;
  --color-primary-light: #1B6B52;
  --color-primary-dark: #083426;
  
  --color-secondary: #D4AF37;
  --color-secondary-light: #E8C767;
  --color-secondary-dark: #B8941F;
  
  --color-accent: #C41E3A;
  --color-accent-light: #E63956;
  --color-accent-dark: #8D0018;
  
  --color-dark: #1A1D23;
  --color-gray: #64748B;
  --color-light-gray: #E2E8F0;
  --color-bg: #F8FAFC;
  --color-white: #FFFFFF;
  
  /* Card suits colors */
  --color-hearts: #C41E3A;
  --color-diamonds: #C41E3A;
  --color-clubs: #1A1D23;
  --color-spades: #1A1D23;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #0F4C3A 0%, #1B6B52 100%);
  --gradient-gold: linear-gradient(135deg, #B8941F 0%, #E8C767 100%);
  --gradient-hero: linear-gradient(135deg, rgba(15, 76, 58, 0.95) 0%, rgba(8, 52, 38, 0.98) 100%);
  
  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Mono', 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 1.2rem;
  --text-sm: 1.4rem;
  --text-base: 1.6rem;
  --text-lg: 1.8rem;
  --text-xl: 2rem;
  --text-2xl: 2.4rem;
  --text-3xl: 3rem;
  --text-4xl: 3.6rem;
  --text-5xl: 4.8rem;
  --text-6xl: 6rem;
  
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Border Radius */
  --radius-sm: 0.4rem;
  --radius-md: 0.8rem;
  --radius-lg: 1.2rem;
  --radius-xl: 1.6rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

## Common Gradients Used

```css
/* Primary Green Gradient */
background: linear-gradient(135deg, #0F4C3A 0%, #1B6B52 100%);

/* Hero Section Background */
background: linear-gradient(135deg, #0F4C3A 0%, #083426 100%);

/* Gold Gradient */
background: linear-gradient(135deg, #D4AF37 0%, #E8C767 100%);

/* Hero Title Accent */
background: linear-gradient(135deg, #D4AF37 0%, #E8C767 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## Typography

- **Display Font**: 'Playfair Display', Georgia, serif (for headings)
- **Body Font**: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
- **Base Font Size**: 1.6rem (16px)
- **Line Height**: 1.6-1.8 for body text

## Key Design Elements

### Buttons
- Primary buttons use green gradient: `linear-gradient(135deg, #0F4C3A 0%, #1B6B52 100%)`
- Hover effects: slight lift (`transform: translateY(-2px)`) with enhanced shadow
- Border radius: `0.8rem` to `1.2rem`

### Cards
- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border radius: `0.8rem` to `1.2rem`
- Shadow: `0 4px 12px rgba(0, 0, 0, 0.08)`

### Hero Section
- Background: `linear-gradient(135deg, #0F4C3A 0%, #083426 100%)`
- Overlay with radial gradients for depth (gold and red accents at low opacity)
- Text color: `rgba(255, 255, 255, 0.9)`

## Homepage Hero Section CSS

```css
.HomePage-hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0F4C3A 0%, #083426 100%);
  color: #FFFFFF;
  padding: 6rem 2rem;
  overflow: hidden;
}

.HomePage-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(196, 30, 58, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
  pointer-events: none;
}

.HomePage-hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 6rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2rem;
  color: #FFFFFF;
}

.HomePage-hero-title-accent {
  background: linear-gradient(135deg, #D4AF37 0%, #E8C767 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.HomePage-hero-subtitle {
  font-size: 2.4rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  font-weight: 500;
}
```

## Quick Reference - Hex Colors

- **Primary Green**: `#0F4C3A`
- **Primary Light**: `#1B6B52`
- **Primary Dark**: `#083426`
- **Gold**: `#D4AF37`
- **Gold Light**: `#E8C767`
- **Red/Accent**: `#C41E3A`
- **Dark Text**: `#1A1D23`
- **Gray**: `#64748B`
- **Light Gray**: `#E2E8F0`
- **Background**: `#F8FAFC`
- **White**: `#FFFFFF`


