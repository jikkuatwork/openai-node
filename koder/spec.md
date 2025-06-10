# Spec

Refine the UI in `../standalone-bundle/index.html`

## Principles

- Its a _single_ file PWA
- Its a build free PWA

## Refinements

3. Settings Screen

Do the following:

```
## API
// make all the fields similar in design

Key
[Key                        (Revoke|Set)] // a single component will manage the states: unset & set

Base URL
[Base URL                   (Revoke|Set)]
Add small pill buttons with some defaults: `openai`, `nebius`, `openrouter`

## Apperance
<as its there now>

## About

<write a nice paragraph than the current clumsy about>
```

4. Dropdowns

Can we make all dropdowns use the same component in chat?
