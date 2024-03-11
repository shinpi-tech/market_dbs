import axios from "axios";

const points = async (region) => {
	const hasRegion = regionId(region)

	if (!hasRegion) return null

	const today = new Date();
	const minDays = Number(hasRegion.minDeliveryDays) + 1
	const maxDays = Number(hasRegion.maxDeliveryDays) + 1

	const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + minDays)
	const toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + maxDays)

	const dates = {
		fromDate: fromDate.toLocaleDateString("ru-RU").toString().replace(/\./g, "-"),
		toDate: toDate.toLocaleDateString("ru-RU").toString().replace(/\./g, "-"),
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

export default points