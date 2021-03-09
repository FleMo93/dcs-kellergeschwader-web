import { applyBindings } from "knockout";
import { registerControl as registerBanner } from './components/banner/Banner';
import { registerControl as registerFooter } from './components/footer/Footer';
import { registerControl as registerHead } from './components/head/Head';
import { registerControl as registerIndex } from './components/index/Index';

document.addEventListener('DOMContentLoaded', () => {
    registerBanner('banner');
    registerFooter('kellerfooter');
    registerHead('kellerhead');
    registerIndex('index');
    applyBindings({}, document.body);
});