import { createProfiguration } from '@golevelup/profiguration';
import { Config } from './config.interface';

export const config = createProfiguration<Config>(
    {
        DATABASE_URL: {
            default: '',
            env: 'DATABASE_URL',
        }
    })