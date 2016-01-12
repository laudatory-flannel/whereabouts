# Git Workflow
Follow this document to a T and you will avoid 90% of git-related headaches.

The remaining 10% will be dividing up work appropriately so that members of your team are never working on the same files.

# The Trinity of Repos

1. local repo
1. origin (your fork)
1. upstream (the source of truth)

# The Two Holy Git Workflows

## 1. Keep master branches up-to-date with upstream's master
  The master branches of both your **local repo** and your **fork** should be maintained regularly as copies of the upstream master:
  ```
  > git checkout master
  > git pull --rebase upstream master
  > git push origin master
  ```
  This pulls your upstream into your local repo, and pushes your local repo into your fork.
  
  - You should NEVER be doing anything else with the master branches.
  - You should NEVER ```git add```/```git commit``` to your local master.
  - You should NEVER push or pull in any other way from your local master.
  - **The sole purpose of your local repo's and fork's master branches is to be copies of the upstream master.**

## 2. Add all new work using feature branches

### When starting a new feature
  1. Do the above commands to update your local's and fork's master branches.
  1. Then create a new branch to work from. You should name it appropriately for your feature. For this document, we'll use the name ```feature-branch```.
    ```
    > git checkout -b feature-branch
    > git add .
    > git commit
    > git add .
    > git commit
    > (etc...)
    ```
### Periodically as you work
  Keep your branch up to date with the upstream master!
  ```
  > git pull --rebase upstream master
  ```
  There might be merge conflicts that you need to solve. Do so by opening up the conflict files, fixing the conflicts, and then running:
  ```
  > git add .
  > git rebase --continue
  ```
  You may need to do this several times within one rebase. That's fine.

### When finished with a new feature
  1. Do the above commands for merging changes into your local feature-branch from the upstream master. You MUST do this first.
  1. Push your local feature-branch into your fork's feature-branch:
    ```
    > git push origin feature-branch
    ```
  1. Go to your fork's repo on github. From there, submit a pull request:
    Base fork: laudatory-flannel
    Base: master
    Head fork: [your username]/laudatory-flannel
    Compare: feature-branch
  1. Wait for someone to accept the pull request, thus merging your changes into the upstream master.
  1. **Only after your pull request has been merged**, you may delete ```feature-branch``` from your local repo:
    ```
    > git checkout master
    > git pull --rebase upstream master
    > git branch -d feature-branch
    ```