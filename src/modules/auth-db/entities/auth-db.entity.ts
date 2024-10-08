import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth')
export class AuthDb {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 45,
        unique: true,
        nullable: false,
    })
    table_name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    auth_string: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: true,
    })
    id_camera: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: true,
    })
    created_by: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    member: string;

}
