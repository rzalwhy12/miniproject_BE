import { Request, Response } from 'express';
import { fetchOrganizers } from '../services/organizer.service';

export const getOrganizerController = async (req: Request, res: Response) => {
    try {
        const organizers = await fetchOrganizers();
        res.status(200).json({ success: true, data: organizers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch organizers', error });
    }
};
