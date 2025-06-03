import { Entity, PrimaryKey, Property, Unique, TextType, OptionalProps } from '@mikro-orm/sqlite';
import { v4 } from 'uuid';

@Entity()
export class Users {
    [OptionalProps]?: 'created_at' | 'updated_at';

    @PrimaryKey({ type: 'uuid', columnType: 'uuid' })
    id = v4();

    @Property({ type: TextType })
    name?: string;

    @Property()
    @Unique()
    email!: string;

    @Property()
    created_at = new Date();

    @Property({ onUpdate: () => new Date() })
    updated_at = new Date();
}
