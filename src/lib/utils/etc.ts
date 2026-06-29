export default {
	sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	},

	deepclone<T>(data: T) {
		return JSON.parse(JSON.stringify(data))
	}
}
