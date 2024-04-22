
import slugify from 'slugify';
import ApiSectionContentPage from '../../../components/ApiSectionContentPage';
import BundlesSidebarContent from '../../../components/BundlesSidebarContent';
import HtmlContentPage from '../../../components/HtmlContentPage';
import Error from '@/components/Error';
export default async function BundlesMainPage({
  params
}: {
  params: { version: string, slug: string }
}) {

  const bundlesBasePath = '_content/api/versions/' + params.version + '/';
  const bundles = (await import('_content/api/versions/' + params.version + '/bundles.json')).default;
  const bundleBaseRef = '/resources/api/bundles/' + params.version + '/';

  let allBundles: Array<{name: string, path: string}> = [];
  Object.keys(bundles).forEach(key => allBundles = allBundles.concat(bundles[key].bundles));

  const foundBundle = allBundles.find(element => slugify(element.name) === params.slug);
  if (!foundBundle) {
    return <Error text='No bundle doc found' code='404' />
  }
  return <ApiSectionContentPage
    version={params.version}
    sideBarContent={<BundlesSidebarContent elements={bundles} baseHref={bundleBaseRef}/>}
    mainContent={<HtmlContentPage path={bundlesBasePath + '/' + foundBundle.path + '/bundle.html'}  />}
    title='Oskari API documentation'
    baseHref='/resources/api/bundles/'/>;
}

//