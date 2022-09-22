import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import { Table, Card, Drawer, List, Checkbox, Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import Highcharts, { Options } from "highcharts";
import { DatePicker, Input, Menu, Dropdown, Button, Form, Popover } from "antd";
import {
  AudioOutlined,
  DownOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { GenderFilter, MortalityFilter } from "../filters";

import englishString from "./../assets/english.json";
import frenchString from "./../assets/french.json";

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

require("highcharts/modules/exporting")(Highcharts);

// const extraHeaders =
//   process.env.NODE_ENV === "development"
//     ? { Authorization: `${process.env.REACT_APP_DHIS2_AUTHORIZATION}` }
//     : {};

// console.log(extraHeaders)

Highcharts.AST.allowedTags.push("svg");
Highcharts.AST.allowedAttributes.push("viewBox");

const { Search } = Input;

const FilterMenu = observer(({ field }) => {
  const store = useStore();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(store.filters[field]?.value ?? "");

  const onFinish = () => {
    store.filters[field].value = value;
    store.queryEvents();
    setVisible(false);
  };

  const onChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  return (
    <Popover
      placement="bottom"
      visible={visible}
      onVisibleChange={setVisible}
      content={
        <div style={{ padding: "8px 12px" }}>
          <div style={{ margin: "8px 0px" }}>
            <Input
              placeholder="Contains text"
              onChange={onChange}
              value={value}
            />
          </div>

          <Button type="primary" htmlType="button" onClick={onFinish}>
            Update
          </Button>
        </div>
      }
      trigger="click"
    >
      <Button>
        {store.filters[field]?.title}{" "}
        {!!store.filters[field]?.value && `: ${store.filters[field]?.value}`}{" "}
        <DownOutlined />
      </Button>
    </Popover>
  );
});

const arrowDown =
  '<svg class="ptarrow" fill="green" viewBox="0 0 1024 1024"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"/>';
const arrowUp =
  '<svg class="ptarrow" fill="red" viewBox="0 0 256 256"><path d="M215.39111,163.06152A8.00015,8.00015,0,0,1,208,168H48a7.99981,7.99981,0,0,1-5.65674-13.65674l80-80a8,8,0,0,1,11.31348,0l80,80A7.99982,7.99982,0,0,1,215.39111,163.06152Z"/></svg>';
const dash =
  '<svg class="ptarrow" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 8a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1z" fill="#2f7ed8"/></svg>';

export const EventList = observer(() => {
  const store = useStore();
  const [visible, setVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [chartTitle, setChartTitle] = useState("Top 20 causes of death");
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [visibleStates, setVisibleStates] = useState({});
  const dropdowns = useRef([]);
  const [downloadData, setDownloadData] = useState([]);
  const [downloadng, setDownloadng] = useState(false);
  const [currChartType, setCurrChartType] = useState("column");
  const currDiseases = useRef([]);
  const csvBtn = useRef(null);
  // const myPicker = useRef<HTMLInputElement|null>(null);

  const [activeLanguage, setActiveLanguage] = useState(
    store.activeLanguage || allLanguages[0]
  );

  useEffect(() => {
    setActiveLanguage(store?.activeLanguage || allLanguages[0]);
  }, [store?.activeLanguage]);

  let chart: any = useRef(null);
  const colOptions: any = {
    chart: {
      type: "column",
    },
    title: {
      text: chartTitle,
    },
    xAxis: [
      {
        categories: [],
        crosshair: true,
      } as any,
    ],
    yAxis: {
      min: 0,
      title: {
        text: "Death count",
      },
    },
    series: [{ name: "Deaths" } as any],
    tooltip: {
      useHTML: true,
      pointFormatter: function () {
        let point: any = this;
        let arrow = "";

        const disease = currDiseases.current[point.x];

        arrow =
          disease.count > disease.prev
            ? arrowUp
            : disease.count == disease.prev
            ? dash
            : arrowDown;

        return `<div class="ptlabel">${point.series?.name}: <b>${point.y}</b>${arrow}</div>`;
      },
    },
    credits: {
      enabled: false,
    },
  };

  let pieOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    } as any,
    title: {
      text: chartTitle,
    },
    tooltip: {
      useHTML: true,
      pointFormatter: function () {
        let point: any = this;
        let arrow = "";

        const disease = currDiseases.current[point.x];
        arrow =
          disease.count > disease.prev
            ? arrowUp
            : disease.count == disease.prev
            ? dash
            : arrowDown;
        return `<div class="ptlabel">${point.series.name}: <b>${parseFloat(
          point.percentage
        ).toFixed(1)}%</b>${arrow}</div>`;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function () {
            const pointd: any = this;
            const point = pointd.point;

            let arrow = "";

            const disease = currDiseases.current[point.x];
            if (!!disease)
              arrow =
                disease.count > disease.prev
                  ? arrowUp
                  : disease.count == disease.prev
                  ? dash
                  : arrowDown;

            return `<div class="ptlabel"><b>${point.name}</b>: ${parseFloat(
              point.percentage
            ).toFixed(1)}:% ${arrow}</div>`;
          },
        },
      },
    },
    series: [
      {
        name: "Deaths",
        colorByPoint: true,
        data: [{}],
      } as any,
    ],
    credits: {
      enabled: false,
    },
  };

  const changeChartType = (chartType: string) => {
    let opts = null;
    setCurrChartType(chartType);
    if (chartType == "pie") {
      opts = pieOptions;
      if (!!currDiseases.current)
        opts.series[0].data = currDiseases.current.map((d: any) => {
          return {
            name: d.name,
            y: d.count,
          };
        });
    } else if (chartType == "column") {
      opts = colOptions ?? {};
      if (!!currDiseases.current && opts !== undefined) {
        opts.xAxis[0].categories = currDiseases.current?.map(
          (d: any) => d?.name
        );
        opts.series[0].data = currDiseases.current?.map((d: any) => {
          return {
            y: d.count,
            color:
              d.count > d.prev
                ? "red"
                : d.count == d.prev
                ? "#2f7ed8"
                : "green",
          };
        });
      }
    }

    if (!!chart.current && !!opts) {
      chart.current.destroy();
      chart.current = Highcharts.chart("topdiseases", opts);
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const [causeOfDeath, setCauseOfDeath] = React.useState<string>(undefined);
  const [mortalityFilter, setMortalityFilter] =
    React.useState<string>(undefined);
  const [genderFilter, setGenderFilter] = React.useState<string>(undefined);

  const groupDiseaseToOrgUnits = (diseases, prevDiseases = null) => {
    let diseaseOrgs = {};
    let prevDisOrgs = {};

    Object.values(diseases).forEach((d: any) => {
      if (!!prevDiseases) {
        let prevD = prevDiseases[d.name];
        if (!!prevD) {
          prevD.affected.forEach((event) => {
            if (!prevDisOrgs[event.org.id]) {
              prevDisOrgs[event.org.id] = {
                name: event.org.name,
                count: 0,
              };
            }
            prevDisOrgs[event.org.id].count += 1;
          });
        }
      }
      d.affected.forEach((event) => {
        if (!event.org.id) return;
        if (!diseaseOrgs[event.org.id])
          diseaseOrgs[event.org.id] = {
            name: event.org.name,
            count: 0,
            prev: !!prevDiseases
              ? prevDisOrgs[event.org.id]?.count
              : store.prevDiseaseOrgUnits[event.org?.id]?.[d.id],
          };
        diseaseOrgs[event.org.id].count += 1;
      });
    });
    return Object.values(diseaseOrgs)
      ?.sort((a: any, b: any) => a.count - b.count)
      ?.slice(-20);
  };

  const groupDiseaseToFilters = (diseases, prevDiseases = null) => {
    let diseaseOrgs = {};
    let prevDisOrgs = {};

    Object.values(diseases).forEach((d: any) => {
      if (!!prevDiseases) {
        let prevD = prevDiseases[d.name];
        if (!!prevD) {
          prevD.affected.forEach((event) => {
            if (!prevDisOrgs[event.org.id]) {
              prevDisOrgs[event.org.id] = {
                name: event.org.name,
                count: 0,
              };
            }
            prevDisOrgs[event.org.id].count += 1;
          });
        }
      }

      d.affected.forEach((event) => {
        if (!event.org.id) return;
        if (!diseaseOrgs[event.org.id])
          diseaseOrgs[event.org.id] = {
            name: event.org.name,
            count: 0,
            prev: !!prevDiseases
              ? prevDisOrgs[event.org.id]?.count
              : store.prevDiseaseOrgUnits[event.org?.id]?.[d.id],
          };
        diseaseOrgs[event.org.id].count += 1;
      });

    });
    return Object.values(diseaseOrgs)
      ?.sort((a: any, b: any) => a.count - b.count)
      ?.slice(-20);
  };

  const calculatePrevDiseaseCounts = (diseases, prevDiseases) => {
    return [...diseases].map((d) => {
      let prevD = prevDiseases[d.name];
      return { ...d, prev: prevD?.affected?.length ?? 0 };
    });
  };

  const filterTheDiseases = () => {
    let totalMortalityFilteredDeathCount: number = 0;
    let totalGenderFilteredDeathCount: number = 0;

    let sortedDiseases = [];

    let diseases = new MortalityFilter().apply(
      { ...JSON.parse(JSON.stringify(store.allDiseases)) },
      mortalityFilter
    );
    let prevDiseases = new MortalityFilter().apply(
      { ...JSON.parse(JSON.stringify(store.prevDiseases)) },
      mortalityFilter
    );

    Object.keys(diseases).forEach((k) => {
      totalMortalityFilteredDeathCount += diseases[k].count;
    });

    diseases = new GenderFilter().apply({ ...diseases }, genderFilter);
    prevDiseases = new GenderFilter().apply({ ...prevDiseases }, genderFilter);

    console.log("diseases after gender filer", diseases);

    if (
      !store.currentOrganisation &&
      !!store.selectedOrgUnit 
    ) {
      if (!!causeOfDeath)
        sortedDiseases = groupDiseaseToOrgUnits(diseases, prevDiseases);
      else 
        sortedDiseases = groupDiseaseToFilters(diseases, prevDiseases);
    } else {
      sortedDiseases = Object.values(diseases)
        ?.sort((a: any, b: any) => a.count - b.count)
        ?.slice(-20);
      console.log("sortedDiseases", sortedDiseases);
      sortedDiseases = calculatePrevDiseaseCounts(sortedDiseases, prevDiseases);
    }

    Object.keys(diseases).forEach((k) => {
      totalGenderFilteredDeathCount += diseases[k].count;
    });

    sortedDiseases = sortedDiseases.filter((d) => d.count > 0);

    return {
      totalGenderFilteredDeathCount,
      totalMortalityFilteredDeathCount,
      sortedDiseases,
    };
  };

  useEffect(() => {
    if (chart.current == null) return;

    if (store.loadingTopDiseases) chart.current.showLoading("Loading data ...");
    else {
      if (!!store.topDiseases) {
        let sortedDiseases = store.topDiseases;
        let prevDiseases = store.prevDiseases;
        let totalMortalityFilteredDeathCount = 0;
        let totalGenderFilteredDeathCount = 0;
        let allDiseases = store.allDiseases;

        if (
          (!store.currentOrganisation &&
            !!causeOfDeath &&
            !!store.selectedOrgUnit) ||
          !!store.selectedLevel
        ) {
          sortedDiseases = groupDiseaseToOrgUnits(allDiseases);
        } else if (!store.currentOrganisation &&
            !!store.selectedOrgUnit &&
            !causeOfDeath 
            ) {
          sortedDiseases = groupDiseaseToFilters(allDiseases);
        }

        console.log("causeOfDeath", causeOfDeath);
        console.log("causeOfDeath", store.totalCauseDeathCount);

        console.log("mortalityFilter", mortalityFilter);
        console.log("genderFilter", genderFilter);

        if (mortalityFilter || genderFilter) {
          const filtered = filterTheDiseases();
          console.log("filtered 1", filtered);
          console.log("total", store.totalDeathCount);

          sortedDiseases = filtered.sortedDiseases;
          totalGenderFilteredDeathCount =
            filtered.totalGenderFilteredDeathCount;
          totalMortalityFilteredDeathCount =
            filtered.totalMortalityFilteredDeathCount;
        }
        // console.log(
        //   store.totalDeathCount,
        //   totalFilteredDeathCount,
        //   ((store.totalDeathCount - totalFilteredDeathCount) /
        //     store.totalDeathCount) *
        //     100
        // );
        currDiseases.current = sortedDiseases;
        let title = causeOfDeath
          ? `${causeOfDeath} contributed ${(
              (store.totalCauseDeathCount / store.totalDeathCount) *
              100
            ).toFixed(2)}%  of total reported deaths`
          : "Top 20 causes of death";
        if (mortalityFilter) {
          title = `${title} [${mortalityFilter} ${(
            (totalMortalityFilteredDeathCount / store.totalDeathCount) *
            100
          ).toFixed(2)}% of total]`;
        }
        if (genderFilter) {
          let mortalityStr = "";
          if (mortalityFilter) {
            mortalityStr = `that are ${mortalityFilter}`;
          }
          title = `${title} [${genderFilter} ${(
            (totalGenderFilteredDeathCount / store.totalDeathCount) *
            100
          ).toFixed(2)}% ${mortalityStr}]`;
        }
        if (!!store.selectedOrgUnitName)
          title = `${title} in ${store.selectedOrgUnitName}`;

        setChartTitle(title);
        chart.current.setTitle({ text: title });

        if (currChartType == "column") {
          chart.current.xAxis[0].setCategories(
            sortedDiseases.map((d: any) => d.name)
          ); //setting category
        }

        chart.current.series[0].setData(
          sortedDiseases.map((d: any) => {
            if (currChartType == "column")
              return {
                y: d.count,
                color:
                  d.count > d.prev
                    ? "red"
                    : d.count == d.prev
                    ? "#2f7ed8"
                    : "green",
              };
            else
              return {
                name: d.name,
                y: d.count,
              };
          }),
          true
        ); //setting data
      }
      chart.current.hideLoading();
    }
  }, [
    store.loadingTopDiseases,
    causeOfDeath,
    mortalityFilter,
    genderFilter,
    store.totalDeathCount,
    store.totalCauseDeathCount,
    store.topDiseases,
    store.selectedOrgUnitName,
    store.allDiseases,
    currChartType,
  ]);

  useEffect(() => {
    console.log("EventList:hook nationalitySelect", store.nationalitySelect);

    const opts = currChartType == "column" ? colOptions : pieOptions;
    chart.current = Highcharts.chart("topdiseases", opts);

    store.queryTopEvents().then(() => {
      if (!!store.topDiseases) {
        let sortedDiseases = store.topDiseases;
        let totalMortalityFilteredDeathCount = 0;
        let totalGenderFilteredDeathCount = 0;

        if (
          (!store.currentOrganisation &&
            !!causeOfDeath &&
            !!store.selectedOrgUnit) ||
          !!store.selectedLevel
        ) {
          sortedDiseases = groupDiseaseToOrgUnits(store.allDiseases);
        } else if (!store.currentOrganisation &&
            !!store.selectedOrgUnit &&
            !causeOfDeath 
            ) {
          sortedDiseases = groupDiseaseToFilters(store.allDiseases);
        }

        if (mortalityFilter || genderFilter) {
          console.log("mortalityFilter", mortalityFilter);
          console.log("genderFilter", genderFilter);

          const filtered = filterTheDiseases();
          console.log("filtered 2", filtered);
          console.log("total", store.totalDeathCount);

          sortedDiseases = filtered.sortedDiseases;
          totalGenderFilteredDeathCount =
            filtered.totalGenderFilteredDeathCount;
          totalMortalityFilteredDeathCount =
            filtered.totalMortalityFilteredDeathCount;
        }

        let title = causeOfDeath
          ? `${causeOfDeath} contributed ${(
              (store.totalCauseDeathCount / store.totalDeathCount) *
              100
            ).toFixed(2)}%  of total reported deaths`
          : "Top 20 causes of death";
        if (mortalityFilter) {
          title = `${title} [${mortalityFilter} ${(
            (totalMortalityFilteredDeathCount / store.totalDeathCount) *
            100
          ).toFixed(2)}% of total]`;
        }
        if (genderFilter) {
          let mortalityStr = "";
          if (mortalityFilter) {
            mortalityStr = `that are ${mortalityFilter}`;
          }
          title = `${title} [${genderFilter} ${(
            (totalGenderFilteredDeathCount / store.totalDeathCount) *
            100
          ).toFixed(2)}% ${mortalityStr}]`;
        }
        if (!!store.selectedOrgUnitName)
          title = `${title} in ${store.selectedOrgUnitName}`;
        setChartTitle(title);
        chart.current.setTitle({ text: title });

        currDiseases.current = sortedDiseases;
        if (currChartType == "column") {
          chart.current.xAxis[0].setCategories(
            sortedDiseases.map((d: any) => d.name)
          ); //setting category
        }
        chart.current.series[0].setData(
          sortedDiseases.map((d: any) => {
            if (currChartType == "column")
              return {
                y: d.count,
                color:
                  d.count > d.prev
                    ? "red"
                    : d.count == d.prev
                    ? "#2f7ed8"
                    : "green",
              };
            else
              return {
                name: d.name,
                y: d.count,
              };
          }),
          true
        ); //setting data
      }
      chart.current.hideLoading();
    });

    store.queryEvents().then(() => {});
  }, [store?.nationalitySelect, causeOfDeath, store?.selectedLevel]);

  useEffect(() => {
    if (filtersInitialized || !store?.data?.headers) return;
    console.log("Setting inital filters");
    store.setInitialFilters();

    setFiltersInitialized(true);
  }, [store?.data?.headers]);

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
    />
  );

  const onSearch = (value) => {
    store.search = value;
    console.log(value);
    setSearching(true);
    store.queryEvents().then(() => {
      setSearching(false);
    });
  };

  const handleDownload = () => {
    setDownloadng(true);
    store
      .downloadData()
      .then((dd) => {
        setDownloadData(dd);
        let btn = csvBtn.current;
        if (!!btn) btn.link.click();
        setDownloadng(false);
      })
      .catch((e) => {
        setDownloadng(false);
      });
  };

  // console.log(store.data ? JSON.parse(JSON.stringify(store.data)) : "");

  return (
    <div>
      <div id="topdiseaseswrapper">
        <div
          id="topdiseases"
          style={{ width: "100%", height: "400px", marginBottom: "20px" }}
        ></div>

        <div
          className="chartOpts"
          style={{
            left: 0,
          }}
        >
          <div
            style={{
              marginRight: "auto",
              paddingLeft: "1rem",
            }}
          >
            <Select
              placeholder="Filter Deaths"
              onChange={(e) => {
                if (e) {
                  setCauseOfDeath(e);
                  store.setSelectedCOD(e);
                } else {
                  setCauseOfDeath(undefined);
                  store.setSelectedCOD(undefined);
                }
              }}
              size="middle"
              value={causeOfDeath}
              style={{
                minWidth: "160px",
              }}
            >
              <Select.Option value="">
                All Diseases
              </Select.Option>
              <Select.Option value="Malaria Deaths">
                Malaria Deaths
              </Select.Option>
              <Select.Option value="TB Deaths">
                TB Deaths
              </Select.Option>
              <Select.Option value="HIV Related Deaths">
                HIV Related Deaths
              </Select.Option>
              <Select.Option value="Deaths from cardiovascular diseases">
                Cardiovascular Disease
              </Select.Option>
              <Select.Option value="Cancer Deaths">
                Cancer
              </Select.Option>
              <Select.Option value="Obstructive Pulmonary Disease">
                Chronic Obstructive Pulmonary Disease
              </Select.Option>
              <Select.Option value="Diabetes Mellitus">
                Diabetes Mellitus
              </Select.Option>
              <Select.Option value="Premature noncommunicable disease (NCD)">
                Premature noncommunicable disease (NCD)
              </Select.Option>
              <Select.Option value="covid19">
                covid-19
              </Select.Option>
              <Select.Option value="pneumonia">
                pneumonia
              </Select.Option>
              <Select.Option value="Road traffic accidents">
                Road traffic accidents
              </Select.Option>
              <Select.Option value="Suicide">
                Suicide
              </Select.Option>
              <Select.Option value="Maternal deaths">
                Maternal deaths
              </Select.Option>
              <Select.Option value="injuries">
                Traffic Injuries
              </Select.Option>
              <Select.Option value="Total NCD Deaths">
                Total Deaths from NCDs
              </Select.Option>
              <Select.Option value="Total Communicable Deaths">
                Total Deaths from communicable Diseases
              </Select.Option>
              // 41 and 77
            </Select>
            <Select
              placeholder="Gender"
              onChange={(e) => {
                if (e) {
                  setGenderFilter(e);
                } else {
                  setGenderFilter(undefined);
                }
              }}
              size="middle"
              value={genderFilter}
              style={{
                minWidth: "100px",
              }}
            >
              <Select.Option value="">
                Gender
              </Select.Option>
              <Select.Option value="Female">
                Female
              </Select.Option>
              {causeOfDeath !== "Maternal deaths" && (
                <Select.Option value="Male">
                  Male
                </Select.Option>
              )}
            </Select>
            <Select
              placeholder={
                !causeOfDeath
                  ? "All Deaths Mortality Filter"
                  : `${causeOfDeath} Mortalility FIlter`
              }
              onChange={(e) => {
                if (e) {
                  setMortalityFilter(e);
                } else {
                  setMortalityFilter(undefined);
                }
              }}
              size="middle"
              style={{
                minWidth: "200px",
              }}
              value={mortalityFilter}
            >
              <Select.Option value="">
                All Deaths
              </Select.Option>
              <Select.Option value="Stillbirth">
                Stillbirth
              </Select.Option>
              <Select.Option value="Neonatal">
                Neonatal
              </Select.Option>
              <Select.Option value="Early Neonatal">
                Early Neonatal
              </Select.Option>
              {/* <Select.Option value="Perinatal">Perinatal</Select.Option> */}
              <Select.Option value="Infant">
                Infant
              </Select.Option>
              <Select.Option value="Under-five">
                Under-five
              </Select.Option>
              <Select.Option value="Adolescent">
                Adolescent
              </Select.Option>
              <Select.Option value="Adult">
                Adult
              </Select.Option>
              // 41 and 77
            </Select>
          </div>

          <div className="chartPicker">
            <button
              type="button"
              className="chart-pick-item"
              onClick={() => {
                changeChartType("column");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <g fill="none" fillRule="evenodd">
                  <polygon points="0 0 48 0 48 48 0 48"></polygon>
                  <polygon
                    fill="#147CD7"
                    points="12 12 18 12 18 36 12 36"
                  ></polygon>
                  <polygon
                    fill="#147CD7"
                    points="22 22 28 22 28 36 22 36"
                  ></polygon>
                  <polygon
                    fill="#147CD7"
                    points="32 7 38 7 38 36 32 36"
                  ></polygon>
                  <polygon fill="#4A5768" points="6 6 8 6 8 42 6 42"></polygon>
                  <polygon
                    fill="#4A5768"
                    points="6 40 42 40 42 42 6 42"
                  ></polygon>
                </g>
              </svg>
            </button>
            <button
              type="button"
              className="chart-pick-item"
              onClick={() => {
                changeChartType("pie");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,48,48">
                <g fill="none" fillRule="evenodd" transform="rotate(90 24 24)">
                  <polygon points="0 0 48 0 48 48 0 48"></polygon>
                  <circle
                    cx="24"
                    cy="24"
                    r="16"
                    stroke="#4A5768"
                    strokeWidth="2"
                  ></circle>
                  <path
                    fill="#FFC324"
                    d="M11,24 C11,31.1797017 16.8202983,37 24,37 C31.1797017,37 37,31.1797017 37,24 C37,16.8202983 31.1797017,11 24,11 L24,24 L11,24 Z"
                    transform="rotate(165 24 24)"
                  ></path>
                  <path
                    fill="#147CD7"
                    d="M11,24 C11,31.1797017 16.8202983,37 24,37 C31.1797017,37 37,31.1797017 37,24 C37,16.8202983 31.1797017,11 24,11 L24,24 L11,24 Z"
                    transform="rotate(-15 24 24)"
                  ></path>
                </g>
              </svg>
            </button>
          </div>

          {/*<div className="chart-date-range">
            
          </div>*/}
        </div>
      </div>
      {store.data ? (
        <Card
          title="Cases"
          bodyStyle={{ maxWidth: "100vw", padding: 0, margin: 0 }}
          extra={
            <div style={{ display: "flex", gap: "10px" }}>
              <SettingOutlined
                style={{ fontSize: "24px" }}
                onClick={showDrawer}
              />
              <CSVLink
                ref={csvBtn}
                data={downloadData}
                filename={"cod-cases.csv"}
                style={{ display: "none" }}
              />

              {!downloadng ? (
                <DownloadOutlined
                  style={{ fontSize: "24px" }}
                  onClick={handleDownload}
                />
              ) : (
                <LoadingOutlined style={{ fontSize: "24px" }} />
              )}
            </div>
          }
        >
          <div style={{ padding: "15px", display: "flex", gap: "10px" }}>
            {Object.keys(store.filters).map((field: any) => (
              <FilterMenu key={field} field={field} />
            ))}
          </div>

          <Table
            rowKey={(record: any) => record[0]}
            dataSource={store.data.rows}
            columns={store.columns}
            rowClassName={() => "l"}
            onRow={(record, rowIndex) => {
              // Fix for age that doesn't show if its zero
              // console.log("Record is ", record);
              if (record && record["34"] === "") {
                record["34"] = "0";
              }
              return {
                onClick: (event: any) => {
                  store.setCurrentEvent(record);
                  store.view();
                  store.showForm();
                },
              };
            }}
            pagination={{
              showSizeChanger: true,
              total: store.total,
              pageSize: store.pageSize,
              pageSizeOptions: ["5", "10", "15", "20", "25", "50", "100"],
            }}
            onChange={store.handleChange}
          />
        </Card>
      ) : null}

      <Drawer
        title="Columns"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={512}
      >
        <List
          itemLayout="horizontal"
          dataSource={store.availableDataElements}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Checkbox
                    checked={item.selected}
                    onChange={store.includeColumns(item.id)}
                  />
                }
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
});
