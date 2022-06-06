const baseURL = 'http://192.168.43.231:8000/api/v1'

const patientsURL =  `${baseURL}/patients/`

const recordsURL = `${baseURL}/records/`

const patientlatestRecordsURL = (patientId) => recordsURL + `latest/?patient_id=${patientId}`

const patientRecordsURL = (patientId) => recordsURL + `filter/?patient=${patientId}`

export { baseURL, patientsURL, recordsURL, patientRecordsURL, patientlatestRecordsURL}
