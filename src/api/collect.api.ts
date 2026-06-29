import { URLALA_BASE_URL } from '@/const'
import { CollectPayload, CollectType } from '@/models/Collect'

export const collectApi = {
	save(item: CollectPayload, type: CollectType = 'view') {
		if (!item.url.startsWith('http')) return

		const body = JSON.stringify({ url: item.url, type })

		fetch(`${URLALA_BASE_URL}/api/collect`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body,
			keepalive: true
		}).catch((error) => {
			console.error(error)
			// Collection is best-effort and should not block navigation.
		})
	}
}
