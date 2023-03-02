import rdm from "randomstring";

import { getConfig } from "@/utils/config";

export async function createBackup() {
    const { aternos_session, aternos_token, aternos_server_id } = await getConfig();

    const key = rdm.generate({ length: 8 }) + "00000";
    const value = rdm.generate({ length: 8 }) + "00000";

    const url = `https://aternos.org/panel/ajax/driveBackup/create.php?SEC=${key}%3A${value}&TOKEN=${aternos_token}`;

    const createBackup = await fetch(url, {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            cookie: `ATERNOS_SEC_${key}=${value}; ATERNOS_SESSION=${aternos_session}; ATERNOS_SERVER=${aternos_server_id}`,

            body: "name=le_racisme_" + new Date().toLocaleDateString(),
            method: "POST",
        },
    });

    let success = 0;

    try {
        const response = await createBackup.json();

        if (response.success) {
            return (success = 1);
        } else {
            return (success = 2);
        }
    } catch (err) {
        return (success = 3);
    }
}
