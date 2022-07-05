// To add indicator deaths add an arrar of prefixes

import moment from "moment";

// then go to next comment
const malariaCodePrefixes = [
  "1F4",
  "1D02",
  "DB90",
  "QA08",
  "XN7K1",
  " XM1941",
  "XM37R2",
  "XM5WN6",
  "KA64",
  "QC42",
  "MG55",
  "1C61",
  "JB63",
  "1C62",
];
const tBCodePrefixes = ["1b1", "JB6", "1C6"];
const hivCodePrefixes = [
  "1C62",
  "EB05",
  "EL3Y",
  "9B72",
  "MA14",
  "1C60",
  "1C61",
  "EA94",
  "EA9Y",
  "XN487",
  "XN8LD",
  "XN71W",
  "8A45",
  "8D83",
  "1C62",
  "4B23",
  "6D85",
  "MG24",
  "QA08",
  "QA14",
  "XM3U67",
  "BB01",
  "KA62",
  "QC90",
  "MG53",
  "QC60",
  "XE5CU",
  "JB63",
  "QC6Y",
];

const cardiovascularCodePrefixes = ["8B20","8A04.33","8A05.1Y","8A07.01","8B00.Z","8B11","8B25.4","8B26.0","JB64.4","NF01.0","NF08.0","8B22.9","6D81","8A60.1","8B26.1","8B26.4","8B26.50","8B26.51","8B26.5Y","8B26.5Z","8B26.Y","KB00.0","NF06.0","QC69","KB00.Y","SD30","SD31","SD3Y","SD3Z","8B25.0","MG30.50","8A60.00","8C73.Y","BA00","BA01","BA02","BA03","BA04","8B22.8","8D60.Y","9B71.1","9C61.01","BB01","DA21.20","DB98.7","DB99.3","JA23","KB45","MG24.6","QADA.6","X2PT6","1F86.Z","6D81","DA43.3","DA97.3","DB34.3","JA24.Z","L24.8Y","MC80.00","5A72.0","8B00.Z","KB42","BD41.Y","CA25.Z","DA21.3","BD10","BA01","BA80.Z","BD14","KB40.Y","BD11.0","BD10&XS3A","BD10&XS6B","BD10&XS9T","BD10&XS9F","BC90.Y","BA80.0","BA80.Z","BA8Y","BA8Z","BA51","BD11.0"," BD11.2","BD11.1",];
const cancerCodePrefixes = ["2D4Z","MG24.0Z","2A00.5","2A01.2","2A02","2B50.Z","2B5K","2B5Z","2B60.Z","2B62.Z","2B63.Z","2B64.Z","2B65.Z","2B69.Z","2B6A.Z","2B6B.Z","2B6D.Z","2B6E.Z","2B70.Z","2B72.Z","2B80.0Z","2B80.1Y","2B81.Z","2B90.0Z","2B90.3Z","2B90.Z","2B91.Z","2B92.Z","2B9Z","2C00.Z","2C0Z","2C0Z","2C10.Z","2C11.Z","2C12.0","2C13.Z","2C16.Z","2C20.Z","2C23.1","2C23.2","2C23.Z","2C24.Z","2C74.Z","2C75.Z","2C76.Z","2C77.Z","2C78","2C79",];
const pulmonaryCodePrefixes = ["CA22","BB01.2"];

