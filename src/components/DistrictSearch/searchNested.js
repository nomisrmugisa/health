/**
 * Function that receives an array to search through, the fields to search through, and the
 * text to be searched for, and and the name of a field that is unique in each object being searched through
 *
 * -Makes use of the string-similarity npm package
 * -Searches through the array and ranks its content based on the most similar string
 * -Returns a ranked array with the closest matching results
 */

import stringSimilarity from "string-similarity";

export let searchNested = (
  stringToFind,
  arrayToSearchThrough,
  fieldsToSearchThrough,
  nameOfUniqueField
) => {
  let contentsOfAllRelevantFields = [];
  let searchableArray = [];

  let i;
  for (i = 0; i < arrayToSearchThrough.length; i++) {
    let id = arrayToSearchThrough[i][nameOfUniqueField];
    let searchableContent = "";

    let x;
    for (x = 0; x < fieldsToSearchThrough.length; x++) {
      searchableContent += ` ${
        arrayToSearchThrough[i][fieldsToSearchThrough[x]]
      }`;
    }

    let searchableContentAsLowerCase = searchableContent.toLowerCase();

    contentsOfAllRelevantFields.push({
      searchableContent: searchableContentAsLowerCase,
      id
    });
    searchableArray.push(searchableContentAsLowerCase);
  }

  //  Convert the phrase into an array
  let stringAsLowerCase = stringToFind.toLowerCase();
  let stringToFindAsArray = stringAsLowerCase.split(" ");
  let itemsContainingAllWordsOfPhrase = [];

  //  Check if every value of the phrase array is included in each value of the searchable array
  let checker = (arr, target) => target.every(value => arr.includes(value));

  let g;
  for (g = 0; g < searchableArray.length; g++) {
    if (checker(searchableArray[g], stringToFindAsArray) === true) {
      itemsContainingAllWordsOfPhrase.push(searchableArray[g]);
    }
  }

  //  Create the array that will be returned, but its empty for now;
  let finalRankedSortedResults = [];

  //  Rank the results
  if (itemsContainingAllWordsOfPhrase.length) {
    let ratedResults = stringSimilarity.findBestMatch(
      stringToFind,
      itemsContainingAllWordsOfPhrase
    );

    let rankedResults = ratedResults.ratings;

    //  Sort through ranked results
    let sortedRankedResults = rankedResults.sort((a, b) =>
      a.rating > b.rating ? -1 : 1
    );

    //  Build an array to return by pushing any objects from the initial array whose ids / unique fields match those in the sorted search results
    let y;
    for (y = 0; y < sortedRankedResults.length; y++) {
      let parentObjectID;

      let t;

      for (t = 0; t < contentsOfAllRelevantFields.length; t++) {
        if (
          contentsOfAllRelevantFields[t] &&
          contentsOfAllRelevantFields[t].searchableContent
        ) {
          if (
            contentsOfAllRelevantFields[t].searchableContent.toLowerCase() ===
            sortedRankedResults[y].target
          ) {
            parentObjectID = contentsOfAllRelevantFields[t].id;

            let matchingObjectInInitialArray = arrayToSearchThrough.filter(
              item => {
                if (
                  parentObjectID &&
                  item[nameOfUniqueField] === parentObjectID
                ) {
                  return item;
                }
              }
            )[0];

            if (
              matchingObjectInInitialArray &&
              finalRankedSortedResults.includes(
                matchingObjectInInitialArray
              ) === false
            ) {
              finalRankedSortedResults.push(matchingObjectInInitialArray);
            }
          }
        }
      }
    }
  }
  return finalRankedSortedResults;
};

// HOW THE FUNCTION WORKS
/**
 *
 * Build a new Array, Arr1 containing a mishmash of the contents of each of the fields to be searched through
 *
 * ie if im searching through names and bios, create a (name + " " + bio) mishmash, assign it the nameOfUniqueField(which will serve as an id for our purposes) of its parent object and send it to the new array, Arr1
 *
 * go through the new array, Arr1 and build a second array, Arr2 containing only the mishmashes(Because the ranking algorithm needs a purely string array)
 *
 * break down the phrase being searched for into an array of words
 *
 * do a (contains every) search on the newArray to find which values contain every word thats being searched for and if they do, build a third array Arr3 using them (Because we're not searching for a phrase, but for keywords)
 *
 * run the new array Arr3 through the closest matching algoritm to rank them
 *
 * rebuild an array in the ranked order to send back by matching the mishmashes to their matching mishmashes in Arr1 remember Arr1 has ids (nameOfUniqueField) use those to identify which the parent object really is
 *
 * Build a final array of the original parent objects without losing the ranked order
 *
 * return that final array
 *
 *
 */
