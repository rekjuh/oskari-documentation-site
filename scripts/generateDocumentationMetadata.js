// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grayMatter = require('gray-matter');

function getSubdirectories(rootDir) {
    return fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

function addFrontmatter(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fullOrdinal = path.basename(filePath).split(' ')[0];
    const internalOrdinal =
        fullOrdinal?.indexOf('.') > - 1 ?
        fullOrdinal.substring(fullOrdinal.indexOf('.') + 1, fullOrdinal.length) : 0;
    const frontmatter = `---\nordinal: ${internalOrdinal}\n---\n`;
    fs.writeFileSync(filePath, frontmatter + fileContent);
    return grayMatter(frontmatter);
}


function listContentsRecursively(directory, results = [], parentOrdinal) {
    const filesAndDirectories = fs.readdirSync(directory, { withFileTypes: true });

    filesAndDirectories.forEach(item => {
        const itemPath = path.join(directory, item.name);
        if (item.isDirectory()) {
            const directoryOrdinal = path.basename(itemPath).split(' ')[0];
            const children = listContentsRecursively(itemPath, [], directoryOrdinal);
            results.push({
                slug: item.name,
                ordinal: directoryOrdinal,
                children: children
            });
        } else {
            if (path.extname(itemPath).toLowerCase() === '.md') {
                const { data } = addFrontmatter(itemPath);
                results.push({ fileName: item.name, ...data, parentOrdinal });
            }
        }
    });

    return results;
}

// Write metadata for each version
function processVersions(rootDir) {
    const subdirectories = getSubdirectories(rootDir);

    for (const version of subdirectories) {
        const versionPath = path.join(rootDir, version);
        const versionContent = listContentsRecursively(versionPath);
        fs.writeFileSync(path.join(versionPath, 'index.js'), `const allDocs = ${JSON.stringify(versionContent, null, 2)};\n\nexport default allDocs;`);
        console.log('Wrote file ' + path.join(versionPath, 'index.js'));
    }
}

function generateDocumentationMetadata(dirPath) {
    const subdirectories = getSubdirectories(dirPath);
    const sortedVersions = subdirectories.sort((a, b) => parseFloat(a) - parseFloat(b));
    const indexContent = `const availableVersions = ${JSON.stringify(sortedVersions)};\n\nexport default availableVersions;`;
    fs.writeFileSync(path.join(dirPath, 'index.js'), indexContent);
    processVersions(dirPath);
}

const baseDirectoryDocs = path.normalize(path.join(__dirname, '../_content/docs/'));
console.log('Generating documentation metadata for folder ', baseDirectoryDocs);
generateDocumentationMetadata(baseDirectoryDocs);