const DiabetesMellitusCodePrefixes = ["5A10","5A11","5A12","5A13","5A14","5A21","5A22","5A24","5A2Y","5A61.5","8C12.Y","9C61.32","DA93.Y","EC90.1Y","JA63","KB60.2","QA0A.10","8C73.Y","8D88.1","FA38.10","HA01.1Z","MF83","QC64.0","CA25.Z","DA0C.Y","EL3Y","LD27.0Y","QA10","DC30.Y","9B71.00&XS25","SC53.2Y"];
const PrematureNCDCodePrefixes = ["5B5A.0Z","BA00.Z","BA5Y","BD10","BD1Z","BE2Y","BE2Z","C82.Z","MC84","MG40.Z","XA4PM9,1A62.1","1C1E.2","5C56.0Y,MG24.7","QA02.Y","W3Y","W3Z","A01","KB4Y","KB4Z","QA0B","PC98","1A60.4","4A62","MC91","XE945","QAOA.6","BC42Y","PK91","QA6Y","1F53.2","1F53.Y","BE14.B","NE60","2D4Z","MG24.0Z","2A00.5","2A01.2","2A02","2B50.Z","2B5K","2B5Z","2B60.Z","2B62.Z","2B63.Z","2B64.Z","2B65.Z","2B69.Z","2B6A.Z","2B6B.Z","2B6D.Z","2B6E.Z","2B70.Z","2B72.Z","2B80.0Z","2B80.1Y","2B81.Z","2B90.0Z","2B90.3Z","2B90.Z","2B91.Z","2B92.Z","2B9Z","2C00.Z","2C0Z","2C0Z","2C10.Z","2C11.Z","2C12.0","2C13.Z","2C16.Z","2C20.Z","2C23.1","2C23.2","2C23.Z","2C24.Z","2C74.Z","2C75.Z","2C76.Z","2C77.Z","2C78","2C79","5A10","5A11,5A12","5A13.3","5A13.4","5A13.Y","5A14","5A21.Z","5A22","5A23","5A24","5A44","5A61.5","5C64.1Y","5C64.3,8C03.0","8C12.Y","9B71.0","9B10.21","9C40.40","9C61.32","BD54","EB90.0","EE7Y","FA38.0","GB61.Z","GB90.4A","JA63.2","KB60.1","LD2H.Y","MF83","8B94","BC43.7","KB60.2Z","XM8S35","5A41","8E4A.1","XM5DC4","XM5SK7","XM11C9","BD53.Y","CB7Z","KB29","QC6Y","CA22.1","COPD"];
const covid19CodePrefixes = ["RA01","QA08.5","RA02","XN109","XM68M6","XM1NL1","XM5DF6","XM9Q8","XM0CX4","XM5JC5","XM1J92","XM6AT1","XM0GQ8","QC01.9","QC42.0","RA01.0/CA401.1","RA03","RA01.1/CA40.1","PL00"];
const pneumoniaCodePrefixes = ["CA40","CA40.1","CA40.2","CA40.Y","CA40.Z","1A07.Y","1C12.0/CA40","1A09.Y/CA40.0","1F02.Y/1F02","1F03.Y/CA40.1","CA40.0Y&XN25B","CA40.0Y/1C22","CA40.Z&XB25","1A72.Y","1B10.Z","1B40.Y","1B93.2","1B94.Y","1B97","1C19.1","1C1B.0","1C2","1E32","1E90.Y","1F20.0Y","1F23.31","1F25.01","1F27.0","1F2A.0","1F57.2","1F62","CA41.Z","CA43.0","CA71.0","CA71.1","CA71.3","CA82.0","CB02.11","CB03.Z"];
const diarrheaCodePrefixes = ["ME05.1","VV40","1AO6","1A2Z","1A31","1A36.0Z","1A3Y","1A40.Z","1F6B","DA90.0","DA96.01","DD91.2","1A40.0","DEE11","XM8A95","XM8D61","1A04","DA90.1","DD91.01","SA55","XM1CE0","KB8C","5C61.1","DA90.Y","3A10.Y","NE60","DD93","SD92","2C10.1","WDHA","XM4GA5","PB28","PE88","PC98","PH48","PL00"];
const RoadTrafficAccidentsCodePrefixes = ["PA0Z","PAOD&XE9EE&XE42A","PA0D","PA1D&XE42A","PA1D&XE1LZ","PA0D&XE9EE&XE166","PA1D&XE166"];
const SuicideCodePrefixes = ["PD3Z","XE97V","MB23.R","MB23.S","MB26.A","PC6Z","PC7O","PC71","MB23.E","QC4B","QC65","QA02.7","XE76W","XE3YR","XM2KR7","XE19R"];
const maternalCodePrefixes = ["5C50.02","6E20","JA24.Z","JA86.Y","XM9F18","KA80.4","JA8A.0","JA65.2","JA65.6","JA83.Z","JA84.Y","KB60.1","LD2F.Y","LD46.0","LD44.F","8C73.Y","JA63.2","JA65.3","JA65.4","JA82.0","JA82.1","JA82.2","JA82.6","JA82.Z","JA83.0","JA84.0","JA84.1","JA84.3","JA84.4","JA84.5","JA85.0","JA86.1","JA86.2","JA86.5","JA87","JA88.Y","JA8A.2","JB0D.Y","LD2H.Y","LD45.0","JA25.3","JA86.0","JA86.3","KA07","LD44.E","5A71.1","JB05","JB0D.0","KA06.1"];
const injuriesCodePrefixes = ["9B11.0","AB37","EH90.Z","NA06.4","NA06.6Z","NA07.0","NAO7.Y","NAO7.Z","NA0B","NAOZ","NA6Z","NB30.0Z","NB31","NB32.3Z","NB32.4","NB32.6","NB32.8","NB3Z","NB91.0","NB91.1","NB91.4","NB91.5","NB91.6","NB91.7Y","NB91.8","NB91.9","NB91.A","NB91.Y","NB91.Z","NB92.0","NB98","NB9Z","NC1Z","NC3Z"];
const totalNCDDeathsCodePrefixes = ["8B20","8A04.33","8A05.1Y","8A07.01","8B00.Z","8B11","8B25.4","8B26.0","JB64.4","NF01.0","NF08.0","8B22.9","6D81","8A60.1","8B26.1","8B26.4","8B26.50","8B26.51","8B26.5Y","8B26.5Z","8B26.Y","KB00.0","NF06.0","QC69","KB00.Y","SD30","SD31","SD3Y","SD3Z","8B25.0","MG30.50","8A60.00","8C73.Y","BA00","BA01","BA02","BA03","BA04","8B22.8","8D60.Y","9B71.1","9C61.01","BB01","DA21.20","DB98.7","DB99.3","JA23","KB45","MG24.6","QADA.6","X2PT6","1F86.Z","6D81","DA43.3","DA97.3","DB34.3","JA24.Z","L24.8Y","MC80.00","5A72.0","8B00.Z","KB42","BD41.Y","CA25.Z","DA21.3","BD10","BA01","BA80.Z","BD14","KB40.Y","BD11.0","BD10&XS3A","BD10&XS6B","BD10&XS9T","BD10&XS9F","BC90.Y","BA80.0","BA80.Z","BA8Y","BA8Z","BA51","BD11.0"," BD11.2","BD11.1","2D4Z","MG24.0Z","2A00.5","2A01.2","2A02","2B50.Z","2B5K","2B5Z","2B60.Z","2B62.Z","2B63.Z","2B64.Z","2B65.Z","2B69.Z","2B6A.Z","2B6B.Z","2B6D.Z","2B6E.Z","2B70.Z","2B72.Z","2B80.0Z","2B80.1Y","2B81.Z","2B90.0Z","2B90.3Z","2B90.Z","2B91.Z","2B92.Z","2B9Z","2C00.Z","2C0Z","2C0Z","2C10.Z","2C11.Z","2C12.0","2C13.Z","2C16.Z","2C20.Z","2C23.1","2C23.2","2C23.Z","2C24.Z","2C74.Z","2C75.Z","2C76.Z","2C77.Z","2C78","2C79","CA22","BB01.2","5A10","5A11","5A12","5A13","5A14","5A21","5A22","5A24","5A2Y","5A61.5","8C12.Y","9C61.32","DA93.Y","EC90.1Y","JA63","KB60.2","QA0A.10","8C73.Y","8D88.1","FA38.10","HA01.1Z","MF83","QC64.0","CA25.Z","DA0C.Y","EL3Y","LD27.0Y","QA10","DC30.Y","9B71.00&XS25","SC53.2Y","5B5A.0Z","BA00.Z","BA5Y","BD10","BD1Z","BE2Y","BE2Z","C82.Z","MC84","MG40.Z","XA4PM9,1A62.1","1C1E.2","5C56.0Y,MG24.7","QA02.Y","W3Y","W3Z","A01","KB4Y","KB4Z","QA0B","PC98","1A60.4","4A62","MC91","XE945","QAOA.6","BC42Y","PK91","QA6Y","1F53.2","1F53.Y","BE14.B","NE60","2D4Z","MG24.0Z","2A00.5","2A01.2","2A02","2B50.Z","2B5K","2B5Z","2B60.Z","2B62.Z","2B63.Z","2B64.Z","2B65.Z","2B69.Z","2B6A.Z","2B6B.Z","2B6D.Z","2B6E.Z","2B70.Z","2B72.Z","2B80.0Z","2B80.1Y","2B81.Z","2B90.0Z","2B90.3Z","2B90.Z","2B91.Z","2B92.Z","2B9Z","2C00.Z","2C0Z","2C0Z","2C10.Z","2C11.Z","2C12.0","2C13.Z","2C16.Z","2C20.Z","2C23.1","2C23.2","2C23.Z","2C24.Z","2C74.Z","2C75.Z","2C76.Z","2C77.Z","2C78","2C79","5A10","5A11,5A12","5A13.3","5A13.4","5A13.Y","5A14","5A21.Z","5A22","5A23","5A24","5A44","5A61.5","5C64.1Y","5C64.3,8C03.0","8C12.Y","9B71.0","9B10.21","9C40.40","9C61.32","BD54","EB90.0","EE7Y","FA38.0","GB61.Z","GB90.4A","JA63.2","KB60.1","LD2H.Y","MF83","8B94","BC43.7","KB60.2Z","XM8S35","5A41","8E4A.1","XM5DC4","XM5SK7","XM11C9","BD53.Y","CB7Z","KB29","QC6Y","CA22.1","COPD"];
const totalCommunicableDeathsPrefixes = ["1F4","1D02","DB90","QA08","XN7K1","XM1941","XM37R2","XM5WN6","KA64","QC42","MG55","1C61","JB63","1C62","1b1","JB6","1C6","1C62","EB05","EL3Y","9B72","MA14","1C60","1C61","EA94","EA9Y","XN487","XN8LD","XN71W","8A45","8D83","1C62","4B23","6D85","MG24","QA08","QA14","XM3U67","BB01","KA62","QC90","MG53","QC60","XE5CU","JB63","QC6Y","RA01","QA08.5","RA02","XN109","XM68M6","XM1NL1","XM5DF6","XM9Q8","XM0CX4","XM5JC5","XM1J92","XM6AT1","XM0GQ8","QC01.9","QC42.0","RA01.0/CA401.1","RA03","RA01.1/CA40.1","PL00","CA40","CA40.1","CA40.2","CA40.Y","CA40.Z","1A07.Y","1C12.0/CA40","1A09.Y/CA40.0","1F02.Y/1F02","1F03.Y/CA40.1","CA40.0Y&XN25B","CA40.0Y/1C22","CA40.Z&XB25","1A72.Y","1B10.Z","1B40.Y","1B93.2","1B94.Y","1B97","1C19.1","1C1B.0","1C2","1E32","1E90.Y","1F20.0Y","1F23.31","1F25.01","1F27.0","1F2A.0","1F57.2","1F62","CA41.Z","CA43.0","CA71.0","CA71.1","CA71.3","CA82.0","CB02.11","CB03.Z","ME05.1","VV40","1AO6","1A2Z","1A31","1A36.0Z","1A3Y","1A40.Z","1F6B","DA90.0","DA96.01","DD91.2","1A40.0","DEE11","XM8A95","XM8D61","1A04","DA90.1","DD91.01","SA55","XM1CE0","KB8C","5C61.1","DA90.Y","3A10.Y","NE60","DD93","SD92","2C10.1","WDHA","XM4GA5","PB28","PE88","PC98","PH48","PL00"];
// add the select option matching with prefix array
// then go to EventList file and add the option to the selection component
const deathCodePrefixes = {
  "Malaria Deaths": malariaCodePrefixes,
  "TB Deaths": tBCodePrefixes,
  "HIV Related Deaths": hivCodePrefixes,
  "Deaths from cardiovascular diseases": cardiovascularCodePrefixes,
  "Cancer Deaths": cancerCodePrefixes,
  "Obstructive Pulmonary Disease": pulmonaryCodePrefixes,
  "Diabetes Mellitus": DiabetesMellitusCodePrefixes,
  "Premature noncommunicable disease (NCD)": PrematureNCDCodePrefixes,
  "covid19": covid19CodePrefixes,
  "pneumonia": pneumoniaCodePrefixes,
  "diarrhea": diarrheaCodePrefixes,
  "Road traffic accidents": RoadTrafficAccidentsCodePrefixes,
  "Suicide": SuicideCodePrefixes,
  "Maternal deaths": maternalCodePrefixes,
  "injuries": injuriesCodePrefixes,
  "Total NCD Deaths": totalNCDDeathsCodePrefixes,
  "Total Communicable Deaths": totalCommunicableDeathsPrefixes,
   
};
interface EventFilter {
  apply(diseases: Record<string, any>, filter: string): Record<string, any>;
}

