import React, { SFC } from "react";
import * as ECT from "@whoicd/icd11ect";
import "@whoicd/icd11ect/style.css";
import { Input, Modal } from "antd";
import { useStore } from "./../Context";

interface ICDProps {
  visible: boolean;
  field: string;
  handleOk: (selectedEntity: any) => void;
}
export const ICDDialog: SFC<ICDProps> = ({ visible, handleOk, field }) => {
  const store = useStore();

  const mySettings = {
    apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
    autoBind: false,
    language: store.ICDLang,
  };
  const myCallbacks = {
    selectedEntityFunction: (selectedEntity: any) => {
      handleOk(selectedEntity);
      ECT.Handler.clear(field);
      visible = false;
    },
  };

  const onCancel = () => {
    ECT.Handler.clear(field);
    visible = false;
    // store.enableForm();
  };

  ECT.Handler.configure(mySettings, myCallbacks);
  ECT.Handler.bind(field);
  return (
    <div>
      <Input
        type="text"
        className="ctw-input"
        autoComplete="off"
        data-ctw-ino={field}
      />
      <div className="ctw-window" data-ctw-ino={field}></div>
    </div>
  );
};
