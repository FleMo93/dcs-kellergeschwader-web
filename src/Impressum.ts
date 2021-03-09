import { applyBindings } from "knockout";
import { registerControl as registerBanner } from './components/banner/Banner';
import { registerControl as registerFooter } from './components/footer/Footer';
import { registerControl as registerHead } from './components/head/Head';

document.addEventListener('DOMContentLoaded', () => {
    registerBanner('banner');
    registerFooter('kellerfooter');
    registerHead('kellerhead');
    applyBindings({}, document.body);
});