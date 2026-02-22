async function fetchJson(path) {
    const res = await fetch(path, {headers: { Accept:"application/json" } });
    if ( !res.ok )
    {
        throw new Error(`Failed to fetch ${path} (${res.status})`);
    }
    return res.json();
}
export function getCreator(id) {
    return fetchJson(`/mock/creators.${id}.json`);
}

export function getCampaigns(id) {
    return fetchJson(`/mock/campaigns.${id}.json`);
}

export function getSubmissions(id) {
    return fetchJson(`/mock/submissions.${id}.json`);
}