function matchCodePrefixes(prefixes = [], code) {
  let foundCode = false;
  for (let mi = 0; mi < prefixes.length; mi++) {
    // console.log(
    //   "----------------------------code-----------",
    //   code,
    //   prefixes[mi],
    //   code.startsWith(prefixes[mi])
    // );
    foundCode = code.startsWith(prefixes[mi]);
    if (foundCode) break;
  }
  return foundCode;
}

export class CauseOfDeathFilter implements EventFilter {
  apply(diseases: Record<string, any>, filter: string): Record<string, any> {
    if (deathCodePrefixes[filter]) {
      return Object.keys(diseases)
        .filter((key) =>
          matchCodePrefixes(deathCodePrefixes[filter], diseases[key].code)
        )
        .reduce((d, key) => {
          d[key] = diseases[key];
          return d;
        }, {});
    }
    return diseases;
  }
}

export class MortalityFilter implements EventFilter {
  apply(diseases: Record<string, any>, filter: string): Record<string, any> {
    if (filter) {
      Object.keys(diseases).forEach((key) => {
        let count = diseases[key].count;
        let affected = diseases[key].affected;

        if (count > 0 && affected) {
          affected = affected.filter(d => filterbyLifeDuration(d.dob, d.dod, filter))
        }
        diseases[key].count = affected.length;
        diseases[key].affected = affected;
      });

    }
    return diseases;
  }
}

