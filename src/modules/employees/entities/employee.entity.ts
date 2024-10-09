import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
        unique: true,
    })
    phoneNumber: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'boolean',
        nullable: false,
    })
    isAdmin: boolean;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: true,
    })
    pass: string;

    @Column({
        type: 'varchar',
        length: 45,
        nullable: true,
    })
    created_by: string;
}
