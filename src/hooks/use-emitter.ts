import { useState } from 'react';
import { Emitter } from '../other/emitter';

export function useEmitter(): Emitter {
    const [emitter] = useState(() => new Emitter());

    return emitter;
}
