import { observer } from "mobx-react"
import React, { useState } from "react";
import * as ECT from '@whoicd/icd11ect';
import { Input } from 'antd';

import '@whoicd/icd11ect/style.css';
import '../App.css';

const mySettings = {
  apiServerUrl: "https://nisprod.dev.plydot.com"
};

export const ICDField = observer(({ field }) => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(true);
  const [real, setReal] = useState('')

  const myCallbacks = {
    selectedEntityFunction: (selectedEntity: any) => {
      setReal(selectedEntity.code + " - " + selectedEntity.bestMatchText);
      ECT.Handler.clear(field);
      setVisible(false);
      setValue('');
    }
  };

  ECT.Handler.configure(mySettings, myCallbacks);
  return (
    <div>
      {visible ? <Input size="large" className="ctw-input" data-ctw-ino={field} value={value} onChange={(e: any) => {
        setValue(e.target.value)
      }} /> : <Input size="large" value={real} onClick={() => setVisible(true)} />}
      <div className="ctw-window p-0 m-0 w-full" data-ctw-ino={field}></div>
    </div>
  )
})