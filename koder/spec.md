# UI Specification for OpenAI SDK Playground

## Objective

Create a `ui.md` file in `../standalone-bundle` for a build-free, visually
appealing UI playground for the OpenAI SDK standalone bundle, inferred from
`../standalone-bundle/index.html`.

## Goals

- Define a spec for a UI playground showcasing all OpenAI SDK features.
- Guide another LLM to build an intuitive, aesthetic playground.
- Infer bundle usage from `../standalone-bundle/index.html` and README.

## Requirements

- **Build-Free**: Vanilla JavaScript, no build tools.
- **Aesthetics**: Modern design with Tailwind CSS (CDN).
- **Typography**: Inter font (CDN).
- **Icons**: Feather Icons (CDN).
- **No Custom CSS**: Use only Tailwind CSS.
- **CDN**: Toolbomber CDN for SDK bundle.
- **Usability**: Responsive, clear information design.

## SDK Features to Showcase

Inferred from `../standalone-bundle/README.md`:

1. **Chat Completions**: Text input/output for responses.
2. **Embeddings**: Text input to display embeddings.
3. **Text-to-Image**: Prompt input for image generation.
4. **Image-to-Text**: Image upload for analysis.
5. **Moderation**: Text input for content check.
6. **Tokenization**: Text input for token results.
7. **API Configuration**: API key input and settings.

## UI Structure

### Layout

- **Header**: Title ("OpenAI SDK Playground"), feature navigation, API key
  input.
- **Main Content**: Tabbed interface for SDK features.
- **Sidebar**: Collapsible settings panel (model, temperature).
- **Footer**: Links to OpenAI docs, Toolbomber CDN.

### Components

1. **API Key Input**:
   - Secure input (`type="password"`) with "Save" button.
   - Tailwind: `border rounded p-2 bg-gray-100`.
   - Icon: Feather `key`.
2. **Feature Tabs**:
   - Tabs for each feature (`flex gap-2 border-b`).
   - Active tab: `border-b-2 border-blue-500`.
   - Icons: Feather `message-square` (Chat), `image` (Text-to-Image), etc.
3. **Interactive Panels**:
   - **Chat**: Textarea, submit button, output (`bg-gray-50 p-4 rounded`).
   - **Embeddings**: Text input, vector table.
   - **Text-to-Image**: Prompt input, image preview (`max-w-full rounded`).
   - **Image-to-Text**: File upload, result display.
   - **Moderation**: Text input, pass/fail badge (`bg-green-100`/`bg-red-100`).
   - **Tokenization**: Text input, token list/count.
4. **Settings Sidebar**:
   - Collapsible (`fixed right-0 w-64 bg-white shadow`).
   - Model dropdown, temperature/max tokens sliders.
   - Icon: Feather `settings`.
5. **Error/Loading**:
   - Spinner: `animate-spin`, Feather `loader`.
   - Errors: `bg-red-100 text-red-700 p-2 rounded`.

### Styling

- **Tailwind CSS**: `<script src="https://cdn.tailwindcss.com"></script>`.
- **Inter Font**:
  `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`.
- **Feather Icons**: `<script src="https://unpkg.com/feather-icons"></script>`,
  initialize with `feather.replace()`.
- **Colors**: Tailwind `blue`, `gray`, `white`.
- **Spacing**: `p-4`, `m-2`.
- **Responsive**: Use `sm:`, `md:` classes.

## Notes

- Infer SDK bundle usage from `../standalone-bundle/index.html`.
- Reference README for SDK details.
- Ensure responsive, usable design across devices.
- Use Tailwind for consistent, modern aesthetics.
