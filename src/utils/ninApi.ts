const baseURL = "https://hmis-dev.health.go.ug/db-api/api/v2";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoiJDJiJDEyJHhscm4zQ1NtWlNFV3RJMFJsbldpaU9BV2ZPMXJpYmtHMjdBZEhmUXByZnd5akxHL01kVS5LIiwidXNlciI6ImFkbWluIn0.x6E_jYOeAWTooXCd7ebRuC3NZtgpG99Ep9Tr6j9NisE";


export const getNINPerson = nin => {
	return fetch(`${baseURL}/getPerson`, {
		method: 'POST',
		body: JSON.stringify({
			"nationalId": nin,
			"token": token
		}),
	})
	.then(response => response.json())
}

export const getNINPlaceOfBirth = nin => {
	return fetch(`${baseURL}/getPlaceOfBirth`, {
		method: 'POST',
		body: JSON.stringify({
			"nationalId": nin,
			"token": token
		}),
	})
	.then(response => response.json())
}
