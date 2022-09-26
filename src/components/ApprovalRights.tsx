import React, { SFC, useState, useEffect } from "react";
import { Input, Button, Form } from "antd";
import { observer } from "mobx-react";
import { useStore } from "../Context";

// Languages
import englishString from "./../assets/english.json";
import frenchString from "./../assets/french.json";

import { CheckCircleTwoTone } from "@ant-design/icons";

const allLanguages = [
	{
		langName: "English",
		lang: englishString,
	},
	{
		langName: "French",
		lang: frenchString,
	},
];

interface SearchType {
  style?: any;
  updateApprovalStatus?: any;
  statusReceived?: any;
}
let anyArrayType: any[] = [];
export const DistrictSearchPopup: SFC<SearchType> = observer(
  ({ style, updateApprovalStatus, statusReceived }) => {
    const store = useStore();
    const [userIsAuthorized, setUserIsAuthorized] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState(
      store.activeLanguage ?? allLanguages[0]
    );
    const [approved, setApproved] = useState(false);
    const [approvalText, setApprovalText] = useState("Not Approved");
    const [inputKey, setinputKey] = useState(Math.random());
    const [userName, setUserName] = useState("");

    const toggleApproved = () => {
      const newApproved = !approved;
      const text = newApproved ? `Approved by ${userName}` : "Not Approved";

      console.log("Text is ", text);
      setApprovalText(text);
      setApproved(newApproved);
      if (updateApprovalStatus) {
        updateApprovalStatus(text);
      }
    };

    useEffect(() => {
      setinputKey(Math.random());
    }, [approvalText]);

    useEffect(() => {
      if (statusReceived) {
        console.log("Status received is ", statusReceived);
        const booleanApproved =
          statusReceived && !statusReceived.includes("Not");
        console.log("Has the form been approved?", booleanApproved);
        setApproved(booleanApproved);

        if (booleanApproved) {
          // setApproved(true);
          setApprovalText(statusReceived);
          store.disableForm();
        }
      }
    }, [statusReceived]);

    const checkApproval = async () => {
      const userIsApproved = await store.isUserApproved();
      // console.log("The user can approve? ", userIsApproved);
      if (userIsApproved?.canApprove) {
        setUserIsAuthorized(userIsApproved?.canApprove);
        setUserName(userIsApproved?.userName);
        return;
      }
      setUserIsAuthorized(userIsApproved?.canApprove);
      setUserName(userIsApproved?.userName);
    };

    useEffect(() => {
      checkApproval();
    }, []);

    useEffect(() => {
      setActiveLanguage(store.activeLanguage);
    }, [store.activeLanguage]);

    return userIsAuthorized ? (
      <div>
        <Button
          size="large"
          htmlType="button"
          onClick={toggleApproved}
          disabled={approved}
          style={
            approved
              ? {
                  color: "#28a745",
                  border: "1px solid #28a745",
                }
              : {
                  color: "#6c757d",
                }
          }
        >
          {!approved ? activeLanguage.lang?.["Approve ?"] : approvalText}
          {approved && <CheckCircleTwoTone twoToneColor={"#28a745"} />}
        </Button>
      </div>
    ) : null;
  }
);

export default DistrictSearchPopup;
