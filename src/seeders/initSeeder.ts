import type { EntityManager } from '@mikro-orm/sqlite';
import { Seeder } from '@mikro-orm/seeder';

export class InitSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {}
}
