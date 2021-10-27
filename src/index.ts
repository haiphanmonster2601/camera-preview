export * from './definitions';
export * from './web';

import { registerPlugin } from '@capacitor/core';
import type { CameraPreviewPlugin } from './definitions';

const Http = registerPlugin<CameraPreviewPlugin>('CameraPere', {
  web: () => import('./web').then(m => new m.CameraPreviewWeb()),
});

export * from './definitions';
export { Http };