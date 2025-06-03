import { Migration } from '@mikro-orm/migrations';

export class Migration20250602152838 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table \`users\` (\`id\` uuid not null, \`name\` text null, \`email\` text not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`id\`));`,
        );
        this.addSql(`create unique index \`users_email_unique\` on \`users\` (\`email\`);`);
    }
}
