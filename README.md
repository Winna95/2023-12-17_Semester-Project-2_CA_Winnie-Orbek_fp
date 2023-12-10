[![Automated Unit Testing](https://github.com/Winna95/2023-12-17_Semester-Project-2_CA_Winnie-Orbek_fp/actions/workflows/unit-test.yml/badge.svg)](https://github.com/Winna95/2023-12-17_Semester-Project-2_CA_Winnie-Orbek_fp/actions/workflows/unit-test.yml)

# 2023-12-17_Semester-Project-2_CA_Winnie-Orbek_fp

## Description

This is a semester project for school. The goal of this project is to take the skills learned over the past three semesters and create an auction website. In the auction website it must be possible for users to add items to be bid on and bid on items other users have put up for auction. New users are given 1000 credits to use on the site. They can get credits by selling items and use credit by buying items. Non-registered users can search through the listings, but only registered users can make bids on listings.

The API used for this project can be found under Auction EndPoints in the [Noroff API documentation](https://docs.noroff.dev/auctionhouse-endpoints/authentication).

### Repo and branching

The default branch for this repo is: main.
The default branch has the following branch protection rules:

- Require a pull request before merging
- Require status checks to pass before merging (see testing below for more details)
- Require conversation resolution before merging.

This means that all new features should be created on a separate branch and the pull request should be open if you want to merge changes in to the main branch.

This repo has a workflow named unit-test.yml which runs on push to master, and builds the project and publishes it to gitHub [pages](https://winna95.github.io/2023-12-17_Semester-Project-2_CA_Winnie-Orbek_fp/).

### Pre Commit Hooks

This application uses huskey and lint-staged to preform some actions prior to each commit. The actions preformed:

- prettier: will format any staged HTML, SCSS JS files.
- Eslint: will look for issues and try to automatically fix them in all staged js files under /src/js

## Testing

### Unit Tests

This application uses jest for unit tests. All unit tests are automatically run on gitHub when creating a pull request.
To manually start unit tests run the following command `npm run test`.
The jest specs should reside in the same folder as the source code, and should be named as "sourceCodeFile".test.js
