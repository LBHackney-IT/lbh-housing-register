// Update JUnit output from Cypress to match the information expected by CircleCI,
// primarily adding the path to each test suite.
//
// This is necessary for CircleCI's parallelism/test splitting feature, as it reads the JUnit output
// to understand how long tests take to run.
//
// Taken from https://github.com/michaelleeallen/mocha-junit-reporter/issues/132#issuecomment-721943600

const fs = require('fs')
const xml2js = require('xml2js')

fs.readdir('./cypress/results', (err, files) => {
  if (err) {
    return console.log(err)
  }
  files.forEach((file) => {
    const filePath = `./cypress/results/${file}`
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err)
      }

      xml2js.parseString(data, (err, xml) => {
        if (err) {
          return console.log(err)
        }

        const file = xml.testsuites.testsuite[0].$.file
        xml.testsuites.testsuite.forEach((testsuite, index) => {
          if (index > 0) {
            testsuite.$.file = file
          }
        })

        const builder = new xml2js.Builder()
        const xmlOut = builder.buildObject(xml)
        fs.writeFile(filePath, xmlOut, (err) => {
          if (err) throw err
        })
      })
    })
  })
})
