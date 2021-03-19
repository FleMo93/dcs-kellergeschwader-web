import { applyBindings } from "knockout";
import { registerControl as registerBanner } from './components/banner/Banner';
import { registerControl as registerFooter } from './components/footer/Footer';
import { registerControl as registerHead } from './components/head/Head';
import { registerControl as registerTacviewrecords, Tacviewrecords } from './components/tacviewrecords/Tacviewrecords';

document.addEventListener('DOMContentLoaded', () => {
    registerBanner('banner');
    registerFooter('kellerfooter');
    registerHead('kellerhead');
    registerTacviewrecords('tacviewrecords');

    const tacviewRecords = new Tacviewrecords();
    applyBindings({ tacviewRecords: tacviewRecords }, document.body);
});