import { createProfiguration } from '@golevelup/profiguration';
import { Config } from './config.interface';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const config = createProfiguration<Config>(
    {
        DATABASE_URL: {
            default: '',
            env: 'DATABASE_URL',
        },

    },
    { strict: true, verbose: true },
);

