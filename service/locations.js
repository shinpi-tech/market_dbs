import fs from 'fs'

const locations = () => {
	const rows = fs.readFileSync('static/city.csv').toString().split('\n')
	const header = rows[0].split(';')
	rows.shift()

	const result = new Map()

	rows.forEach(el => {
		const row = el.split(';')
		const obj = {}
		for (let i = 0; i < row.length; i++) {
			obj[header[i]] = row[i]
		}

		result.set(Number(obj['code']), obj)
	})

	return result
}

export default locations