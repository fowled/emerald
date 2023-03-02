import { getConfig } from "@/utils/config";
import rdm from "randomstring";

export async function startServer() {
    const { aternos_session, aternos_token, aternos_server_id } = await getConfig();

    const key = rdm.generate({ length: 8 }) + "00000";
    const value = rdm.generate({ length: 8 }) + "00000";

    const url = `https://aternos.org/panel/ajax/start.php?headstart=0&access-credits=0&SEC=${key}%3A${value}&TOKEN=${aternos_token}`;

    const request = await fetch(url, {
        headers: {
            cookie: `ATERNOS_SEC_${key}=${value}; ATERNOS_SERVER=${aternos_server_id}; ATERNOS_SESSION=${aternos_session}`,
        },
    });

    let status = 0;

    try {
        const response = await request.json();

        if (response.success) {
            return (status = 1);
        } else {
            return (status = 2);
        }
    } catch (err) {
        return (status = 3);
    }
}
