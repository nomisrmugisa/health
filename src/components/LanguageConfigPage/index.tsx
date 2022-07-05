import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import "../../styles/langConfig.css";
import { observer } from "mobx-react";
import englishDefault from "../../assets/english.json";
import englishMeta from "./fullMetaData.json";
import { useStore } from "../../Context";
import { Button, notification, Select, Spin, Progress } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import MetaDataConfig from "./MetaDataConfig";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import {
  generateMetadataNames,
  generateNewMetaObject,
} from "./metaTranslation";

// console.log("Window location is ", window.location.origin);
const csvNames = {
  meta: "METADATA_TRANSLATION_TEMPLATE.csv",
  ui: "UI_TRANSLATION_TEMPLATE.csv",
};

const languageEncoding = require("detect-file-encoding-and-language");

let templateT: any = {};
templateT["LanguageID"] = `any`;

const ICDLanguages: typeof templateT = {
  // Arabic: "ar",
  English: "en",
  French: "fr",
  // Spanish: "es",
  // Chinese: "zh",
};

let UITranslationTemplateData: { eng: string; other: string }[] = Object.keys(
  englishDefault
).map((key: string) => ({
  eng: key,
  other: "",
}));

let MetaTranslationTemplateData: { eng: string; other: string }[] =
  generateMetadataNames();

console.log("MetaTranslationTemplateData", MetaTranslationTemplateData)

const templateHeaders = [
  { label: "English Version", key: "eng" },
  { label: "Your Language", key: "other" },
];
const englishDefaultLang = {
  language: englishDefault,
  meta: englishMeta,
};

const { Option } = Select;

interface LanguageConfigPageTypes {
  next?: any;
}

