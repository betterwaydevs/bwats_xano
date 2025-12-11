# Developping Xanoscript Plugin

Here you'll find all the details of the architecture of this project, how to extend it and the expectation we place on potential contribution.

## Submodules

This extension uses a submodule for the language server. To initialize it locally, after cloning/pulling updates you'll want to pull the submodule too:

```sh
git submodule update --init --recursive
```

To update the submodule to its most recent version

```sh
cd language-server
git pull origin main
```

then update the main repository

```sh
cd ..
git add language-server
git commit -m "Update submodule to latest commit"
```

## Release to marketplace

To get an Access Token for publisher,
Go to https://dev.azure.com/xano-inc/_usersSettings/tokens
