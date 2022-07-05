"use strict";
import oldMeta from "./fm2.json";
import fullMetaData from "./fullMetaData.json";
const _ = require("lodash");

export const generateMetadataNames = () => {
  const data1 = Object.keys(oldMeta).map((key) =>
    oldMeta[key].map((it) => it.name)
  );
  console.log("genMeta data1", data1)
  let data = [];
  let lengthEst = 0;
  data1.forEach((it) => (lengthEst = Number(lengthEst) + Number(it.length)));
  data1.forEach((it) => data.push(...it));
   console.log("genMeta data", data)

  data = data.map((key) => ({
    eng: key,
    other: "",
  }));

  return data;
};

export const generateNewMetaObject = (input) => {
  // categoryOptions categoryOptionCombos categories  optionSets options
  let newMeta = _.cloneDeep(oldMeta);

  const categoryOptionsStartIndex = 0;
  const categoryOptionCombosStartIndex =
    newMeta.categoryOptions.length + categoryOptionsStartIndex;

  const categoriesStartIndex =
    newMeta.categoryOptionCombos.length + categoryOptionCombosStartIndex;

  const optionSetsStartIndex = newMeta.categories.length + categoriesStartIndex;

  const optionsStartIndex = newMeta.optionSets.length + optionSetsStartIndex;
  const dataElementsStartIndex = newMeta.options.length + optionsStartIndex;

  // Populate the respective values into a new metadata object;
  // categoryOptions
  let a;
  let aa = 0;
  for (a = categoryOptionsStartIndex; a < categoryOptionCombosStartIndex; a++) {
    const currentVal = newMeta.categoryOptions[aa];
    if (currentVal?.name) {
      currentVal.name = input[a];
      console.log("Currently inside category Options fixing ", currentVal);
      newMeta.categoryOptions[aa] = currentVal;
      aa = Number(aa) + Number(1);
    }
  }

  //   categoryOptionCombos
  let b;
  let bb = 0;
  for (b = categoryOptionCombosStartIndex; b < categoriesStartIndex; b++) {
    const currentVal = newMeta.categoryOptionCombos[bb];

    if (currentVal?.name) {
      currentVal.name = `${input[b]}`;
      newMeta.categoryOptionCombos[bb] = currentVal;
      bb = Number(bb) + Number(1);
    }
  }

  // categories
  let c;
  let cc = 0;
  for (c = categoriesStartIndex; c < optionSetsStartIndex; c++) {
    const currentVal = newMeta.categories[cc];

    if (currentVal?.name) {
      currentVal.name = `${input[c]}`;
      newMeta.categories[cc] = currentVal;
      cc = Number(cc) + Number(1);
    }
  }

  // optionSets
  let d;
  let dd = 0;
  for (d = optionSetsStartIndex; d < optionsStartIndex; d++) {
    const currentVal = newMeta.optionSets[dd];

    if (currentVal?.name) {
      currentVal.name = `${input[d]}`;
      newMeta.optionSets[dd] = currentVal;
      dd = Number(dd) + Number(1);
    }
  }

  // options
  let e;
  let ee = 0;
  for (e = optionsStartIndex; e < input.length; e++) {
    const currentVal = newMeta.options[ee];

    if (currentVal?.name) {
      currentVal.name = `${input[e]}`;
      newMeta.options[ee] = currentVal;
      ee = Number(ee) + Number(1);
    }
  }

  // dataElements
  let f;
  let ff = 0;
  for (f = dataElementsStartIndex; f < input.length; f++) {
    const currentVal = newMeta.dataElements[ff];

    if (currentVal?.name) {
      currentVal.name = `${input[f]}`;
      newMeta.dataElements[ff] = currentVal;
      ff = Number(ff) + Number(1);
    }
  }

  // Place the new metadata into the old metadata object.
  let metaFullClone = _.cloneDeep(fullMetaData);
  Object.keys(newMeta).forEach((key) => {
    let currentVal = fullMetaData[key];
    let newVal = newMeta[key];
    const newValIDS = newVal.map((it) => it.id);
    let unEditedVals = currentVal.filter((item) => {
      if (!newValIDS.includes(item.id)) {
        return item;
      }
    });

    const valToReplaceWith = [...unEditedVals, ...newVal];

    metaFullClone[key] = valToReplaceWith;
  });

  console.log("Meta full clone is ", metaFullClone);
  return metaFullClone;
};