const RealLanguageConfigPage: FunctionComponent<LanguageConfigPageTypes> = observer(
  ({ next }) => {
    const store = useStore();
    const [languagesList, setLanguagesList] = useState([
      {
        language: englishDefault,
        meta: englishMeta,
      },
    ]);
    const defaultICDLang = "Select ICD Classification Language";
    const [chosenICDLang, setChosenICDLang] = useState(defaultICDLang);
    const uiTranslationUploader = useRef<HTMLInputElement>(null);
    const metadataTranslationUploader = useRef<HTMLInputElement>(null);
    const langDefault = "Select a Language";
    const currentLanguage = store.activeLanguage;
    const [currentLanguageID, setCurrentLanguageID] = useState("");
    const [currentLanguageName, setCurrentLanguageName] = useState(langDefault);
    const [showConfiguration, setShowConfiguration] = useState(false);
    const [configStep, setConfigStep] = useState(1);
    const [newLanguage, setNewLanguage] = useState(englishDefault);
    const [newLanguageObj, setNewLanguageObj] = useState(englishDefault);
    const [newMetadataObj, setNewMetadataObj] = useState(englishDefault);
    const [newLangValid, setNewLangValid] = useState(false);
    const [newMetadataValid, setNewMetadataValid] = useState(false);
    const [uploadingMetadata, setUploadingMetadata] = useState(false);
    const [newMetaFields, setNewMetaFields] = useState([""]);
    const [newMetaVals, setNewMetaVals] = useState([""]);
    const [chosenLang, setChosenLang] = useState({
      language: englishDefault,
      meta: englishMeta,
    });
    const [loading, setLoading] = useState(false);

    const setLanguage = async (lang: any) => {
      console.log("Lang is ", lang);
      await store.setActiveLanguage(lang);
    };
    const setLanguageMeta = async (meta: any) => {
      await store.postLanguageMeta(meta);
    };
    const getLanguages = async () => {
      let allLanguages = await store
        .getAllLanguages()
        .then((res) => {
          setLoading(false);
          return res;
        })
        .catch((err) => {
          setLoading(false);
          return [];
        });

      allLanguages = allLanguages.filter((it: any) => it.language);


      // Show default language in case there is none in the state
      if (!allLanguages.length) {
        setLoading(true);
        allLanguages = [
          {
            language: englishDefault,
            meta: englishMeta,
          },
        ];
      }

      console.log("AllLang", allLanguages.map(l => l.language.LanguageName))
      setLanguagesList(allLanguages);
    };

    const chooseLanguage = async (lang: any) => {
      const actualLang = languagesList.find(
        (it) => it.language.LanguageName === lang
      );

      if (actualLang?.language && actualLang.meta) {
        setCurrentLanguageName(lang);
        setChosenLang(actualLang);
      }
    };

    const confirmLangChoice = async () => {
      setLoading(true);
      // Notify setting language
      notification.info({
        message: "Update",
        description: "Setting Chosen language for UI",
        duration: 2,
      });

      const icdLang = ICDLanguages[`${chosenICDLang}`];
      // Update the active language
      await store.saveActiveLanguage(
        chosenLang.language.LanguageName,
        chosenLang.language,
        icdLang,
        true // Update is true
      );
      await setLanguage(chosenLang.language);

      // Notify setting ICD Lang
      // Set ICD Lang
      notification.info({
        message: "Update",
        description: "Setting Chosen language for ICD Clasification",
        duration: 2,
      });
      
      store.setICDLang(icdLang);

      if (chosenLang?.language.LanguageName) {
        setCurrentLanguageID(chosenLang.language?.LanguageID);
        setCurrentLanguageName(chosenLang.language?.LanguageName);

        // Notify posting meta
        notification.info({
          message: "Update",
          description: "Setting Metadata",
          duration: 2,
        });
        // setLoading(false);
        await setLanguageMeta(chosenLang?.meta)
          .then((res) => setLoading(false))
          .catch((err) => setLoading(false));
      } else {
        setLoading(false);
      }
      next();
    };

    const saveAllNewData = () => {
      store.saveNewLang(
        newLanguageObj?.LanguageName,
        newLanguageObj,
        newMetadataObj
      );

      console.log("Just saved", newMetadataObj);
      notification.success({
        message: "Update",
        description: "Language saved successfully",
        onClick: () => {
          setLoading(true);
          getLanguages();
        },
        onClose: () => {
          setLoading(true);
          notification.info({
            message: "Update",
            description: "Getting new languages list from store",
            duration: 2,
          });
          getLanguages();
        },
        duration: 2,
      });

      store.getSingleLanguage("English");
    };

    const uploadUICSV = async (e: any) => {
      const fileReceived = e.target.files[0];
      const fileinfo = await languageEncoding(fileReceived)
      const { encoding } = fileinfo;

      console.log("encoding ui csv", fileinfo)

      Papa.parse(fileReceived, {
        header: true,
        dynamicTyping: true,
        encoding: encoding || "",
        complete: function (results) {
          let finalRes: typeof templateT = {};

          if (results?.data && typeof results?.data === typeof []) {
            results.data.forEach((it: typeof templateT) => {
              if (
                it["English Version"] &&
                `${it["Your Language"]}` &&
                `${it["Your Language"]}` !== "" &&
                it["Your Language"] !== null
              ) {
                finalRes[it["English Version"]] = `${it["Your Language"]}`;
              }
            });
          }

          setNewLanguageObj(finalRes);
        },
      });
    };

    const uploadMetaCSV = async (e: any) => {
      
      setUploadingMetadata(true);
      const fileReceived = e.target.files[0];
      const { encoding } = await languageEncoding(fileReceived)

      console.log("encoding meta csv", encoding)

      Papa.parse(fileReceived, {
        header: true,
        dynamicTyping: true,
        encoding: encoding || "",
        complete: function (results) {
          let fields = [""];
          let vals = [""];
          if (results?.data && typeof results?.data === typeof []) {
            results.data.forEach((it: typeof templateT, index) => {
              const valsExist = it["English Version"] && it["Your Language"];
              if (valsExist) {
                if (fields[0] === "") {
                  fields = [it["English Version"]];
                  vals = [it["Your Language"]];
                } else {
                  fields.push(it["English Version"]);
                  vals.push(it["Your Language"]);
                }
              }
            });
          }
          // setUploadingMetadata(false);
          setNewMetaFields(fields);
          setNewMetaVals(vals);
        },
        error: function(e){
          setUploadingMetadata(false);
          console.log(e);
        }
      });
    };

    const handleInitiateUIUpload = () => {
      if (null !== uiTranslationUploader.current) {
        uiTranslationUploader.current.click();
      }
    };

    const handleInitiateMetaUpload = () => {
      if (null !== metadataTranslationUploader.current) {
        metadataTranslationUploader.current.click();
      }
    };

    useEffect(() => {
      if (englishDefault === newLanguageObj) return;

      // Validating the new language
      const allFields = Object.keys(englishDefault);
      const newLangFields = Object.keys(newLanguageObj);

      // Validation checks
      const someFieldsEmpty = !Object.values(newLanguageObj).some(
        (x) => x !== null && x !== ""
      );
      const noNewFields = newLangFields.every((x) => allFields.includes(x));
      const allFieldsPresent = allFields.every((x) =>
        newLangFields.includes(x)
      );

      // Validation error messages
      if (!noNewFields || !allFieldsPresent || someFieldsEmpty) {
        if (!noNewFields) {
          notification.error({
            message: "Validation Error!",
            description: `Did you add any new fields not present in the template to your ${csvNames.meta}?`,
            onClick: () => {},
            duration: 3,
          });
        }

        if (!allFieldsPresent) {
          notification.error({
            message: "Validation Error!",
            description: `Some of the fields provided in the template ${csvNames.meta} are missing in your submission!`,
            onClick: () => {},
            duration: 3,
          });
        }

        if (someFieldsEmpty) {
          notification.error({
            message: "Validation Error!",
            description: `Some of the values in your ${csvNames.meta} are empty!`,
            onClick: () => {},
            duration: 3,
          });
        }
        setNewLangValid(false);
      } else {
        notification.success({
          message: "Validation Passed!",
          description: "Your translation passed all validation checks!",
          onClick: () => {},
          duration: 2,
        });
        setNewLangValid(true);
      }
    }, [newLanguageObj]);

    useEffect(() => {
      console.log(newMetaFields, newMetaVals);
      if (!uploadingMetadata) return;
      
      if (!(newMetaFields.length > 1) || !(newMetaVals.length > 1)) return;

      // Validating the new metadata
      const allFields = MetaTranslationTemplateData.map((it) => it.eng);

      // Validation checks
      const someFieldsEmpty = !newMetaVals.some((x) => x !== null && x !== "");
      const noNewFields = newMetaFields.every((x) => allFields.includes(x));
      const allFieldsPresent =
        allFields.every((x) => newMetaFields.includes(x)) &&
        allFields.length === newMetaFields.length;

      // Validation error messages
      if (!noNewFields || !allFieldsPresent || someFieldsEmpty) {
        if (!noNewFields) {
          let theNewFields = [""];

          newMetaFields.forEach((item, index) => {
            if (!allFields.includes(item)) {
              if (theNewFields[0] === "") {
                theNewFields[0] = `Found new field ${item} on line ${
                  index + 2
                }`;
              } else {
                theNewFields.push(
                  `Found new field ${item} on line ${index + 2}`
                );
              }
            }
          });
          if (typeof theNewFields?.[0] === "string") {
            console.log("New fields are ", theNewFields);
          }

          notification.error({
            message: "Validation Error!",
            description: (
              <span>
                Did you add any new fields not present in the template to your
                {" " + csvNames.meta}?
                <br />
                <br />
                {theNewFields.map((item, index) => (
                  <>
                    ({index + 1}). {item}
                    <br />
                  </>
                ))}
              </span>
            ),
            onClick: () => {},
            duration: 10,
          });
          setUploadingMetadata(false);
          return setNewMetadataValid(false);
        }

        if (someFieldsEmpty) {
          notification.error({
            message: "Validation Error!",
            description: `Some of the values in your ${csvNames.meta} are empty!`,
            onClick: () => {},
            duration: 3,
          });
          setUploadingMetadata(false);
          return setNewMetadataValid(false);
        }

        if (!allFieldsPresent) {
          notification.error({
            message: "Validation Error!",
            description: `Some of the fields provided in the template ${csvNames.meta} csv are missing in your submission!`,
            onClick: () => {},
            duration: 3,
          });
          setUploadingMetadata(false);
          return setNewMetadataValid(false);
        }
      } else {
        notification.success({
          message: "Validation Passed!",
          description: `Your ${csvNames.meta} translation passed all validation checks!`,
          onClick: () => {},
          duration: 2,
        });

        setNewMetadataObj(generateNewMetaObject(newMetaVals));
        setNewMetadataValid(true);
      }
      setUploadingMetadata(false);
    }, [newMetaFields, newMetaVals]);

    useEffect(() => {
      setLoading(true);
      getLanguages();
    }, []);

    return (
      <div className="lang-config-form-container">
        <form className="lang-config-form">
          <h2 className="lang-config-title">
            Please choose a language or configure a new one
          </h2>

          <Spin spinning={loading}>
            <Select
              style={{ width: "100%" }}
              size="large"
              key={`${Math.random()}`}
              value={currentLanguageName}
              onChange={(e: any) => {
                console.log("Sending e as ", e);
                chooseLanguage(e);
              }}
            >
              {languagesList?.length &&
                languagesList.map((option: any) => (
                  <Option
                    key={option.language.LanguageName}
                    value={option.language.LanguageName}
                  >
                    {option.language.LanguageName}
                  </Option>
                ))}
            </Select>

            <Select
              style={{ width: "100%", marginTop: "1rem" }}
              size="large"
              key={`${Math.random()}`}
              value={chosenICDLang}
              onChange={(e: any) => {
                setChosenICDLang(e);
              }}
            >
              {Object.keys(ICDLanguages)?.map((option: any) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Spin>

          <div className="button-container">
            <Button
              type="primary"
              onClick={confirmLangChoice}
              disabled={
                loading ||
                chosenICDLang === defaultICDLang ||
                currentLanguageName === langDefault
              }
            >
              Confirm Selection
            </Button>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <h2>Configure a new language below</h2>
            <small>
              Download <b style={{ color: "red" }}>both</b> the Metadata and the
              UI configuration files, translate them by yourself, then upload
              them here.
              <br />
              <b style={{ color: "red" }}>Please note:</b> It may take up to 5
              minutes for your language to reflect in the store. If you do not
              see it immediately after uploading, be patient and refresh.
            </small>
          </div>

          <div className="button-container">
            <CSVLink
              data={UITranslationTemplateData}
              headers={templateHeaders}
              filename={csvNames.ui}
              target="_blank"
            >
              <Button type="primary" ghost>
                Download UI Configuration CSV
              </Button>
            </CSVLink>

            <Button type="primary" onClick={handleInitiateUIUpload}>
              {newLangValid ? (
                <CheckCircleOutlined
                  style={{
                    color: "#ffffff",
                    marginRight: "10px",
                    fontSize: "17px",
                  }}
                />
              ) : null}{" "}
              <span>Upload UI Configuration CSV</span>
            </Button>
            <input
              style={{ display: "none" }}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={uploadUICSV}
              ref={uiTranslationUploader}
            />
          </div>

          <div className="button-container">
            <CSVLink
              data={MetaTranslationTemplateData}
              headers={templateHeaders}
              filename={csvNames.meta}
              target="_blank"
            >
              <Button type="primary" ghost>
                Download Metadata Configuration CSV
              </Button>
            </CSVLink>

            <Button type="primary" onClick={handleInitiateMetaUpload}>
              {newMetadataValid ? (
                <CheckCircleOutlined
                  style={{
                    color: "#ffffff",
                    marginRight: "10px",
                    fontSize: "17px",
                  }}
                />
              ) : null}{" "}
              <span>Upload Metadata Configuration CSV</span>
            </Button>
            <input
              style={{ display: "none" }}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={uploadMetaCSV}
              ref={metadataTranslationUploader}
            />
          </div>

          <div className="button-container">
            <Button
              type="primary"
              onClick={saveAllNewData}
              size="large"
              disabled={!newLangValid || !newMetadataValid}
            >
              Finish Configuration
            </Button>
          </div>
        </form>
      </div>
    );
  }
);


const LanguageConfigPage: FunctionComponent<LanguageConfigPageTypes> = observer(
  ({ next }) => {

    const store = useStore();
    const [loading, setLoading] = useState(false);
    const [exists, setExists] = useState(false);

    const checkForProgram = async () => {
      let existsn = await store
        .checkProgramExists()
        .then((res) => {
          setLoading(false);
          if (res)
          setExists(true);
        })
        .catch((err) => {
          setLoading(false);
          setExists(false);
        });
    }

    const createProgram = async () => {
      setLoading(true);
      await store
        .createProgram()
        .then((res) => {
          checkForProgram();
        })
        .catch((err) => {
          console.log("Error creating program", err)
          setLoading(false);
        });
    }

    useEffect(() => {
      setLoading(true);
      checkForProgram();
      // getLanguages();
    }, []);

    if (exists) {
      return (<RealLanguageConfigPage next={next} />);
    } else {
      return (
          <div className="lang-config-form-container">
              { loading ? (<Spin spinning={loading}></Spin>):(
                <div className="button-container">
                  <Button
                    className="p-3"
                    type="primary"
                    onClick={createProgram}
                  >
                    <h4>Install Metadata</h4>
                  </Button>
            </div>
            ) }
        </div>
          );
      
      }
    


  }

);

export default LanguageConfigPage;
