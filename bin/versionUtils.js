export function compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (v1[i] > v2[i]) return 1;
        if (v1[i] < v2[i]) return -1;
    }
    return 0;
}

export function getUpdateType(currentVersion, newVersion) {
    const [major1, minor1, patch1] = currentVersion.split('.').map(Number);
    const [major2, minor2, patch2] = newVersion.split('.').map(Number);

    if (major2 > major1) return 'MAJOR';
    if (minor2 > minor1) return 'MINOR';
    if (patch2 > patch1) return 'PATCH';
    return 'NONE';
}