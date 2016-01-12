# Git Workflow

## The Trinity of Repos

1. local repo
1. origin (your fork)
1. upstream (the source of truth)

## The Two Holy Git Workflows

### Generally keep your local's and fork's master branches up-to-date with upstream's master:
  ```
  > git checkout master
  > git pull --rebase upstream master
  > git push origin master
  ```
  
  - You should NEVER be doing ANYTHING ELSE with the master branches.
  - You should NEVER git add/commit to your local master.
  - You should NEVER push or pull in any other way from your local master.
  - The sole purpose of your local's and fork's master branches is to be copies of the upstream master.

### Only add new code to a feature branch (we'll hereby call it feature-branch) on your local repo.
  1. Create a new feature branch:
    - Do the above commands to update your local's and fork's master branches.
    - Then create a new branch to work from:
      ```
      > git checkout -b feature-branch
      > git add .
      > git commit
      > git add .
      > git commit
      > (etc...)
      ```
  1. Periodically as you work, you should keep your local feature-branch up-to-date with upstream's master:
    ```
    > git pull --rebase upstream master
    ```
    There might be merge conflicts that you need to solve. Do so by opening up the conflict files, fixing the conflicts, and then running:
    ```
    > git add .
    > git rebase --continue
    ```
    You may need to do this several times within one rebase. That's fine.

  1. WHEN YOU ARE READY TO SUBMIT A PULL REQUEST:
    - Do the above commands for merging changes into your local feature-branch from the upstream master. You MUST do this first.
    - Push your local feature-branch into your fork's feature-branch:
      ```
      > git push origin feature-branch
      ```
    - Go to your fork's repo on github. From there, submit a pull request:
      Base fork: laudatory-flannel
      Base: master
      Head fork: [your username]/laudatory-flannel
      Compare: feature-branch
    - Wait for someone to merge it into the upstream master.
    - ONLY after it has been merged, you may delete the feature-branch from your local repo:
      ```
      > git checkout master
      > git pull --rebase upstream master
      > git branch -d feature-branch
      ```