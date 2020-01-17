const mongoose = require('mongoose');

const ExtractionParams = mongoose.model('ExtractionParams');
const { extract, convert } = require('./extractByCoordService');

const stringToRegex = string => {
  const match = /^\/(.*)\/([a-z]*)$/.exec(string);
  return new RegExp(match[1], match[2]);
};

const B64StringToRegex = base => {
  const string = decodeURIComponent(
    atob(base)
      .split('')
      .map(function(c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join('')
  );
  return stringToRegex(string);
};

const contains = (target, pattern) => {
  let value = 0;
  pattern.forEach(function(regexString) {
    const regex = stringToRegex(regexString);
    value += target.match(regex) ? 1 : 0;
  });
  return value === pattern.length;
};

const B64ArrayDecode = array => {
  const newArray = [];
  array.forEach(elem => {
    newArray.push(B64StringToRegex(elem));
  });
  return newArray;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
};

const findPage = async (file, param) => {
  const pdfObj = await convert(file, {
    firstPage: param.pages[0],
    lastPage: param.pages[1],
    normalizeWhitespace: true,
  });

  param.keyWords = B64ArrayDecode(param.keyWords);

  let foundPage;

  pdfObj.pages.forEach(page => {
    const pageText = extract(
      page,
      pdfObj.producer,
      param.coordinatesStart,
      param.coordinatesEnd
    );

    //! TODO Fix to regex
    if (contains(pageText.toUpperCase(), param.keyWords)) {
      foundPage = pageText;
    }
  });

  return foundPage;
};

const searchAndExtract = async (params, file) => {
  let extractedInfo = {};

  await asyncForEach(params, async param => {
    const pageContent = await findPage(file, param);
    // if (param.extractionTitle === 'summary') {
    //   console.log(pageContent);
    // }
    if (param.regex) {
      const re = B64StringToRegex(param.regex);

      const [, info] = re.exec(pageContent);

      if (info) {
        extractedInfo = { ...extractedInfo, [param.extractionTitle]: info };
      } else {
        extractedInfo = { ...extractedInfo, [param.extractionTitle]: '' };
      }
    } else {
      extractedInfo = {
        ...extractedInfo,
        [param.extractionTitle]: pageContent,
      };
    }
  });

  return extractedInfo;
};

const extractData = async (params, file) => {
  let allInfo = {};

  await asyncForEach(params, async (param, index) => {
    // console.log(index, param);
    const pdfObj = await convert(file, {
      firstPage: param.pages[0],
      lastPage: param.pages[0],
    });

    const extractedInfo = extract(
      pdfObj.pages[0],
      pdfObj.producer,
      param.coordinatesStart,
      param.coordinatesEnd
    );

    if (param.regex) {
      const re = B64StringToRegex(param.regex);

      // const info = extractedInfo.match(re);
      // console.log(extractedInfo);
      const info = re.exec(extractedInfo);

      if (info) {
        allInfo = { ...allInfo, [param.extractionTitle]: info[1] };
      } else {
        allInfo = { ...allInfo, [param.extractionTitle]: '' };
      }
    } else {
      allInfo = { ...allInfo, [param.extractionTitle]: extractedInfo };
    }
  });
  // console.log(allInfo);

  return allInfo;
};

// TODO Pipeline -> getPDFData(file, typeFile)
const getFileData = async (file, docType) => {
  // get all params from that docType
  const params = await ExtractionParams.find({ docType });

  const searchParams = params.filter(param => param.keyWords.length);
  const specificParams = params.filter(param => param.keyWords.length === 0);

  const basicInfo = await extractData(specificParams, file);
  // console.log('basicInfo', basicInfo);
  const searchedInfo = await searchAndExtract(searchParams, file);
  // console.log('searchedInfo', searchedInfo);

  return { ...basicInfo, ...searchedInfo };
};

module.exports = { getFileData };
