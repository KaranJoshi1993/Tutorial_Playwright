import axios from 'axios';
import { ENVCONSTANTS } from './environment-constants';

export async function fetchSpecificEmail(subject: string, maxAgeMinutes: number = 2) {
    try {
        const response = await axios.get(
            `${ENVCONSTANTS.MAIL_TRAP_API_BASE_URL}/accounts/${ENVCONSTANTS.ACCOUNT_ID}/inboxes/${ENVCONSTANTS.INBOX_ID}/messages`,
            {
                headers: {
                    'Api-Token': ENVCONSTANTS.MAILTRAP_API_TOKEN,
                },
            }
        );

        const messages = response.data;

        if (messages.length === 0) {
            throw new Error('No emails found in the inbox.');
        }

        const now = new Date();

        // Normalize expected subject
        const normalizedExpectedSubject = normalizeSubject(subject);

        const filteredEmail = messages.find((message: any) => {
            const receivedTime = new Date(message.created_at);
            const ageInMinutes = (now.getTime() - receivedTime.getTime()) / (1000 * 60);

            // Normalize actual subject
            const normalizedActualSubject = normalizeSubject(message.subject);

            return (
                normalizedActualSubject.includes(normalizedExpectedSubject) &&
                ageInMinutes <= maxAgeMinutes
            );
        });

        if (!filteredEmail) {
            throw new Error(
                `No email found with subject "${subject}" within the last ${maxAgeMinutes} minutes.`
            );
        }

        return filteredEmail;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching specific email:', errorMessage);
        throw error;
    }
}

export async function fetchSpecificEmails(
    subject: string,
    maxAgeMinutes: number = 2,
    timeoutMs: number = 60000,
    pollIntervalMs: number = 5000
) {
    const startTime = Date.now();
    const normalizedExpectedSubject = normalizeSubject(subject);

    while (Date.now() - startTime < timeoutMs) {
        try {
            const response = await axios.get(
                `${ENVCONSTANTS.MAIL_TRAP_API_BASE_URL}/accounts/${ENVCONSTANTS.ACCOUNT_ID}/inboxes/${ENVCONSTANTS.INBOX_ID}/messages`,
                {
                    headers: {
                        'Api-Token': ENVCONSTANTS.MAILTRAP_API_TOKEN,
                    },
                }
            );

            const messages = response.data;

            if (messages.length === 0) {
                console.log('No emails found in the inbox.');
            }

            const now = new Date();
            const filteredEmails = messages.filter((message: any) => {
                const receivedTime = new Date(message.created_at);
                const ageInMinutes = (now.getTime() - receivedTime.getTime()) / (1000 * 60);
                const normalizedActualSubject = normalizeSubject(message.subject);

                return (
                    normalizedActualSubject === normalizedExpectedSubject &&
                    ageInMinutes <= maxAgeMinutes
                );
            });

            if (filteredEmails.length > 0) {
                return filteredEmails;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Error fetching emails:', errorMessage);
        }

        // Wait before the next poll
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error(
        `No emails found with subject ${subject} within the last ${maxAgeMinutes} minutes after waiting ${timeoutMs / 1000} seconds.`
    );
}

export async function fetchLatestEmail() {
    try {
        const response = await axios.get(
            `${ENVCONSTANTS.MAIL_TRAP_API_BASE_URL}/accounts/${ENVCONSTANTS.ACCOUNT_ID}/inboxes/${ENVCONSTANTS.INBOX_ID}/messages`,
            {
                headers: {
                    'Api-Token': ENVCONSTANTS.MAILTRAP_API_TOKEN,
                },
            }
        );

        const messages = response.data;

        if (messages.length === 0) {
            throw new Error('No emails found');
        }

        // Get the latest email (assuming it’s the first in the array)
        const latestEmail = messages[0];
        return latestEmail;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

export async function fetchAttachments(messageId: string) {
    try {
        const response = await axios.get(
            `${ENVCONSTANTS.MAIL_TRAP_API_BASE_URL}/accounts/${ENVCONSTANTS.ACCOUNT_ID}/inboxes/${ENVCONSTANTS.INBOX_ID}/messages/${messageId}/attachments`,
            {
                headers: {
                    'Api-Token': ENVCONSTANTS.MAILTRAP_API_TOKEN,
                },
            }
        );

        const attachments = response.data;

        // Get the latest email (assuming it’s the first in the array)
        return attachments;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

export async function getEmailContent(messageId: string) {
    const response = await axios.get(
        `${ENVCONSTANTS.MAIL_TRAP_API_BASE_URL}/accounts/${ENVCONSTANTS.ACCOUNT_ID}/inboxes/${ENVCONSTANTS.INBOX_ID}/messages/${messageId}/body.html`,
        {
            headers: {
                'Api-Token': ENVCONSTANTS.MAILTRAP_API_TOKEN,
            },
        }
    );

    return response.data;
}

function normalizeSubject(subject: string): string {
    // Normalize whitespace around '>' by replacing multiple spaces with a single space
    return subject.replace(/\s*>\s*/g, ' > ').trim().toLowerCase();
}

export async function getEmailsBySubject(subject: string, maxAgeMinutes: number = 2): Promise<any[]> {
    try {
        const response = await axios.get(
            `${ENVCONSTANTS.MAIL_TRAP_API_BASE_URL}/accounts/${ENVCONSTANTS.ACCOUNT_ID}/inboxes/${ENVCONSTANTS.INBOX_ID}/messages`,
            {
                headers: {
                    'Api-Token': ENVCONSTANTS.MAILTRAP_API_TOKEN,
                },
            }
        );

        const messages = response.data;

        if (messages.length === 0) {
            return [];
        }

        const now = new Date();

        // Normalize expected subject
        const normalizedExpectedSubject = normalizeSubject(subject);

        const filteredEmails = messages.filter((message: any) => {
            const receivedTime = new Date(message.created_at);
            const ageInMinutes = (now.getTime() - receivedTime.getTime()) / (1000 * 60);

            // Normalize actual subject
            const normalizedActualSubject = normalizeSubject(message.subject);

            return (
                normalizedActualSubject.includes(normalizedExpectedSubject) &&
                ageInMinutes <= maxAgeMinutes
            );
        });

        return filteredEmails;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching emails by subject and recipient:', errorMessage);
        return [];
    }
}
