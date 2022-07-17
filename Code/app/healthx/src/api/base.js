/**
 * This file contains constants such as URLs
 * which will be used from various parts of the code
 */

const baseURL = 'http://192.168.43.142:8000/api/v1'

const patientsURL = `${baseURL}/patients/`

const recordsURL = `${baseURL}/records/`

const patientlatestRecordsURL = (patientId) => recordsURL + `latest/?patient_id=${patientId}`

const patientRecordsURL = (patientId) => recordsURL + `filter/?patient=${patientId}`


export { baseURL, patientsURL, recordsURL, patientRecordsURL, patientlatestRecordsURL }
