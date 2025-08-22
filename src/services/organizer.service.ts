import { getOrganizers } from '../repositories/organizer.repository';

export const fetchOrganizers = async () => {
    return await getOrganizers();
};
