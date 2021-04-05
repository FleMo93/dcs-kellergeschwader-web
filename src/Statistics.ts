import { applyBindings } from "knockout";
import { registerControl as registerBanner } from './components/banner/Banner';
import { registerControl as registerFooter } from './components/footer/Footer';
import { registerControl as registerHead } from './components/head/Head';
import { registerControl as registerPagingTable } from "./components/pagingTable/PagingTable";
import { registerControl as registerStatistics, Statistics } from './components/statistics/Statistics';

document.addEventListener('DOMContentLoaded', () => {
    registerBanner('banner');
    registerFooter('kellerfooter');
    registerHead('kellerhead');
    registerStatistics('statistics');
    registerPagingTable('pagingtable');

    applyBindings({ statistics: new Statistics() }, document.body);
});