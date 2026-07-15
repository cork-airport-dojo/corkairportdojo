# CorkAirportDojo Design System

Version: 2.4

## Purpose

This document defines the visual and component rules for CorkAirportDojo.

The goal is to keep the product consistent, sharp, and professional across public pages, editorial pages.

## Product Direction

CorkAirportDojo should feel like professional software for students.


## Core Principles

### Content first

The UI supports the content.

Avoid decorative layers that compete with articles, modules, resources, or editor workflows.

### Consistency first

Similar interactions should look and behave the same across the app.

If one feature uses a card, dialog, toolbar, or inline error pattern, related features should reuse that approach.

### Reuse shared primitives

Prefer shared UI primitives before writing custom wrappers.

Default preference order:

1. existing app components
2. shadcn-based UI primitives in `website/app/components/ui/`
3. feature-level composition
4. custom one-off implementation only when necessary

### Use SCSS modules for layout and feature styling

SCSS modules remain the preferred styling layer for feature screens and layout composition.

Use utility classes sparingly and intentionally.

## Technology Expectations

The design system should align with the current frontend stack:

- React 19
- React Router 7 SSR
- shadcn-style UI primitives
- Radix-based interaction patterns where relevant
- SCSS modules

## Layout System

### Shell

The application shell is the main structural pattern for most screens:

- left navigation sidebar
- top header
- main content area
- optional right rail

Feature pages can hide the default right rail and provide their own dedicated rail when needed.

### Page composition

Typical page structure:

- page wrapper
- hero or page heading block
- toolbar or filters if needed
- main content grid or feed
- optional supporting rail

### Spacing rhythm

Preferred large section gaps:

- 24px between major sections
- 16px for grouped controls and cards
- 12px for compact stacks
- 8px for labels, help text, and tightly related content

## Colour System

### Backgrounds

Application background: `#080A0F`

Sidebar background: `#0D1016`

Surface: `#11141B`

Panel: `#151922`

Hover surface: `#1C2230`

Border: `#242A36`

### Brand and semantic colours

Primary accent: `#6D5DFC`

Primary hover: `#7E70FF`

Success: `#22C55E`

Warning: `#F59E0B`

Danger: `#EF4444`

Information: `#3B82F6`

### Text

Primary text: `#F5F7FA`

Secondary text: `#A7B0BE`

Muted text: `#6B7280`

Disabled text: `#525866`

## Borders and Corners

Most surfaces use sharp corners.

Default radius rules:

- cards: 0px
- panels: 0px
- inputs: 0px
- buttons: 0px
- images: 0px

Rounded exceptions are limited to:

- avatars
- badges
- tags
- status pills

Default border:

- `1px solid #242A36`

Use borders to separate content instead of relying on shadows.

## Shadows

Avoid shadows on standard cards and panels.

Allowed modal shadow:

- `0 8px 32px rgba(0, 0, 0, 0.45)`

## Typography

Primary font:

- Inter

Fallback:

- system-ui

Suggested heading scale:

- H1: 48px / 700
- H2: 36px / 700
- H3: 30px / 600
- H4: 24px / 600

Body and supporting text:

- Body: 16px / 400
- Small: 14px / 400
- Caption: 12px / 400

## Component Guidance

### Buttons

Use shared button primitives.

Primary buttons should be used for the main action in a section.

Outline buttons should be used for secondary actions.

Ghost buttons are appropriate for low-emphasis actions inside cards, menus, and rails.

### Cards

Use shared card primitives as the default surface.

Prefer:

- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

Cards should not float visually. Use borders and dark surfaces instead of elevation.

### Dialogs

Use the shared dialog primitive for confirmations, editor popups, and short forms.

Dialog expectations:

- clear title
- short supporting description where helpful
- actions grouped in the footer
- destructive actions clearly labeled

Do not use browser alerts or confirms for production UI.

### Inputs and labels

Use shared input and label primitives.

Forms should clearly distinguish:

- required fields
- optional fields
- helper text
- inline field errors

### Inline validation

Use inline field-level errors for missing or invalid inputs.

Use a higher-level alert only for submit failures or broader form problems.

### Badges

Badges are appropriate for:

- status
- tags
- provider labels
- compact metadata

Badges may be rounded, unlike cards and inputs.

### Dropdown menus

Use shared dropdown primitives for per-item actions such as edit, delete, or secondary operations.

## Data Visualisation

Use charts only when they provide real product value.

Charts should use real data, not placeholder metrics.

Preferred usage:

- dashboard summaries
- provider or category breakdowns
- lightweight operational insights

Avoid decorative charts.

## Resource Page Rules

The Resources page should behave like an operational content dashboard rather than a plain list.

Recommended composition:

- page heading
- summary stats
- search and filters
- main resource grid
- dedicated right rail for overview and actions

The default global right sidebar can be hidden when the feature provides its own better contextual rail.

## Article and Content Rules

Articles can be connected to supporting resources.

Linked resources should be:

- easy to attach during editing
- visible on the article page
- represented clearly but compactly in list views


## Accessibility Expectations

Every new component or feature should preserve:

- keyboard accessibility
- visible focus states
- readable contrast
- meaningful labels
- predictable action wording

Dialogs, menus, and forms must support keyboard use correctly.

## Documentation Rule

When a meaningful UI pattern changes, update this file in the same workstream.

Examples:

- introducing a new right-rail pattern
- changing validation behaviour
- standardising resource cards
- adding chart guidance

## Practical Review Checklist

Before merging UI work, check:

- does it reuse shared primitives where appropriate
- does it match existing spacing and typography
- does it avoid unnecessary rounded corners and shadows
- does it handle loading, empty, and error states
- does it include accessible labels and clear actions
- does it align with the design rules in this file

Every new page must follow this design system before introducing new UI patterns.