# PDF Extractor

This API was developed for [my](https://www.github.com/pedrecal) bachelor thesis in Computer Science by the [Universidade Estadual de Santa Cruz](http://www.uesc.br).

The objective of this work is to extract data from pre-formatted PDF files.

The dissertation of this work can be found [here](https://github.com/pedrecal/PDFExtractor-TCC-TeX). (In brazilian portuguese)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Most important you will need [Node.JS](https://nodejs.org/) v12 or greater.

And [Yarn](https://yarnpkg.com/).

Then you will need an running instace of mongoDB, it can be [mLab](http://mlab.com/), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local version.

So you can configure the [variables.env.example](variables.env.example). Remember to remove the *.example* at the end of the file name.

### Installing

With all the prerequisites done, you need to install the dependencies

```
yarn
```

And to have the API up and running:

```
yarn run dev
```

This way you will have the development server running.

<!-- ## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
``` -->

### And coding style

The architectural structure of this project

<!-- ## Deployment

Add additional notes about how to deploy this on a live system -->

## Built With

* [Node.JS](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [PDF.JS](https://mozilla.github.io/pdf.js/) - A general-purpose, web standards-based platform for parsing and rendering PDFs.
* [Express](http://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js

## Contributing

Feel free to submit pull requests and contact me!

## Versioning

We use [SemVer](http://semver.org/) for versioning.
<!-- For the versions available, see the [tags on this repository](https://github.com/your/project/tags). -->

## Authors

* **Alexandre Pedrecal** - *Initial work* - [Pedrecal](https://github.com/pedrecal)

See also the list of [contributors](https://github.com/pedrecal/PDF_Extractor-API/contributors) who participated in this project.

## License

This project is licensed under the MIT License.

<!-- ## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc -->
