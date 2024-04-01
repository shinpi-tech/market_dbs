import axios from "axios";

const points = async (region) => {
	const hasRegion = regionId(region)

	if (!hasRegion) return null

	const today = new Date()
	const hours = today.getHours()
	const dayOfWeek = today.getDay()

	let sumNum = hours > 18 ? 2 : 1
	dayOfWeek === 6 ? sumNum = 2 : null
	dayOfWeek === 5 && hours > 18 ? sumNum = 3 : null

	const minDays = Number(hasRegion.minDeliveryDays) + sumNum
	const maxDays = Number(hasRegion.maxDeliveryDays) + sumNum

	const fromDatePre = new Date(today.getFullYear(), today.getMonth(), today.getDate() + minDays)
	const toDatePre = new Date(today.getFullYear(), today.getMonth(), today.getDate() + maxDays)

	const dates = {
		fromDate: fromDatePre.toLocaleDateString("ru-RU").toString().replace(/\./g, "-"),
		toDate: toDatePre.toLocaleDateString("ru-RU").toString().replace(/\./g, "-"),
	}

	const result = {
		price: 0,
		type: "PICKUP",
		serviceName: "yandex_delivery",
		dates: dates,
		outlets: [],
		paymentMethods: [
			"YANDEX",
			"APPLE_PAY",
			"GOOGLE_PAY",
			"TINKOFF_CREDIT",
			"TINKOFF_INSTALLMENTS",
			"SBP"
		]
	}

	const points = await getPoints(hasRegion.code)
	if (!points) return result

	for (const point of points) {
		result.outlets.push({ code: point.id })
	}

	const getDeliveryDay = await getDeliveryDays(result.outlets[0].code)
	if (!getDeliveryDay) return result

	const deliveryDay = new Date(getDeliveryDay.data.offers[0].from)

	let sumDays = hours > 18 ? 3 : 2
	dayOfWeek === 5 && hours > 18 ? sumDays = 4 : null
	dayOfWeek === 6 ? sumDays + 1 : null

	const fromDate = new Date(deliveryDay.getFullYear(), deliveryDay.getMonth(), deliveryDay.getDate() + sumDays)
	const toDate = new Date(deliveryDay.getFullYear(), deliveryDay.getMonth(), deliveryDay.getDate() + (sumDays + 2))

	result.dates = {
		fromDate: fromDate.toLocaleDateString("ru-RU").toString().replace(/\./g, "-"),
		toDate: toDate.toLocaleDateString("ru-RU").toString().replace(/\./g, "-"),
	}

	return result
}

const regionId = (region) => {
	if (globalThis.locations.has(region.id)) {
		return globalThis.locations.get(region.id)
	}

	for (const key in region) {
		if (region.hasOwnProperty(key) && typeof region[key] === "object") {
			regionId(region[key])
		} else {
			return false
		}
	}
}

const getPoints = async (regionCode) => {
	return await axios.post('https://b2b-authproxy.taxi.yandex.net/api/b2b/platform/pickup-points/list',
		{
			geo_id: Number(regionCode),
			payment_method: "already_paid",
			type: "pickup_point"
		},
		{ headers:
				{ 'Authorization': 'Bearer y0_AgAAAABxD-QaAAc6MQAAAAD7QrfLAABsQcSF_SFCnLwJBVv0u0IDKb__ww' }
		})
		.then(res => {
			if (res.data.points.length > 0) {
				return [...res.data.points]
			} else return null
		})
		.catch(() => {
			return null
		})
}

const getDeliveryDays = async (point_id) => {
	return await axios.get('https://b2b-authproxy.taxi.yandex.net/api/b2b/platform/offers/info', {
		headers: { 'Authorization': 'Bearer y0_AgAAAABxD-QaAAc6MQAAAAD7QrfLAABsQcSF_SFCnLwJBVv0u0IDKb__ww' },
		params: {
			station_id: "ed5f4f01-33db-41fb-b48e-6b24784dc63f",
			self_pickup_id: point_id,
			send_unix: false
		}
	})
}

export default points