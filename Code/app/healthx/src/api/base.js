const baseURL = 'http://192.168.43.142:8000/api/v1'

const patientsURL =  `${baseURL}/patients/`

const recordsEndpoint = `${baseURL}/records/`

const patientRecordsURL = (patientId) => recordsEndpoint + `filter/?patient=${patientId}`

export { baseURL, patientsURL, recordsEndpoint, patientRecordsURL}
