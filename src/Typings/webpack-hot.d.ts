interface NodeModule {
    hot?: { accept: (path: string, updateCallback: () => void) => void };
}
