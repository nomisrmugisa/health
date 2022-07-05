import React, { FunctionComponent, useState, useEffect } from "react";
import "../../styles/langConfig.css";
import { observer } from "mobx-react";
import englishDefault from "../../assets/english.json";
import frenchDefault from "../../assets/french.json";
import { useStore } from "../../Context";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Button, Select, Input, notification } from "antd";
const { Option } = Select;

// let defaultObj = {}

interface ConfigurationPageTypes {
  receiveOutput?: any;
  listLength: number;
}

const ConfigurationPage: FunctionComponent<ConfigurationPageTypes> = observer(
  ({ receiveOutput, listLength }) => {
    let defaultObj: any = {};
    defaultObj["LanguageID"] = `${listLength + 1}`;

    const store = useStore();
    const [languagesList, setLanguagesList] = useState([
      englishDefault,
      frenchDefault,
    ]);
    const langDefault = "Select a Language";
    const currentLanguage = store.activeLanguage;
    const [currentLanguageID, setCurrentLanguageID] = useState("");
    const [currentLanguageName, setCurrentLanguageName] = useState(langDefault);
    const [showConfiguration, setShowConfiguration] = useState(false);
    const [newLang, setNewLang] = useState(defaultObj);

    const setLanguage = (lang: any) => store.setActiveLanguage(lang);
    const getLanguages = async () => {};

    const handleSubmit = () => {
      receiveOutput(englishDefault);
      return;
      let allExist = true;
      Object.keys(englishDefault).forEach(
        (key) => (allExist = allExist && !!newLang[`${key}`])
      );

      if (!allExist) {
        notification.warn({
          message: "Missing Input!",
          description: "Please fill in all the fields provided",
        });
      }
      console.log("Valid mofo");
    };
    const handleCancel = () => {};

    return (
      <div className="lang-config-form-container">
        <form className="lang-config-form">
          <h2 className="lang-config-title-alt">Step 1/2</h2>
          <h2 className="lang-config-title">Configure a new language:</h2>

          <div className="lang-config-inputs-container">
            {Object.keys(englishDefault).map((key, index, arr) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              return isFirst ? null : (
                <div key={key}>
                  <div
                    className={`lang-config-input-container`}
                    style={{
                      borderBottomWidth: isSecond ? "1.5px" : "0.5px",
                      borderBottomColor: isSecond
                        ? "rgb(180, 179, 179)"
                        : "rgb(180, 179, 179, 0.5)",
                      background: isSecond ? "rgb(114, 170, 253, 0.07)" : "",
                    }}
                  >
                    {isSecond ? null : (
                      <small className="lang-config-count">{`${index - 1}/${
                        arr.length - 2
                      }`}</small>
                    )}
                    <p style={{ fontWeight: isSecond ? "bold" : "initial" }}>
                      {isSecond ? "Name this language" : key}
                    </p>
                    <div className="lang-config-input">
                      <Input
                        value={newLang[`${key}`] || ""}
                        onChange={(e: any) =>
                          setNewLang({ ...newLang, [key]: e?.target?.value })
                        }
                      />
                    </div>
                  </div>
                  {isSecond ? (
                    <div
                      key={Math.random()}
                      style={{
                        marginTop: "2rem",
                        background: "rgb(114, 170, 253, 0.07)",
                      }}
                    >
                      <small>
                        You are creating a new language configuration file.
                      </small>
                      <br />
                      <small style={{ color: "red" }}>
                        Translate each phrase below to the language you are
                        creating. Include any punctuation.
                      </small>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="button-container-alt">
            <Button danger ghost onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              //   onClick={() => setShowConfiguration(true)}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    );
  }
);

export default ConfigurationPage;
