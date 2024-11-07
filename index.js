/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/routes';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

//bildirime tıklandığı zaman bildiirmle alakalı olan sayfa açılsın. o sayfadana ana sayfaya geçiş butonu verilsin gelen bildirimler 5 taneye kadar async'de kaydedilsin proje için yeni firebase android projesi açılsın entegre süreci vs vs..
