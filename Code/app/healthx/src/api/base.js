const baseURL = 'http://192.168.43.142:8000/api/v1'

const patientsURL =  `${baseURL}/patients/`

const patientRecordsURL = (patientId) => `${baseURL}/records/filter/?patient=${patientId}`

export { baseURL, patientsURL, patientRecordsURL}
