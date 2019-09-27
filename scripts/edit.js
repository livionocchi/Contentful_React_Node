const fs = require('fs')
const axios = require('axios')
const data = require('../src/json/contentful')
const chalk = require('react-dev-utils/chalk');

// Checks if content model directory exists, in case not it creates and populates it
const dirSync = () => {
  return data.map((el) => {
    if(!fs.existsSync(`${__dirname}/../src/content-models/${el.sys.id}`)) {
      fs.mkdirSync(`${__dirname}/../src/content-models/${el.sys.id}`)
      fs.mkdirSync(`${__dirname}/../src/content-models/${el.sys.id}/img`)
    };

    let child = [];
    let hierarchy = 'element';
    el.fields.map(x => {
      if(x.type === 'Array' || x.type === 'Link') {
        if(x.items) {
          if(x.items.validations[0] !== undefined) {
            if(x.items.validations[0].linkContentType) {
              x.items.validations[0].linkContentType.map(y => {
                child.push({
                  id: x.id,
                  name: y
                })
              })
              hierarchy = 'parent'
              return child
            }
          }
        }
      }
    });
    let fields = [];
    el.fields.map(x => {
      return fields.push({
        id: x.id,
        name: x.name,
        type: x.type,
        required: x.required,
        description: null
      })
    });

    let content = {
      name: el.name,
      id: el.sys.id,
      fields: [...fields],
      children: [...child],
      parents: [],
      images: [],
      description: el.description,
      hierarchy: hierarchy,
    };

    if(!fs.existsSync(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`)) {
      return fs.writeFileSync(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`, JSON.stringify(content), 'utf8')
    }
  })
}

// Add pics paths to the images key into the relative content model, also fixes the hierarchy
const getPicPath = () => {
  console.log(chalk.green('Directories created properly'))
  return data.map(el => {
    let json = require(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`);
    let images = [];
    let hierarchy = json.hierarchy;
    const targetFile = (file) => {
      var extension = file.split('.').pop();
      if(extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
        return true
      } else if(extension !== 'DS_Store') {
        console.log(chalk.red(`${file} in content-models/${el.sys.id} wasn't uploaded: media format not supported`));
        return false
      }
      return false
    };
    fs.readdirSync(`${__dirname}/../src/content-models/${el.sys.id}/img`)
      .forEach(img => {
        if(targetFile(img)) {
          return images.push(`content-models/${el.sys.id}/img/${img}`)
        }
        return false
      });
    json.images = [...images];

    if(json.hierarchy === 'parent' && json.parents.length !== 0) {
      json.hierarchy = 'component'
    }
    return fs.writeFileSync(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`, JSON.stringify(json), 'utf8')
  })
}

// Reads all the files into the content-models folder, for each content model, and group their content into custom.json
const read = () => {
  console.log(chalk.green('Images and hierarchy added properly'))
  let content = [];
  data.map(el => {
    let contentFile = fs.readFileSync(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`, 'utf8');
    content.push(JSON.parse(contentFile));
    return content
  })
  console.log(chalk.green('Files read properly'));
  return content
}

// Calls all the functions above and writes a custom.json file which is the source of data for the front-end
const main = () => {
  dirSync();
  getPicPath();
  fs.writeFileSync(`${__dirname}/../src/json/custom.json`, JSON.stringify(read()), 'utf8')
  console.log(chalk.green('custom.json file wrote properly'));
  console.log(chalk.green.bold('All done!'));
  return true
}

// Initialize the main function above
main();
