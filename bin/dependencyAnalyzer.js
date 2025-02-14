
export async function analyzeDependencies(packageName, version) {
    try {
        const response = await fetch(`https://registry.npmjs.org/${packageName}/${version}`);
        const data = await response.json();

        return {
            dependencies: data.dependencies || {},
            devDependencies: data.devDependencies || {},
            peerDependencies: data.peerDependencies || {},
            bundleSize: await fetchBundleSize(packageName, version),
        };
    } catch (error) {
        console.error(`Error analyzing dependencies for ${packageName}:`, error);
        return null;
    }
}

async function fetchBundleSize(packageName, version) {
    try {
        const response = await fetch(
            `https://bundlephobia.com/api/size?package=${packageName}@${version}`
        );
        const data = await response.json();
        return {
            size: data.size,
            gzip: data.gzip
        };
    } catch (error) {
        return null;
    }
}