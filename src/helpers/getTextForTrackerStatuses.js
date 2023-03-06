import { trackerStatuses } from '@/helpers/vars'

const getTextForTrackerStatuses = (status) => {
    const result = trackerStatuses.find(i => i.id === status)

    return result ? result.name : status
}

export default getTextForTrackerStatuses