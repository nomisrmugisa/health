import React, { FunctionComponent, useState, useEffect } from "react";
import "../../styles/langConfig.css";
import { observer } from "mobx-react";
import englishDefault from "../../assets/english.json";
import frenchDefault from "../../assets/french.json";
import { useStore } from "../../Context";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Button, Input, notification } from "antd";

interface MetaDataConfigTypes {
  receiveOutput?: any;
}

const MetaDataConfig: FunctionComponent<MetaDataConfigTypes> = observer(
  ({ receiveOutput }) => {
    const handleSubmit = () => {
      receiveOutput();
    };

    return (
      <div className="lang-config-form-container">
        <form className="lang-config-form">
          <h2 className="lang-config-title-alt">Step 2/2</h2>
          <h2 className="lang-config-title">
            Configure meta-data for the new language:
          </h2>

          <div className="lang-config-inputs-container"></div>

          <div className="button-container-alt">
            <Button
              danger
              ghost
              // onClick={handleCancel}
            >
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

export default MetaDataConfig;
