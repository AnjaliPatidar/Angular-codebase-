# Blackswan Element

Element is Enterprise Cognitive Operating System to develop Enterprise AI driven applications centered on the concept of augmented human intelligence. Essentially Element is the foundation that can be used by enterprises across multiple industries to build robust AI applications & tools that would allow to better collect and organize the necessary information, gain competitive intelligence, improve accountability and compliance, drive new business opportunities and increase the predicting power – all while cutting costs, reducing errors and eliminating waste in a minimal time and effort

## Development Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See install.md for notes on how to deploy the project on a Server.

### Prerequisites

What things you need to install the software and how to install them

1. Node (v8.9 or higher)
2. NPM (v5.5.1 or higher)
3. Angular CLI version ^8.3.29  
``npm install -g @angular/cli@6.1.1``

### Setting up the project

1. Install all the prerequisites
2. Install all project dependencies by running `` npm install `` in the root folder.

### Running the application

``ng serve``

# Contributing

## Dev pull/merge request and release process

1. Branch from the `dev` branch. If you're working on a story subtask/issue, include the JIRA Story id in the name.
2. Update the README.md and other documentation with details of major changes.
3. When committing changes, write a meaningful message and include the subtask/issue id.  
``git commit -m "RD-0001 - Updated readme to match current changes."``
4. Once you are ready for review please open a pull/merge request to the
`dev` branch. Include the JIRA Story id in the description.
5. You may merge the Pull/Merge Request in once you have the sign-off of the approvers.
6. When merging make sure to squash the commits if there is more than one.

## Master pull/merge request and release process

1. Branch from the `master` branch. If you're merging a story subtask/issue, include the JIRA Story id in the name.
2. Locate the commits you want to merge to master from dev and chery-pick to the branch you created.  
``git cherry-pick -x [commitid]``
3. Once you have tested and verified the cherry-picked changes, please open a pull/merge request to the
`master` branch. Include the JIRA Story id in the description.
5. You may merge the Pull/Merge Request in once you have the sign-off of the approvers.

## Deployment

### Dev deployment

1. Checkout to `dev` branch and get the latest pullk
2. Compile and Build the app using following command.  
``ng build --prod --aot=false --build-optimizer=false --base-href ./``
> `--base-href ./` sets the base path of the app to `./`. You can do this manually by updating `<base href="./">` of `index.html` in `dist` folder.

3. Open `element-appfrontend-angularjs` project.
4. Checkout to `dev` branch of `element-appfrontend-angularjs` and get the latest pull.
5. Copy the `dist` from `element-appfrontend-angular-srv` to following locations.
    1. `element-appfrontend-angularjs-srv/element-new`
    2. `element-appfrontend-angularjs-srv/src/main/webapp/element-new`
> Fully replace existing dist folders in both folders.
6. Commit the changes, including the JIRS ids and push the changes.  
``git commit -m "Angular build for RD-0001 RD-0002"``
7. Run the azure integration pipeline [INT-Branch-element-appfrontend-angularjs-srv](https://dev.azure.com/bst-toronto/toronto-dev/_build?definitionId=180).

### QA deployment

1. Checkout to `master` branch and get the latest pull
2. Compile and Build the app using following command.  
``ng build --prod --aot=false --build-optimizer=false --base-href ./``
> `--base-href ./` sets the base path of the app to `./`. You can do this manually by updating `<base href="./">` of `index.html` in `dist` folder.

3. Open `element-appfrontend-angularjs` project.
4. Checkout to `master` branch of `element-appfrontend-angularjs` and get the latest pull.
5. Copy the `dist` from `element-appfrontend-angular-srv` to following locations.
    1. `element-appfrontend-angularjs-srv/element-new`
    2. `element-appfrontend-angularjs-srv/src/main/webapp/element-new`
> Fully replace existing dist folders in both folders.
6. Commit the changes, including the JIRS ids and push the changes.  
``git commit -m "Angular build for RD-0001 RD-0002"``
7. Run the jenkins build job for `element-appfrontend-angularjs` and create a QA Deployment artifact.

## Built With

* [Angular 8](https://v8.angular.io/start) - The web framework used
* [Saas](https://sass-lang.com/) - Used to Styling CSS effectively
* [Azure DevOps](https://azure.microsoft.com/en-us/products/devops/) - Project Deployment