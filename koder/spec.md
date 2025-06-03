# Spec

This repo is OpenAI's node SDK.
Your task is to have an overall understanding of the repo and see if the
following task is possible:

1. I need a single file JS bundle of this project that I can use without bundle
   step in a web project
2. I need the relevant exports so that I can just follow the documentation and
   get going, expecting the same API to work
3. I need API key & BASE_URL to be provided at run time via the web app's interface
4. And I expect the remaining API to work so that a script file in the web app
   can implement the rest of the code effortlessly

## Why

I want a zero build workflow for building AI systems

## Trade-offs

- I don't care about security, this is a personal PoC
- I don't care about perf / bundle size, this is a PoC
- I want a single import that will let me get going to build my ideas

## Requirement

- Evaluate if all my goals are possible, how feasible it is & the complexity of
  it
