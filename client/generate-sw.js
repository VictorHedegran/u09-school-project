import { generateSW } from 'workbox-build'

generateSW({
    swDest: 'dist/sw.js', // Output
    globDirectory: 'dist', // Directory to match 'globPatterns' against
    globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'], // Cache all the main assets
    // add more configurations as needed
}).then(({ count, size, warnings }) => {
    warnings.forEach(console.warn)
    console.log(`${count} files will be precached, totaling ${size} bytes.`)
})
