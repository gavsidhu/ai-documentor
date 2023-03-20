async function constructSession(modelPath, fileName, progressCallback = null) {
    let buffer = await getModelFile(modelPath, fileName, progressCallback);

    let session = await InferenceSession.create(buffer, {
        // executionProviders: ["webgl"]
        executionProviders: ["wasm"]
    });

    return session
}