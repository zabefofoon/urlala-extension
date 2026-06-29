import type { Link } from '~/models/Item'

export type CollectPayload = Pick<Link, 'id' | 'label' | 'url' | 'thumbnail'>
export type CollectType = 'view' | 'like' | 'save' | 'comment'
export type PopularBucketType = 'day' | 'week' | 'month'
