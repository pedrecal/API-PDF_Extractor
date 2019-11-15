const { extract, convert, findPage } = require('./extractByCoordService');

const backCoverOptions = {
  firstPage: 2,
  lastPage: 2,
  normalizeWhitespace: true,
};

const abstractOptions = {
  firstPage: 4,
  lastPage: 10,
  normalizeWhitespace: true,
};

const advisorRE = /(?<=(Orientador(|a| \(a\))(| ):)\W)(\w.*)/gi;
const rmCoad = / coorientador.*/gi;
const coadvisorRE = /(?<=(Coorientador(|a| \(a\))(| ):)\W)(\w.*)/gi;

const abstractRE = /(?<=(Resumo)\W)(\w.*)/gi;
const rmKeyWords = /(Palavras( |-)Chave.*)/gi;
const keyWordsRE = /(?<=(Palavras(|-| )chave(| ):)\W)(\w.*)/gi;

const kWordSeparatorRE = /[,.;]/;

const getInfoTCC = async file => {
  const pdfObj = await convert(file, backCoverOptions);

  const author = extract(
    pdfObj.pages[0],
    pdfObj.producer,
    { x: 0, y: 0 },
    { x: 600, y: 200 }
  );

  const title = extract(
    pdfObj.pages[0],
    pdfObj.producer,
    { x: 0, y: 200 },
    { x: 600, y: 370 }
  );

  const preamble = extract(
    pdfObj.pages[0],
    pdfObj.producer,
    { x: 0, y: 375 },
    { x: 600, y: 700 }
  );

  const advisor = preamble.replace(rmCoad, '').match(advisorRE)[0];
  const coadvisor = preamble.match(coadvisorRE);

  return { author, title, advisor, coadvisor };
};

const findAbstractPage = async pdfObj => {
  let foundPage;
  pdfObj.pages.forEach((page, index) => {
    let abstractPage = extract(
      page,
      pdfObj.producer,
      { x: 0, y: 0 },
      { x: 600, y: 700 }
    );

    //! TODO Fix to regex
    abstractPage = abstractPage.toUpperCase();
    if (
      abstractPage.includes('RESUMO') &&
      abstractPage.includes('PALAVRAS-CHAVE')
    ) {
      foundPage = index;
    }
  });
  return foundPage;
};

const getAbstractAndKeyWords = async file => {
  const pdfObj = await convert(file, abstractOptions);

  const abstractPage = await findAbstractPage(pdfObj);

  const abstractAndKeyWords = extract(
    pdfObj.pages[abstractPage],
    pdfObj.producer,
    { x: 0, y: 0 },
    { x: 600, y: 700 }
  );

  const abstract = abstractAndKeyWords
    .replace(rmKeyWords, '')
    .match(abstractRE)[0];
  const keyWords = abstractAndKeyWords
    .match(keyWordsRE)[0]
    .split(kWordSeparatorRE)
    .filter(Boolean)
    .trim();

  return { abstract, keyWords };
};

const getTCCData = async file => {
  const basicInfo = await getInfoTCC(file);
  const abstractAndKW = await getAbstractAndKeyWords(file);
  return { ...basicInfo, ...abstractAndKW };
};

module.exports = { getInfoTCC, getAbstractAndKeyWords, getTCCData };
