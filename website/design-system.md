# CorkAirportDojo Design System

Version: 2.0

---

# Vision

CorkAirportDojo is a modern learning platform for developers.

The design should feel like professional software rather than a marketing website.

The UI should be:

• Minimal
• Fast
• Sharp
• Professional
• Consistent
• Accessible
• Developer Focused

Think of the visual style as a combination of:

- GitHub
- VS Code
- JetBrains IDEs
- Vercel
- Microsoft Learn
- Linear

Avoid looking like a generic SaaS dashboard.

---

# Design Principles

## 1. Content First

The content is always the hero.

The UI exists to support the content, not compete with it.

Avoid unnecessary decorations, gradients, shadows or animations.

---

## 2. Consistency

Every page follows the same layout, spacing, typography and components.

Nothing should look like it belongs to another application.

---

## 3. Reusable Components

Every UI element should be reusable.

Never duplicate styling.

Every page should be assembled from shared components.

---

## 4. Performance

Keep the interface lightweight.

Use CSS transitions sparingly.

All styles should be in a SCSS module file.

Avoid heavy shadows and animations.

Everything should feel instant.

---

# Colour Palette

## Application Background

Primary

#080A0F

Main application background.

---

Secondary Surface

#11141B

Used for cards and content areas.

---

Sidebar

#0D1016

Dedicated sidebar background.

---

Panels

#151922

Used for editor panels and widgets.

---

Hover

#1C2230

Hover state.

---

Border

#242A36

Thin subtle border.

---

Primary Accent

#6D5DFC

Brand colour.

---

Primary Hover

#7E70FF

---

Success

#22C55E

---

Warning

#F59E0B

---

Danger

#EF4444

---

Information

#3B82F6

---

Text

Primary

#F5F7FA

Secondary

#A7B0BE

Muted

#6B7280

Disabled

#525866

---

# Borders

The application uses sharp edges.

Cards

0px radius

Panels

0px radius

Inputs

0px radius

Buttons

0px radius

Images

0px radius

Exceptions

Only these may be rounded:

• Avatar images
• Notification badges
• Status badges
• Tags

Maximum radius

999px

---

# Borders

Every component uses

1px solid #242A36

Borders define separation instead of shadows.

---

# Shadows

Avoid shadows.

Only modals may use:

0 8px 32px rgba(0,0,0,.45)

Cards should never float.

---

# Typography

Font

Inter

Fallback

system-ui

---

Heading 1

48px

700

---

Heading 2

36px

700

---

Heading 3

30px

600

---

Heading 4

24px

600

---

Body

16px

400

Line Height

28px

---

Small Text

14px

---

Caption

12px

---

Weights

400

500

600

700

Avoid ultra-bold fonts.

---

# Layout

Maximum Width

1600px

Centered.

---

Sidebar

240px

---

Right Sidebar

320px

---

Top Navigation

64px height

Everything stays on one row.

Never wrap.

Should be inline with the Layout

------------------------------------------------

Search

Spacer

Theme

Notifications

User Menu

------------------------------------------------

Padding

0 16px

---

Content Padding

Desktop

24px

Tablet

20px

Mobile

16px

---

Section Spacing

16px between sections.

Never use inconsistent spacing.

---

Spacing Scale

4

8

12

16

24

32

48

64

96

Use only this spacing system.

---

# Navigation

Sidebar Items

Height

44px

Icons

20px

Padding

16px

Active Item

Purple left border

No glowing backgrounds.

Hover

Dark hover background.

---

Top Navigation

Contains

• Search
• Theme Toggle
• Notifications
• User Menu

Everything aligned vertically.

---

# Buttons

Primary

Flat Purple

Background

#6D5DFC

Hover

#7E70FF

Text

White

Height

44px

Radius

0

---

Secondary

Transparent

Border

1px solid #242A36

Hover

#1C2230

---

Danger

Flat Red

---

Ghost

Transparent

Hover Background

#1C2230

---

# Inputs

Height

44px

Background

#151922

Border

1px solid #242A36

Radius

0

Focus

Purple border

---

# Cards

Cards should feel like editor panels.

Background

#151922

Border

1px solid #242A36

Padding

24px

Radius

0

No shadows.

No gradients.

---

# Article Cards

Always contain

Cover Image

Title

Description

Tags

Author

Reading Time

Published Date

Hover

Slight border colour change.

No movement.

---

# Module Cards

Contain

Icon

Title

Description

Difficulty Badge

Lesson Count

Consistent height.

---

# Tags

Rounded Pill

Height

28px

Padding

0 12px

Colour

Dark background

Border

1px solid #242A36

---

# Badges

Beginner

Green

Intermediate

Purple

Advanced

Red

---

# Weather Alerts

Use Amber.

Dark panel.

Amber icon.

No flashing animations.

Only display when alerts exist.

---

# Icons

Use

react-icons

Preferred icon packs

Feather

react-icons/fi

Hero Icons

react-icons/hi2

Material

react-icons/md

Bootstrap Icons

react-icons/bs

Font Awesome 6

react-icons/fa6

Navigation Icons

20px

Toolbar

18px

Buttons

16px

Cards

18px

---

# Images

Square corners.

Cover fit.

Lazy loaded.

Optimised.

---

# Animations

Duration

200ms

Hover

Background transition only.

Avoid scaling.

Avoid bouncing.

Avoid floating effects.

---

# Accessibility

Minimum click target

44px

Keyboard navigation

Required

Focus states

Visible

Contrast

WCAG AA

---

# Responsive

Desktop

1400+

Tablet

768–1399

Mobile

Below 768

Sidebar collapses.

Bottom navigation appears.

Cards stack vertically.

---

# Standard Components

The application should only use shared components.

AppShell

Sidebar

TopNavigation

SectionHeader

Button

IconButton

Input

SearchBox

Dropdown

Card

Panel

Avatar

Badge

Tag

WeatherAlert

ModuleCard

ArticleCard

ProfileCard

NotificationMenu

Modal

Tooltip

Toast

Tabs

Pagination

EmptyState

SkeletonLoader

MarkdownEditor

ImageUploader

PublishPanel

SettingsPanel

---

# UI Rules

✔ Keep everything aligned to the same grid.

✔ Use square cards.

✔ Use thin borders instead of shadows.

✔ Keep the interface minimal.

✔ Let content breathe.

✔ Use consistent spacing.

✔ Avoid unnecessary gradients.

✔ Avoid decorative animations.

✔ Reuse every component.

✔ Always align to the 8px spacing system.

✔ Every page should feel like part of the same application.

---

# Future Pages

The design system applies to:

Landing Page

Modules

Module Details

Blog

Article

Write Article

Markdown Editor

Events

Weather Alerts

Notifications

Dashboard

Admin

User Profile

Settings

Authentication

Every new page must follow this design system before introducing new UI patterns.