export class GenderFilter implements EventFilter {
  apply(diseases: Record<string, any>, filter: string): Record<string, any> {
    if (filter) {
      // return Object.keys(diseases)
      //   .map((key) => {
      //     const d = diseases[key];
      //     const f = d.gender === filter;
      //     // console.log(f, filter);
      //     if (!f && d.count > 0) d.count -= 1;
      //     return d;
      //   })
      //   .reduce((d, c) => {
      //     d[c.name] = c;
      //     return d;
      //   }, {});
        Object.keys(diseases).forEach((key) => {
          let count = diseases[key].count;
          let affected = diseases[key].affected;

          if (count > 0 && diseases[key].affected) {
            affected = diseases[key].affected.filter((d) => d.gender === filter );     
            
          }
          diseases[key].count = affected.length;
          diseases[key].affected = affected
        });
        return diseases;
    }
    return diseases;
  }
}

function filterbyLifeDuration(
  dob: string,
  dod: string,
  lifeDurationFilter: string
): boolean {
  if (!lifeDurationFilter) return false;
  let foundDuration = false;
  let durationStr = "";
  if (dob) {
    durationStr = moment(dob).from(dod);
  }
  // console.log(lifeDurationFilter, durationStr);
  if (durationStr) {
    
    const parts = durationStr.split(" ");
    const num = +parts[0];
    const period = parts[1];
    switch (lifeDurationFilter) {
      case "Stillbirth":
      case "Early Neonatal":
        foundDuration =
          period.startsWith("day") ||
          period === "week" ||
          period.startsWith("hour") ||
          period.startsWith("minute") ||
          period.startsWith("second");
        break;
      case "Neonatal":
        foundDuration = (period === "weeks" && num <= 4) || period === "month";
        break;
      case "Infant":
        foundDuration =
          (period === "weeks" && num > 4) ||
          period === "months" ||
          period === "year";
        break;
      case "Under-five":
        foundDuration = period === "years" && num <= 5;
        break;
      case "Adolescent":
        foundDuration = period === "years" && num <= 19 && num >= 10;
        break;
      case "Adult":
        foundDuration = period === "years" && num <= 60 && num >= 15;
        break;
    }
    // if(foundDuration) {
    //   console.log(durationStr);
    //   console.log(foundDuration);
    // }
    
  }
  return foundDuration;
}
