import React from "react";
import {
	Button,
	Card,
	Checkbox,
	DatePicker,
	Typography,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Select,
	Tooltip,
	Modal,
	Alert,
} from "antd";
import moment from "moment";
import { observer } from "mobx-react";
import { useStore } from "../Context";

const { Title } = Typography;

const styles: { [name: string]: React.CSSProperties } = {
	tableCell: {
		// display: "flex",
		// alignItems: "center",
		height: "100%",
		padding: "8px",
	},
	answerLine: {
		borderBottom: "1px solid",
		height: "100%",
		flex: 1,
		marginBottom: "8px",
		paddingBottom: "4px",
		display: "flex",
		alignItems: "flex-end",
		fontWeight: 600,
	},
	tableAnswer: {
		width: "65%",
		fontSize: "20px",
		fontWeight: 700,
		color: "#3b3b3b",
		padding: "8px",
	},
};

const useTranslation = () => {
	const store = useStore();
	const lang = store.activeLanguage;

	return (key: string) => lang?.lang[key] ?? key;
};

const PrintableFormData = observer((props: any) => {
	console.log("props", props);
	const form = props.form;
	const date = form.getFieldValue("eventDate");
	const eventDate = !!date ? moment(date).format("DD-MMM-YYYY") : "";
	const store = useStore();
	const facility = store.currentOrganisation;
	const tr = useTranslation();

	const name = props.formVals["ZYKmQ9GPOaF"];
	const nin = props.formVals["MOstDqSY0gO"];
	const sex = props.formVals["e96GB4CXyd3"];
	const district = props.formVals["t5nTEmlScSt"];
	const subcounty = props.formVals["u44XP9fZweA"];
	const village = props.formVals["dsiwvNQLe5n"];
	const dod = props.formVals["i8rrl8YWxLF"];
	const dateOfDeath = !!dod ? moment(dod).format("DD-MMM-YYYY") : "";

	const parish = "";

	const certified = props.certified;
	const causeOfDeath = props.formVals["QTKk2Xt8KDu"];

	const getDEValue = (dataElementId) => {
		const value = props.formVals[dataElementId];
		if (!value) return "";
		if (typeof value === "string") return value;
		if (value instanceof moment) return moment(value).format("DD-MMM-YYYY");
		return value.toString();
	};

	return (
		<>
			<table className="my-2 w-full print-table">
				<tbody>
					{store.printColumns.map((dataElement) => (
						<tr key={dataElement.id}>
							<td style={styles.tableCell}>{dataElement.name}</td>
							<td style={styles.tableAnswer}>
								{getDEValue(dataElement.id)}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						marginTop: "30px",
						height: "50px",
						width: "50%",
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<b style={{ marginBottom: "10px" }}>{ tr('Reported on') }:</b>
					<div style={{ ...styles.answerLine, marginLeft: "8px" }}>
						{eventDate}
					</div>
				</div>
				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<div
						style={{
							marginTop: "40px",
							width: "40%",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div style={styles.answerLine}></div>
						<b>{ tr('Notifier Of Births and Deaths') }</b>
						<div
							style={{ ...styles.answerLine, marginTop: "50px" }}
						>
							{facility}
						</div>
						<b>{ tr('Registration Area') }</b>
					</div>
				</div>
			</div>
		</>
	);
});

const CardTitle = observer((props: any) => {
	const tr = useTranslation();
	return (
		<>
			<Title className="text-center" level={2}>
				{ tr('DEATH NOTIFICATION RECORD') }
			</Title>
			<p style={{ fontStyle: "italic", textAlign: "center" }}>
				{ tr('Registration of Persons Act 2015') }
			</p>
		</>
	);
});

export const FormPrint = React.forwardRef<any, any>((props, ref) => {
	return (
		<Card ref={ref} title={<CardTitle />}>
			<PrintableFormData {...props} />
		</Card>
	);
});
