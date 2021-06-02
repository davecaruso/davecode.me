const { PHASE_PRODUCTION_SERVER, PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { debounce } = require('@reverse/debounce');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

let pageMap;
const cwd = process.cwd();

module.exports = function withPageFile({ pageExtensions = ['tsx', 'ts', 'jsx', 'js'], ...conf }, { phase }) {
  if (phase === PHASE_PRODUCTION_SERVER) return conf;

  function mapPageKey(s) {
    if (!isNaN(Number(s))) return '/' + s;
    if (s === 'app') return '/_app';
    if (s === 'document') return '/_document';
    if (s === 'error') return '/_error';
    return s;
  }
  
  function mapKeyDisplayName(s) {
    if (s === '/_app') return 'Custom App';
    if (s === '/_document') return 'Custom Document';
    if (s === '/_error') return 'Error Page';
    return 'Url ' + s;
  }
  
  const pagesFiles = ['pages.ts', 'pages.js'];
  const pagesFile = pagesFiles.find(fs.pathExistsSync);
  if (!pagesFile) {
    console.log(`${chalk.red('error')} - could not find a pages.js/ts file. add one.`);
    process.exit(121);
  }

  function updatePageMap() {
    const x = fs.readFileSync(path.join(cwd, pagesFile)).toString();
    const data = Function(x
      .replace('export default', 'return')
      .replace('as DaveCodePageMap', '')
      .replace(/import\('(.*)'\)/g, `'$1'`)
      .replace(/import\("(.*)"\)/g, `"$1"`)
    )();
    console.log(`${chalk.magenta('event')} - refreshing ${pagesFile}`);
    pageMap = Object.fromEntries(
      Object.entries(data).map(([page, src]) => {
        const key = mapPageKey(page);
        const extension = pageExtensions.find(x => fs.pathExistsSync(path.join(cwd, src + '.' + x)))
        if (!extension) {
          console.log(`${chalk.red('error')} - ${mapKeyDisplayName(key)} requests non existant ${src}!`);
          return null;
        }
        return [key, path.join('private-next-pages', src) + '.' + extension];
      })
      .filter(Boolean)
    );
  }
  
  updatePageMap();

  require('./onDemandEntryHandler');
  const nextBuildUtils = require('next/dist/build/utils');
  const nextBuildEntries = require('next/dist/build/entries');
  const nextFindPagesDir = require('next/dist/lib/find-pages-dir');
  const nextFindPageFile = require('next/dist/server/lib/find-page-file');
  const nextIsWriteable = require('next/dist/build/is-writeable');
  const nextPageExportLint = require('next/dist/build/babel/plugins/next-page-disallow-re-export-all-exports');
  
  const _isWriteable = nextIsWriteable.isWriteable;
  nextIsWriteable.isWriteable = async(dir) => {
    if (dir.endsWith('.js')) return fs.pathExists(dir);
    return _isWriteable(dir);
  }
  nextBuildUtils.collectPages = () => [];
  nextFindPagesDir.findPagesDir = () => cwd;
  nextBuildEntries.createPagesMapping = () => ({
      '/_app': pageMap['/_app'] || 'next/dist/pages/_app',
      '/_error': pageMap['/_error'] || 'next/dist/pages/_error',
      '/_document': pageMap['/_document'] || 'next/dist/pages/_document',
      // apply full page map in a build
      ...process.env.NODE_ENV === 'production' && pageMap,
  });
  nextFindPageFile.findPageFile = async (a, page, r) => {
    const key = page.replace(/\/index$/, '') || '/';
  
    return key in pageMap
      ? pageMap[key].replace('private-next-pages/', '/')
      : null;
  }
  const nextPageExportLintVisitor = nextPageExportLint.default().visitor.ExportAllDeclaration;
  nextPageExportLint.default = function() {
    return {
      visitor: {
        ExportAllDeclaration(path, ctx) {
          console.log('woah')
          nextPageExportLintVisitor(path, ctx);
        }
      }
    };
  }
  
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    fs.watch(path.resolve(pagesFile), { }, debounce((ev, file) => {
      updatePageMap();
    }, 100));

    let watchpack;
    try {
      const pnpapi = require('pnpapi');
      watchpack = require(pnpapi.getPackageInformation(pnpapi.getAllLocators().find(x => x.name === 'watchpack')).packageLocation)
    } catch (error) {
      watchpack = require('watchpack');
    }

    const watch = watchpack.prototype.watch;
    watchpack.prototype.watch = function() {
      watch.apply(this, [
        [path.join(cwd, pagesFile)],
        [],
        0
      ])
    }
    watchpack.prototype.getTimeInfoEntries = function() {
      const x = new Map(
        Object.entries(pageMap).map(([k, v]) => [cwd + k.replace(/^\/$/, '\/index') + '.js', { accuracy: true }])
      );
      return x;
    }
  }

  return conf;
}
