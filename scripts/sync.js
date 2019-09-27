require('custom-env').env('development')
const fs = require('fs')
const axios = require('axios')
const chalk = require('react-dev-utils/chalk');
let data = ''

// Fetch datas from contentful API and write a contentful.json file
const fetch = async() => {
  return axios.get(`${process.env.API}/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT_ID}/content_types?access_token=${process.env.ACCESS_TOKEN}&limit=500`)
    .then(response => {
      return response.data.items
       .sort((a, b) => {
         if(a.name < b.name) { return -1; }
         if(a.name > b.name) { return 1; }
         return 0;
       });
    })
    .then(response => {
      let content = JSON.stringify(response)
      fs.writeFileSync(`${__dirname}/../src/json/contentful.json`, content, 'utf8');
      return data = require(`${__dirname}/../src/json/contentful`)
    })
    .catch(err => console.log(err))
}

// Checks if content model directory exists, in case not it creates and populates it
const dirSync = async() => {
  await fetch()
  data.map((el) => {
    if(!fs.existsSync(`${__dirname}/../src/content-models/${el.sys.id}`)) {
      return fs.mkdir(`${__dirname}/../src/content-models/${el.sys.id}`, (err) => {
        if(err) throw err;
        fs.mkdir(`${__dirname}/../src/content-models/${el.sys.id}/img`, (err) => {
          if(err) throw err;
        })
      })
    };

    let child = [];
    let hierarchy = 'element';
    el.fields.map(x => {
      if(x.type === 'Array' || x.type === 'Link') {
        if(x.items) {
          if(x.items.validations[0] !== undefined) {
            if(x.items.validations[0].linkContentType) {
              x.items.validations[0].linkContentType.map(y => {
                return child.push({
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
  return true
}

// Add pics paths to the images key into the relative content model, also fixes the hierarchy
const getPicPath = async() => {
  await fetch();
  await dirSync();
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
    fs.writeFileSync(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`, JSON.stringify(json), 'utf8')
  })
}

// Reads all the files into the content-models folder, for each content model, and group their content into custom.json
const read = async() => {
  await fetch()
    .then(res => console.log(chalk.green(`Fetched data from Contentful properly: ${ chalk.bold(res.length) } content models found`)))
  await dirSync()
    .then(() => console.log(chalk.green('Directories created properly')));
  await getPicPath()
    .then(() => console.log(chalk.green('Images and hierarchy added properly')));
  let content = []
  data.map(el => {
    let contentFile = fs.readFileSync(`${__dirname}/../src/content-models/${el.sys.id}/${el.sys.id}.json`, 'utf8');
    content.push(JSON.parse(contentFile));
    return content
  })
  console.log(chalk.green('Files read properly'));
  return content
}

// Calls all the function above then writes a custom.json file which is the source of data for the front-end
Promise.all([fetch(), dirSync(), read(), getPicPath()])
  .then(values => {
    let json = JSON.stringify(values[2]);
    fs.writeFile(`${__dirname}/../src/json/custom.json`, json, 'utf8', (err) => {
      if(err) throw err;
      console.log(chalk.green('custom.json file wrote properly'));
      console.log(chalk.green.bold('All done!'));
    })
    return values
  })
  .catch(err => {
    console.log('Error', err);
  })
