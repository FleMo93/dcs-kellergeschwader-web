import { applyBindings } from "knockout";
import { registerControl as registerBanner } from './components/banner/Banner';
import { registerControl as registerFooter } from './components/footer/Footer';
import { registerControl as registerHead } from './components/head/Head';
import { registerControl as registerServerstatus, ServerStatus } from './components/serverstatus/Serverstatus';

document.addEventListener('DOMContentLoaded', () => {
    registerBanner('banner');
    registerFooter('kellerfooter');
    registerHead('kellerhead');
    registerServerstatus('serverstatus');
    const serverStatus = new ServerStatus(5 * 1000 * 60);

    applyBindings({ serverStatus: serverStatus }, document.body);
});