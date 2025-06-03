# Instructions

This is the starting point for you to read & start executing

## `/koder` directory

- `/koder` is a meta folder that helps the system complete tasks
- No source code or final artefacts go inside `/koder`
- Use `/koder` to store meta files used to log, manage tasks, plan etc
- When `./` is used to specify something, its relative to the current file

## Vocabulary

### Spec.md

`./spec.md` defines what is expected of you. Read `./spec.md` & `./log.md` to
understand what needs to be done and whats the current state. Decide a semantic
portion of the next step and define it the task in this session. Implement it
and make a note of the progress in `./log.md`

### log.md

`./log.md` is a file that will track your progress in completing the tasks.
After every task make an entry in it to track progress.

- In case you don't find the file `./log.md`, create one and start logging.
- Write new logs to the top than bottom; so that the top ones are the newest
- Always add `Context & Permission` tasks as the top of the next tasks. This is
  added so that the system can pause before continuing.

#### Log Format

```

--------------------------------------------------------------------------------
# Log <NUMBER>

<Subject>
07:12 PM, 30 March 2025

<Description>

- [x] <Completed Subtask>
- [-] <Partially completed Subtask>
- [ ] <Skipped Subtask>
- [ ] <Skipped Subtask>

## Next Steps

- [ ] Context: Briefly explain to user your context so far.
- [ ] Premission: Request permission to proceed to next task.
- [ ] <Task Two>

```

### General Awareness

Do a tree of the repo, to have a general awareness of what the repo / folder is.
So that user's requests will have better context.

### Notification

After completing a task, send a notification with a brief information on what
was completed.
