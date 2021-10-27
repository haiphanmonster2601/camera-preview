export * from './definitions';
export * from './web';
import { registerPlugin } from '@capacitor/core';
const Http = registerPlugin('CameraPere', {
    web: () => import('./web').then(m => new m.CameraPreviewWeb()),
});
export * from './definitions';
export { Http };
//# sourceMappingURL=index.js.map