import React, { SFC, useState, useEffect } from "react";
import { Input } from "antd";
import { observer } from "mobx-react";
import searchArray from "./searchArray";
import { useStore } from "../../Context";

import { CloseSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import {store} from "../../Store";

// const getUrls =

export const validSearchTypes = {
  region: "region",
  district: "district",
  subCounty: "subCounty",
  facility: "facility",
  level6: "level6",
};

interface SearchType {
  disabled?: boolean;
  searchType: string;
  dictatedContent?: string;
  parentName?: string;
  parentParentName?: string;
  setDictatedContent?: any;
  setParent?: any;
  receiveOutput?: any;
}
let anyArrayType: any[] = [];
export const DistrictSearchPopup: SFC<SearchType> = observer(
  ({
    disabled = false,
    searchType,
    dictatedContent,
    parentName,
    parentParentName,
    setDictatedContent,
    setParent = () => {},
    receiveOutput = () => {},
  }) => {
    //       // Searches (District and sub county)
    const store = useStore();
    const [contentString, setContentString] = useState("");
    const [searchString, setSearchString] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(setTimeout(() => {}, 0));
    const [disableSearch, setDisableSearch] = useState(false);
    const [limitedArray, setLimitedArray] = useState(anyArrayType);

    const [showResultOverride, setShowResultOverride] = useState(true);
    const [subCountySearchTimeout, setSubCountySearchTimeout] = useState(
      setTimeout(() => {}, 0)
    );

    const [searchResults, setSearchResults] = useState(anyArrayType);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allRegions, setAllRegions] = useState(anyArrayType);
    const [allDistricts, setAllDistricts] = useState(anyArrayType);
    const [allSubCounties, setAllSubCounties] = useState(anyArrayType);
    const [allFacilities, setAllFacilities] = useState(anyArrayType);

    const searchEntity = (text: string) => {
      // const find
      const itemToSearch =
        searchType === validSearchTypes.facility
          ? allFacilities
          : searchType === validSearchTypes.region
          ? allRegions
          : searchType === validSearchTypes.district && parentName
          ? allRegions.find((reg) => reg.displayName === parentName).children
          : searchType === validSearchTypes.subCounty && parentName
          ? allDistricts.find((reg) => reg.displayName === parentName).children
          : [];

      // let itemToSearch = limitedArray?.length
      //   ? limitedArray
      //   : searchType === validSearchTypes.subCounty
      //   ? allSubCounties
      //   : searchType === validSearchTypes.district
      //   ? allDistricts
      //   : allRegions;

      let potentialResults = searchArray(
        text,
        itemToSearch,
        ["displayName"],
        "id"
      );
      if (!showResultOverride) {
        setShowResultOverride(true);
      }
      if (Array.isArray(potentialResults)) {
        setSearchResults(potentialResults);
        setLoading(false);
      }
      //  If its a district, set the limited array
    };

    useEffect(() => {
      if (searchString?.length >= 1 && !disableSearch) {
        setDropdownVisible(true);
        setLoading(true);
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        setSearchTimeout(
          setTimeout(() => {
            searchEntity(searchString);
          }, 600)
        );
      }
      if (!searchString?.length || searchString?.length < 1) {
        // setLimitedArrayParent("");
        setLimitedArray([]);
      }
    }, [searchString]);

    useEffect(() => {
      if (dictatedContent?.length) {
        if (searchString === dictatedContent) return;
        setDisableSearch(true);
        setSearchString(dictatedContent);
        // Save the output
        receiveOutput(dictatedContent);
      }
    }, [dictatedContent]);

    const captureItem = (item: any) => {
      setDisableSearch(true);
      setDropdownVisible(false);
      if (typeof item?.displayName === "string") {
        setSearchString(item.displayName);
        // Save the output
        receiveOutput(item.displayName);
      }

      // If this is a sub County that has been chosen, set the district
      if (searchType === validSearchTypes.subCounty) {
        if (setDictatedContent) {
          let district = item.parent?.displayName;
          setDictatedContent(district);
        }
      }

      // If it's a district that has been chosen, set the subcounties under it such that they are the only results that can be returned
      if (searchType === validSearchTypes.district) {
        setLimitedArray(item.children);

        if (setParent) {
          setParent(item.displayName);
        }
      }
    };

    // useEffect(() => {
    //   if (limitedArray.length && searchString) {
    //     setSearchString("");
    //     // Save the output
    //     receiveOutput("");
    //     if (!showResultOverride) {
    //       setShowResultOverride(true);
    //     }
    //   }
    // }, [limitedArray]);

    const styles = {
      searchContainer: {
        position: "relative" as "relative",
      },
      results: {
        position: "absolute" as "absolute",
        maxHeight: "300px",
        zIndex: 1000,
        backgroundColor: "#fff",
        overflowY: "scroll" as "scroll",
        right: "0px",
        left: "0px",
        boxShadow: "5px 5px 3px rgba(0, 0, 0, 0.1)",
      },
      singleResult: {
        borderBottom: "0.5px solid gray",
        marginBottom: "0.5rem",
        padding: "0.5rem",
        cursor: "pointer" as "pointer",
      },
      iconStyle: {
        fontSize: "18px",
        cursor: "pointer" as "pointer",
        color: "#dc3545",
      },
      topIconContainer: {
        display: "flex" as "flex",
        justifyContent: "flex-end",
        background: "white",
        padding: "0.3rem",
      },
      loader: {
        fontSize: "22px",
        color: "#007bff",
      },
      loaderContainer: {
        display: "flex" as "flex",
        justifyContent: "center",
        marginBottom: "0.6rem",
      },
      topDistrict: {
        position: "sticky" as "sticky",
        top: "0px",
        left: "0px",
        right: "0px",
        fontSize: "0.8em",
        color: "#007bff",
        fontWeight: "bold" as "bold",
        marginBottom: "0.5rem",
        cursor: "pointer",
        background: "white",
        padding: "0.3rem",
      },
    };

    useEffect(() => {
      setTimeout(() => {
        setDisableSearch(false);
      }, 500);
    }, [disableSearch]);

    const resetSubCountySearch = () => {
      const newArr =
        searchType === validSearchTypes.facility
          ? allFacilities
          : searchType === validSearchTypes.region
          ? allRegions
          : searchType === validSearchTypes.district && parentName
          ? allRegions.find((reg) => reg.displayName === parentName).children
          : searchType === validSearchTypes.subCounty && parentName
          ? allDistricts.find((reg) => reg.displayName === parentName).children
          : [];

      setShowResultOverride(false);
      setSearchResults(newArr);
    };

    const getData = async () => {
      if (searchType === validSearchTypes.facility) {
        const facilities = await store.getFacilities();
        const actualFacilities = facilities.organisationUnits;
        console.log("Actual facilities are", actualFacilities);
        setAllFacilities(actualFacilities);

        return;
      }

      await store.getRegions()
      const allRegionsReceived = store.regions;
      console.log(allRegionsReceived)
      const actualRegions = allRegionsReceived.organisationUnits;
      let districtsArr = new Array();
      let subCountiesArr = new Array();

      // Populate Districts
      actualRegions.forEach((it: any) => {
        if (
          typeof it === "object" &&
          it.children &&
          typeof it.children === "object"
        ) {
          districtsArr = [...it.children, ...districtsArr];
        }
      });

      // Populate subCounties
      districtsArr.forEach((it: any) => {
        if (
          typeof it === "object" &&
          it.children &&
          typeof it.children === "object"
        ) {
          subCountiesArr = [...it.children, ...subCountiesArr];
        }
      });

      setAllRegions(actualRegions);
      setAllDistricts(districtsArr);
      setAllSubCounties(subCountiesArr);
      // [allDistricts, setAllDistricts] = useState(anyArrayType);
      // const [allSubCounties, setAllSubCounties]
    };

    useEffect(() => {
      getData();
    }, []);

    useEffect(() => {
      console.log("Parent name for ", searchType, " changed");
    }, [parentName]);
    return (
      <React.Fragment>
        <Input
          size="large"
          disabled={disabled || false}
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
          placeholder={
            searchType === validSearchTypes.subCounty
              ? store?.activeLanguage?.lang?.["Search for a Sub County..."]
              : searchType === validSearchTypes.district
              ? store?.activeLanguage?.lang?.["Search for a District..."]
              : searchType === validSearchTypes.region
              ? store?.activeLanguage?.lang?.["Search for a Region..."]
              : store?.activeLanguage?.lang?.["Search for a Health Facility..."]
          }
        />

        {dropdownVisible ? (
          <div style={styles.searchContainer}>
            <div style={styles.results}>
              <div style={styles.topIconContainer}>
                <CloseSquareOutlined
                  style={styles.iconStyle}
                  onClick={() => {
                    setDropdownVisible(false);
                    setSearchResults([]);
                  }}
                />
              </div>

              {!loading ? (
                <React.Fragment>
                  {showResultOverride ? (
                    <div
                      style={styles.topDistrict}
                      onClick={resetSubCountySearch}
                    >
                      {store?.activeLanguage?.lang?.["Show all"]}{" "}
                      {searchType === validSearchTypes.subCounty
                        ? store?.activeLanguage?.lang?.["subcounties"] + " "
                        : searchType === validSearchTypes.district
                        ? store?.activeLanguage?.lang?.["districts"] + " "
                        : searchType === validSearchTypes.facility
                        ? store?.activeLanguage?.lang?.["health facilities"] +
                          " "
                        : store?.activeLanguage?.lang?.["regions"] + " "}
                      {store?.activeLanguage?.lang?.["in"]}{" "}
                      {parentName || store?.activeLanguage?.lang?.["Uganda"]}
                    </div>
                  ) : (
                    ""
                  )}

                  {searchResults?.length
                    ? searchResults.map((item) => (
                        <div
                          key={Math.random()}
                          style={styles.singleResult}
                          onClick={() => {
                            captureItem(item);
                          }}
                        >
                          {item.displayName}
                        </div>
                      ))
                    : ""}
                </React.Fragment>
              ) : (
                <div style={styles.loaderContainer}>
                  <LoadingOutlined spin style={styles.loader} />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
);

export default DistrictSearchPopup;
