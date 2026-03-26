import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1774482998787 implements MigrationInterface {
    name = 'Init1774482998787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`provincia\` \`provincia\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`municipio\` \`municipio\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`referencia\` \`referencia\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`referencia\` \`referencia\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`municipio\` \`municipio\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`provincia\` \`provincia\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
