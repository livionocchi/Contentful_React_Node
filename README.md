#Telepass Public Site Guidelines

----
## first time here?
1. run `npm install` or `yarn`
2. run `npm run sync` or `yarn sync`
3. run `npm start` or `yarn start`
4. you are ready to go!

----
## what can I do?

### edit contents and pictures
1. in the `content-models` folder open a specific content model folder
2. the relative JSON file is to edit the content
3. to add or remove a picture do so into the `img` folder
    > the only picture formats supported are .jp(e)g and .png

4. once you are done with the edits run `npm run edit` or `yarn edit`

----
### synchronize with Contentful API
1. run `npm run sync` or `yarn sync`
2. if there is any **new** content model it will be fetched and the relative folder will be created and populated

    > this operation does **NOT** overwrite any already existing folder.

----
### overwrite a folder
1. simply delete the content model folder and run either `npm run edit` or `yarn edit`
2. this will create again the content model folder but with the default data

    > this action is **NOT** reversible and everything that used to be in the folder will be overwritten by the default data

----
### create a new content model
1. the content model needs to be created in Contentful at first
2. once you've created it run `npm run sync` or `yarn sync`
3. the new content model folder will be created and partially populated
4. to make it complete you need to open the JSON file in the relative folder and add/edit:
  * `fields` > `description`, `STRING`: a specific field description/note
  * `parents`, `ARRAY of OBJECTS{"id": id, "name": name }`: list of parent(s) content model(s)
  * `description`, `STRING`: a generic content model description/notes

  > * `hierarchy`, `STRING`: might be wrong (ie. a `component` is defined as a `parent`), to fix it populate the `parents` array above and and run `npm run edit`. Nonetheless some `hierarchy` values, such as `page` or `other`, need to be edit manually

----
### create a build
1. run `npm run build` or `yarn build`
2. done! in the `dist` folder you have what you need

----
## what's happening with `edit` and `sync`?
`edit` and `sync` mainly defers for the fact that `sync` starts off with a fetch to the Contentful API and then runs asynchronously. Here's what happens:

0. A `GET` call is dispatched to Contentful API and a `contentful.json` file is then created and populated with the API data

    > this happens only with `npm run sync` or `yarn sync`

1. The `contentful.json` file is then looped and, for each content model, it creates a relative folder in `content-models`, if not already existing
  * If the folder is **new** it will be populated with the relative content model portion of data from the `contentful.json`, the rest need to be added by the client. An empty `img` folder is also created.
  * If the folder is **not new** it will not be overwritten

    > overwrite the folder will make you lose anything which has been manually added, see above for more info

2. The `img` folder inside each content model is looped to see if there is any picture, if there are their paths are added to the relative content model JSON file
3. From each folder JSON file the relative portion of data is taken to write `custom.json`

    > the loop runs over the elements in the `contentful.json` file, so adding a folder manually in the `content-models` folder will **NOT** generate the relative portion of code into `custom.json`

4. `custom.json` is the JSON to be used to display datas in the front-end

----
